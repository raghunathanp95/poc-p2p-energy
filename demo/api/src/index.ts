import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IRoute } from "p2p-energy-common/dist/models/app/IRoute";
import { AmazonS3StorageService } from "p2p-energy-common/dist/services/amazon/amazonS3StorageService";
import { ConsoleLoggingService } from "p2p-energy-common/dist/services/consoleLoggingService";
import { LocalFileStorageService } from "p2p-energy-common/dist/services/storage/localFileStorageService";
import { App } from "p2p-energy-common/dist/utils/app";
import { IDemoApiConfiguration } from "./models/IDemoApiConfiguration";
import { WalletStateService } from "./services/walletStateService";

const routes: IRoute<IDemoApiConfiguration>[] = [
    { path: "/init", method: "get", func: "init" },
    { path: "/grid", method: "post", folder: "grid", func: "gridPost" },
    { path: "/grid/:name", method: "get", folder: "grid", func: "gridGet" },
    { path: "/grid/:name", method: "put", folder: "grid", func: "gridPut" },
    { path: "/grid/:name", method: "delete", folder: "grid", func: "gridDelete" },
    { path: "/grid/password/:name", method: "put", folder: "grid", func: "gridPasswordPut" },
    { path: "/wallet", method: "get", folder: "wallet", func: "walletGet" }
];

const loggingService = new ConsoleLoggingService();
const app = new App<IDemoApiConfiguration>(4000, loggingService, __dirname);

app.build(routes, async (_1, config, _2) => {
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
        () => new WalletStateService(config.dynamoDbConnection));
}).catch(err => {
    loggingService.error("app", `Failed during app build`, err);
});
