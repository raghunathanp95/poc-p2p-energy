import {
    ApiStorageService,
    App,
    ConsoleLoggingService,
    IRegistration,
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
import { ProducerService } from "./services/producerService";

const routes: IRoute<IConfiguration>[] = [
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
const app = new App<IConfiguration>(4001, loggingService, __dirname);

app.build(routes, async (_1, config, _2) => {
    loggingService.log("app", `Tangle Provider ${config.node.provider}`);

    ServiceFactory.register("logging", () => loggingService);
    ServiceFactory.register(
        "registration-storage",
        () => new ApiStorageService<IRegistration>(config.gridApiEndpoint, config.producer.id, "registration")
    );

    const producerService = new ProducerService(config.producer, config.gridApiEndpoint, config.node);
    const registrationService = new RegistrationService(
        config.node,
        producerService.shouldCreateReturnChannel,
        producerService.handleCommands);

    ServiceFactory.register("registration-management", () => registrationService);
    ServiceFactory.register("producer", () => producerService);
    ServiceFactory.register(
        "storage",
        () => new ApiStorageService<any>(config.gridApiEndpoint, config.producer.id, "storage")
    );

    await producerService.initialise();
    await registrationService.loadRegistrations();

    const schedules: ISchedule[] = [
        {
            name: "Producer Consumer Registrations",
            schedule: "*/15 * * * * *",
            func: async () => registrationService.updateRegistrations()
        },
        {
            name: "Producer Output",
            schedule: "*/60 * * * * *",
            func: async () => producerService.updateProducerOutput()
        }
    ];

    await ScheduleHelper.build(schedules, loggingService);
}).catch(err => {
    loggingService.error("app", `Failed during app build`, err);
});
