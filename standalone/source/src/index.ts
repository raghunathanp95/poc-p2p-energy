import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { ISourceServiceConfiguration } from "p2p-energy-common/dist/models/config/source/ISourceServiceConfiguration";
import { ISourceState } from "p2p-energy-common/dist/models/state/ISourceState";
import { ApiRegistrationService } from "p2p-energy-common/dist/services/api/apiRegistrationService";
import { ApiStorageService } from "p2p-energy-common/dist/services/api/apiStorageService";
import { ConsoleLoggingService } from "p2p-energy-common/dist/services/consoleLoggingService";
import { SourceService } from "p2p-energy-common/dist/services/sourceService";
import { LocalFileStorageService } from "p2p-energy-common/dist/services/storage/localFileStorageService";

// tslint:disable:no-var-requires no-require-imports
const packageJson = require("../package.json");
const configId = process.env.CONFIG_ID || "local";
// tslint:disable-next-line:non-literal-require
const config: ISourceServiceConfiguration = require(`./data/config.${configId}.json`);

const loggingService = new ConsoleLoggingService();

ServiceFactory.register("logging", () => loggingService);
ServiceFactory.register("registration", () => new ApiRegistrationService(config.producerApiEndpoint));

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

    // Don't close down unless you want to remove the registration
    // await sourceService.closedown();
}

start(new SourceService(config.source, config.node))
    .catch(err => console.log(err));
