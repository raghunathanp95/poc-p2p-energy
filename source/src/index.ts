import { ApiStorageService, ConsoleLoggingService, LocalFileStorageService, ServiceFactory } from "poc-p2p-energy-grid-common";
import { IConfiguration } from "./models/IConfiguration";
import { ISourceState } from "./models/ISourceState";
import { SourceService } from "./services/sourceService";

// tslint:disable:no-var-requires no-require-imports
const packageJson = require("../package.json");
const configId = process.env.CONFIG_ID || "local";
// tslint:disable-next-line:non-literal-require
const config: IConfiguration = require(`./data/config.${configId}.json`);

const loggingService = new ConsoleLoggingService();
ServiceFactory.register("logging", () => loggingService);
if (config.localStorageFolder) {
    ServiceFactory.register(
        "storage-config",
        () => new LocalFileStorageService<ISourceState>(config.localStorageFolder, config.source.id, "config"));
} else {
    ServiceFactory.register("storage-config", () => new ApiStorageService<ISourceState>(
        config.producerApiEndpoint,
        config.source.id,
        "config"));
}

loggingService.log("app", `Source v${packageJson.version}`);
loggingService.log("app", `Config '${configId}'`);
loggingService.log("app", `   Id: ${config.source.id}`);
loggingService.log("app", `   Name: ${config.source.name}`);
loggingService.log("app", `   Type: ${config.source.type}`);

/**
 * Start the source running.
 * @param sourceService The source service to start.
 */
async function start(sourceService: SourceService): Promise<void> {
    await sourceService.intialise();

    for (let i = 0; i < 5; i++) {
        // tslint:disable-next-line:insecure-random
        await sourceService.sendOutputCommand(Math.random() * 1000);
    }

    // await sourceService.closedown();
}

start(new SourceService(config.source, config.producerApiEndpoint, config.node))
    .catch(err => console.log(err));
