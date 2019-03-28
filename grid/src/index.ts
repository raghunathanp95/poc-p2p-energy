import { AmazonS3RegistrationService, AmazonS3StorageService, App, ConsoleLoggingService, GridService, IGridServiceConfiguration, IGridState, IRoute, ISchedule, LocalFileStorageService, ProducerOutputPaymentService, ProducerStoreService, registrationDelete, RegistrationService, registrationSet, ScheduleHelper, ServiceFactory, storageDelete, storageGet, storageList, storageSet } from "poc-p2p-energy-grid-common";

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
            () => new LocalFileStorageService<IGridState>(config.localStorageFolder, config.grid.id, "config"));
    } else if (config.dynamoDbConnection) {
        ServiceFactory.register(
            "registration-storage",
            () => new AmazonS3RegistrationService(config.dynamoDbConnection));

        ServiceFactory.register(
            "storage-config",
            () => new AmazonS3StorageService(config.s3Connection, "config"));
    }

    const gridService = new GridService(config.node);
    const registrationService = new RegistrationService(config.node, gridService.shouldCreateReturnChannel);

    ServiceFactory.register("registration-management", () => registrationService);
    ServiceFactory.register("grid", () => gridService);

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

    await gridService.initialise();
    await registrationService.loadRegistrations();

    const schedules: ISchedule[] = [
        {
            name: "Poll for Commands",
            schedule: "*/15 * * * * *",
            func: async () => registrationService.pollCommands(
                (registration, commands) => gridService.handleCommands(registration, commands))
        },
        {
            name: "Calculate asking prices",
            schedule: "*/15 * * * * *",
            func: async () => gridService.calculateAskingPrices((startTime, endTime, output, askingPrice) => {
                // Calculate a price for the output based on its details and the asking price
                return Math.floor(askingPrice * 0.95);
            })
        },
        {
            name: "Check Payments",
            schedule: "*/15 * * * * *",
            func: async () => gridService.checkPayments()
        }
    ];

    await ScheduleHelper.build(schedules, loggingService);
}).catch(err => {
    loggingService.error("app", `Failed during app build`, err);
});
