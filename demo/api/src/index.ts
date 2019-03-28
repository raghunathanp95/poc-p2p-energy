import { AmazonS3StorageService, App, ConsoleLoggingService, IRoute, LocalFileStorageService, ServiceFactory } from "poc-p2p-energy-grid-common";
import { IDemoApiConfiguration } from "./models/IDemoApiConfiguration";

const routes: IRoute<IDemoApiConfiguration>[] = [
    { path: "/init", method: "get", func: "init" }
];

const loggingService = new ConsoleLoggingService();
const app = new App<IDemoApiConfiguration>(4000, loggingService, __dirname);

app.build(routes, async (_1, config, _2) => {
    ServiceFactory.register("logging", () => loggingService);
    if (config.localStorageFolder) {
        ServiceFactory.register(
            "storage",
            () => new LocalFileStorageService(config.localStorageFolder, "demo-api", "storage")
        );
    } else if (config.s3Connection) {
        ServiceFactory.register(
            "storage",
            () => new AmazonS3StorageService(config.s3Connection, "demo-api"));
    }
}).catch(err => {
    loggingService.error("app", `Failed during app build`, err);
});
