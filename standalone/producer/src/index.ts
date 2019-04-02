import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IRoute } from "p2p-energy-common/dist/models/app/IRoute";
import { ISchedule } from "p2p-energy-common/dist/models/app/ISchedule";
import { IProducerServiceConfiguration } from "p2p-energy-common/dist/models/config/producer/IProducerServiceConfiguration";
import { ISourceStore } from "p2p-energy-common/dist/models/db/producer/ISourceStore";
import { IRegistration } from "p2p-energy-common/dist/models/services/registration/IRegistration";
import { IProducerState } from "p2p-energy-common/dist/models/state/IProducerState";
import { registrationDelete, registrationSet } from "p2p-energy-common/dist/routes/registrationRoutes";
import { storageDelete, storageGet, storageList, storageSet } from "p2p-energy-common/dist/routes/storageRoutes";
import { ApiStorageService } from "p2p-energy-common/dist/services/api/apiStorageService";
import { ConsoleLoggingService } from "p2p-energy-common/dist/services/consoleLoggingService";
import { ProducerService } from "p2p-energy-common/dist/services/producerService";
import { RegistrationService } from "p2p-energy-common/dist/services/registrationService";
import { LocalFileStorageService } from "p2p-energy-common/dist/services/storage/localFileStorageService";
import { App } from "p2p-energy-common/dist/utils/app";
import { ScheduleHelper } from "p2p-energy-common/dist/utils/scheduleHelper";

const routes: IRoute<IProducerServiceConfiguration>[] = [
    { path: "/initialise", method: "get", func: "initialise" },
    { path: "/closedown", method: "get", func: "closedown" },
    { path: "/reset", method: "get", func: "reset" },
    { path: "/storage/:registrationId/:context", method: "get", inline: storageList },
    { path: "/storage/:registrationId/:context/:id", method: "put", inline: storageSet, dataBody: true },
    { path: "/storage/:registrationId/:context/:id", method: "get", inline: storageGet },
    { path: "/storage/:registrationId/:context?/:id?", method: "delete", inline: storageDelete },
    { path: "/registration/:registrationId", method: "put", inline: registrationSet },
    { path: "/registration/:registrationId", method: "delete", inline: registrationDelete }
];

const loggingService = new ConsoleLoggingService();
const app = new App<IProducerServiceConfiguration>(4001, loggingService, __dirname);

app.build(routes, async (_1, config, _2) => {
    loggingService.log("app", `Tangle Provider ${config.node.provider}`);

    ServiceFactory.register("logging", () => loggingService);

    if (config.localStorageFolder) {
        ServiceFactory.register(
            "registration-storage",
            () => new LocalFileStorageService<IRegistration>(
                config.localStorageFolder, config.producer.id, "registration")
        );

        ServiceFactory.register(
            "storage-config",
            () => new LocalFileStorageService<IProducerState>(config.localStorageFolder, config.producer.id, "config"));
    } else {
        ServiceFactory.register(
            "registration-storage",
            () => new ApiStorageService<IRegistration>(config.gridApiEndpoint, config.producer.id, "registration")
        );

        ServiceFactory.register("storage-config", () => new ApiStorageService<IProducerState>(
            config.gridApiEndpoint,
            config.producer.id,
            "config"));
    }

    const producerService = new ProducerService(config.producer, config.gridApiEndpoint, config.node);
    const registrationService = new RegistrationService(config.node, producerService.shouldCreateReturnChannel);

    ServiceFactory.register("registration-management", () => registrationService);
    ServiceFactory.register("producer", () => producerService);

    if (config.localStorageFolder) {
        ServiceFactory.register(
            "storage",
            () => new LocalFileStorageService<any>(config.localStorageFolder, config.producer.id, "storage"));

        ServiceFactory.register(
            "source-store",
            () => new LocalFileStorageService<ISourceStore>(
                config.localStorageFolder, config.producer.id, "source-output"));
    } else {
        ServiceFactory.register(
            "storage",
            () => new ApiStorageService<any>(config.gridApiEndpoint, config.producer.id, "storage")
        );
        ServiceFactory.register(
            "source-store",
            () => new ApiStorageService<ISourceStore>(config.gridApiEndpoint, config.producer.id, "source-output")
        );
    }

    await producerService.initialise();
    await registrationService.loadRegistrations();

    const schedules: ISchedule[] = [
        {
            name: "Poll for Commands",
            schedule: "*/15 * * * * *",
            func: async () => registrationService.pollCommands(
                (registration, commands) => producerService.handleCommands(registration, commands))
        },
        {
            name: "Collate Sources",
            schedule: "*/60 * * * * *",
            func: async () => producerService.collateSources((startTime, endTime, value) => {
                // Calculate a cost for the output slice, you could base this on time of day, value etc
                return 1000;
            })
        }
    ];

    await ScheduleHelper.build(schedules, loggingService);
}).catch(err => {
    loggingService.error("app", `Failed during app build`, err);
});