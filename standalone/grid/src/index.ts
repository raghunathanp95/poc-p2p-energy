import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IRoute } from "p2p-energy-common/dist/models/app/IRoute";
import { ISchedule } from "p2p-energy-common/dist/models/app/ISchedule";
import { IGridServiceConfiguration } from "p2p-energy-common/dist/models/config/grid/IGridServiceConfiguration";
import { IGridManagerState } from "p2p-energy-common/dist/models/state/IGridManagerState";
import { registrationDelete, registrationSet } from "p2p-energy-common/dist/routes/registrationRoutes";
import { storageDelete, storageGet, storageList, storageSet } from "p2p-energy-common/dist/routes/storageRoutes";
import { AmazonS3RegistrationService } from "p2p-energy-common/dist/services/amazon/amazonS3RegistrationService";
import { AmazonS3StorageService } from "p2p-energy-common/dist/services/amazon/amazonS3StorageService";
import { ConsoleLoggingService } from "p2p-energy-common/dist/services/consoleLoggingService";
import { ProducerOutputPaymentService } from "p2p-energy-common/dist/services/db/producerOutputPaymentService";
import { ProducerStoreService } from "p2p-energy-common/dist/services/db/producerStoreService";
import { GridManager } from "p2p-energy-common/dist/services/gridManager";
import { RegistrationManagementService } from "p2p-energy-common/dist/services/registrationManagementService";
import { LocalFileStorageService } from "p2p-energy-common/dist/services/storage/localFileStorageService";
import { App } from "p2p-energy-common/dist/utils/app";
import { ScheduleHelper } from "p2p-energy-common/dist/utils/scheduleHelper";

const routes: IRoute<IGridServiceConfiguration>[] = [
    { path: "/init", method: "get", func: "init" },
    { path: "/storage/:registrationId/:context", method: "get", inline: storageList },
    { path: "/storage/:registrationId/:context/:id", method: "put", inline: storageSet, dataBody: true },
    { path: "/storage/:registrationId/:context/:id", method: "get", inline: storageGet },
    { path: "/storage/:registrationId/:context?/:id?", method: "delete", inline: storageDelete },
    { path: "/registration/:registrationId", method: "put", inline: registrationSet },
    { path: "/registration/:registrationId", method: "delete", inline: registrationDelete }
];

const loggingService = new ConsoleLoggingService();
const app = new App<IGridServiceConfiguration>(4000, loggingService, __dirname);

app.build(routes, async (_1, config, _2) => {
    loggingService.log("app", `Tangle Provider ${config.node.provider}`);

    ServiceFactory.register("logging", () => loggingService);
    if (config.localStorageFolder) {
        ServiceFactory.register(
            "registration-storage",
            () => new LocalFileStorageService(config.localStorageFolder, config.grid.id, "registration")
        );

        ServiceFactory.register(
            "storage-config",
            () => new LocalFileStorageService<IGridManagerState>(config.localStorageFolder, config.grid.id, "config"));
    } else if (config.dynamoDbConnection) {
        ServiceFactory.register(
            "registration-storage",
            () => new AmazonS3RegistrationService(config.dynamoDbConnection));

        ServiceFactory.register(
            "storage-config",
            () => new AmazonS3StorageService(config.s3Connection, "config"));
    }

    const gridManager = new GridManager(config.node);
    const registrationManagementService =
        new RegistrationManagementService(config.node, gridManager.shouldCreateReturnChannel);

    ServiceFactory.register("registration-management", () => registrationManagementService);
    ServiceFactory.register("grid", () => gridManager);

    if (config.localStorageFolder) {
        ServiceFactory.register(
            "storage",
            () => new LocalFileStorageService(config.localStorageFolder, config.grid.id, "storage"));
    } else if (config.s3Connection) {
        ServiceFactory.register(
            "storage",
            () => new AmazonS3StorageService(config.s3Connection, "storage"));
    }
    if (config.localStorageFolder) {
        ServiceFactory.register(
            "producer-output",
            () => new LocalFileStorageService(config.localStorageFolder, config.grid.id, "producer"));
        ServiceFactory.register(
            "producer-output-payment",
            () => new LocalFileStorageService(config.localStorageFolder, config.grid.id, "producer-paid"));
    } else if (config.dynamoDbConnection) {
        ServiceFactory.register(
            "producer-output",
            () => new ProducerStoreService(config.dynamoDbConnection));
        ServiceFactory.register(
            "producer-output-payment",
            () => new ProducerOutputPaymentService(config.dynamoDbConnection));
    }

    await gridManager.initialise();
    await registrationManagementService.loadRegistrations();

    const schedules: ISchedule[] = [
        {
            name: "Poll for Commands",
            schedule: "*/15 * * * * *",
            func: async () => registrationManagementService.pollCommands(
                (registration, commands) => gridManager.handleCommands(registration, commands))
        },
        {
            name: "Calculate asking prices",
            schedule: "*/15 * * * * *",
            func: async () => gridManager.calculateAskingPrices((startTime, endTime, output, askingPrice) => {
                // Calculate a price for the output based on its details and the asking price
                return Math.floor(askingPrice * 0.95);
            })
        },
        {
            name: "Check Payments",
            schedule: "*/15 * * * * *",
            func: async () => gridManager.checkPayments()
        }
    ];

    await ScheduleHelper.build(schedules, loggingService);
}).catch(err => {
    loggingService.error("app", `Failed during app build`, err);
});
