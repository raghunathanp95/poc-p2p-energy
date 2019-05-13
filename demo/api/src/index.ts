import { LoadBalancerSettings, RandomWalkStrategy } from "@iota/client-load-balancer";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IRoute } from "p2p-energy-common/dist/models/app/IRoute";
import { ISchedule } from "p2p-energy-common/dist/models/app/ISchedule";
import { AmazonS3StorageService } from "p2p-energy-common/dist/services/amazon/amazonS3StorageService";
import { ConsoleLoggingService } from "p2p-energy-common/dist/services/consoleLoggingService";
import { LocalFileStorageService } from "p2p-energy-common/dist/services/storage/localFileStorageService";
import { App } from "p2p-energy-common/dist/utils/app";
import { ScheduleHelper } from "p2p-energy-common/dist/utils/scheduleHelper";
import { IDemoApiConfiguration } from "./models/IDemoApiConfiguration";
import { PaymentRegistrationService } from "./services/PaymentRegistrationService";
import { WalletStateService } from "./services/walletStateService";

const routes: IRoute<IDemoApiConfiguration>[] = [
    { path: "/init", method: "get", func: "init" },
    { path: "/grid", method: "post", folder: "grid", func: "gridPost" },
    { path: "/grid/:name", method: "get", folder: "grid", func: "gridGet" },
    { path: "/grid/:name", method: "put", folder: "grid", func: "gridPut" },
    { path: "/grid/:name", method: "delete", folder: "grid", func: "gridDelete" },
    { path: "/grid/password/:name", method: "put", folder: "grid", func: "gridPasswordPut" },
    { path: "/payment/register", method: "post", folder: "payment", func: "registerPost" },
    { path: "/payment/:registrationId/address/", method: "post", folder: "payment", func: "addressPost" },
    { path: "/payment/:registrationId/transfer/", method: "post", folder: "payment", func: "transferPost" },
    { path: "/wallet", method: "get", folder: "wallet", func: "walletGet" }
];

const loggingService = new ConsoleLoggingService();
const app = new App<IDemoApiConfiguration>(4000, loggingService, __dirname);

app.build(routes, async (_1, config, _2) => {
    const walletStateService = new WalletStateService(config.dynamoDbConnection);

    ServiceFactory.register("logging", () => loggingService);
    if (config.localStorageFolder) {
        ServiceFactory.register(
            "storage",
            () => new LocalFileStorageService(`${config.localStorageFolder}/grids`)
        );
    } else if (config.s3Connection) {
        ServiceFactory.register(
            "storage",
            () => new AmazonS3StorageService(config.s3Connection, "grids"));
    }

    ServiceFactory.register(
        "wallet-state",
        () => walletStateService);

    ServiceFactory.register(
        "payment-registration",
        () => new PaymentRegistrationService(config.dynamoDbConnection));

    const loadBalancerSettings: LoadBalancerSettings = {
        nodeWalkStrategy: new RandomWalkStrategy(config.nodes),
        timeoutMs: 10000
    };

    ServiceFactory.register("load-balancer-settings", () => loadBalancerSettings);

    const schedules: ISchedule[] = [
        // {
        //     name: "Send Transfers",
        //     schedule: "*/5 * * * * *",
        //     func: async () => walletStateService.sendTransfers(loadBalancerSettings, config.walletSeed)
        // }
    ];

    await ScheduleHelper.build(schedules, loggingService);

}).catch(err => {
    loggingService.error("app", `Failed during app build`, err);
});
