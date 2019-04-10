import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { ISourceServiceConfiguration } from "p2p-energy-common/dist/models/config/source/ISourceServiceConfiguration";
import { ISourceManagerState } from "p2p-energy-common/dist/models/state/ISourceManagerState";
import { ApiRegistrationService } from "p2p-energy-common/dist/services/api/apiRegistrationService";
import { ApiStorageService } from "p2p-energy-common/dist/services/api/apiStorageService";
import { ConsoleLoggingService } from "p2p-energy-common/dist/services/consoleLoggingService";
import { SourceManager } from "p2p-energy-common/dist/services/sourceManager";
import { LocalFileStorageService } from "p2p-energy-common/dist/services/storage/localFileStorageService";

// tslint:disable:no-var-requires no-require-imports
const packageJson = require("../package.json");
const configId = process.env.CONFIG_ID || "local";
// tslint:disable-next-line:non-literal-require
const config: ISourceServiceConfiguration = require(`./data/config.${configId}.json`);

const loggingService = new ConsoleLoggingService();

ServiceFactory.register("logging", () => loggingService);
ServiceFactory.register("source-registration", () => new ApiRegistrationService(config.producerApiEndpoint));

if (config.localStorageFolder) {
    ServiceFactory.register(
        "source-storage-manager-state",
        () => new LocalFileStorageService<ISourceManagerState>(config.localStorageFolder, config.source.id, "config"));
} else {
    ServiceFactory.register("source-storage-manager-state", () => new ApiStorageService<ISourceManagerState>(
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
 * @param sourceManager The source manager to start.
 */
async function start(sourceManager: SourceManager): Promise<void> {
    await sourceManager.intialise();

    for (let i = 0; i < 5; i++) {
        // tslint:disable-next-line:insecure-random
        await sourceManager.sendOutputCommand(Math.random() * 1000);
    }

    // Don't close down unless you want to remove the registration
    // await sourceService.closedown();
}

start(new SourceManager(config.source, config.node))
    .catch(err => console.log(err));
