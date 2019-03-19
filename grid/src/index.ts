import {
    AmazonS3RegistrationService,
    AmazonS3StorageService,
    App,
    ConsoleLoggingService,
    IRoute,
    ISchedule,
    registrationDelete,
    RegistrationService,
    registrationSet,
    ScheduleHelper,
    ServiceFactory,
    storageDelete,
    storageGet,
    storageList,
    storageSet
} from "poc-p2p-energy-grid-common";
import { IConfiguration } from "./models/IConfiguration";
import { GridService } from "./services/gridService";
import { ProducerStoreService } from "./services/producerStoreService";

const routes: IRoute<IConfiguration>[] = [
    { path: "/init", method: "get", func: "init" },
    { path: "/storage/:registrationId/:context", method: "get", inline: storageList },
    { path: "/storage/:registrationId/:context/:id", method: "put", inline: storageSet, dataBody: true },
    { path: "/storage/:registrationId/:context/:id", method: "get", inline: storageGet },
    { path: "/storage/:registrationId/:context?/:id?", method: "delete", inline: storageDelete },
    { path: "/registration/:registrationId", method: "put", inline: registrationSet },
    { path: "/registration/:registrationId", method: "delete", inline: registrationDelete }
];

const loggingService = new ConsoleLoggingService();
const app = new App<IConfiguration>(4000, loggingService, __dirname);

app.build(routes, async (_1, config, _2) => {
    loggingService.log("app", `Tangle Provider ${config.node.provider}`);

    ServiceFactory.register("logging", () => loggingService);
    ServiceFactory.register("registration-storage", () => new AmazonS3RegistrationService(config.dynamoDbConnection));

    const gridService = new GridService();
    const registrationService = new RegistrationService(
        config.node,
        gridService.shouldCreateReturnChannel,
        gridService.handleCommands);

    ServiceFactory.register("registration-management", () => registrationService);
    ServiceFactory.register("grid", () => gridService);
    ServiceFactory.register("storage", () => new AmazonS3StorageService(config.s3Connection, config.storageBucket));
    ServiceFactory.register("producer-store", () => new ProducerStoreService(config.dynamoDbConnection));

    await registrationService.loadRegistrations();

    const schedules: ISchedule[] = [
        {
            name: "Grid Registrations",
            schedule: "*/15 * * * * *",
            func: async () => registrationService.updateRegistrations()
        }
    ];

    await ScheduleHelper.build(schedules, loggingService);
}).catch(err => {
    loggingService.error("app", `Failed during app build`, err);
});
