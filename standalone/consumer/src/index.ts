import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IConsumerServiceConfiguration } from "p2p-energy-common/dist/models/config/consumer/IConsumerServiceConfiguration";
import { IConsumerManagerState } from "p2p-energy-common/dist/models/state/IConsumerManagerState";
import { ApiRegistrationService } from "p2p-energy-common/dist/services/api/apiRegistrationService";
import { ApiStorageService } from "p2p-energy-common/dist/services/api/apiStorageService";
import { ConsoleLoggingService } from "p2p-energy-common/dist/services/consoleLoggingService";
import { ConsumerManager } from "p2p-energy-common/dist/services/consumerManager";
import { LocalFileStorageService } from "p2p-energy-common/dist/services/storage/localFileStorageService";

// tslint:disable:no-var-requires no-require-imports
const packageJson = require("../package.json");
const configId = process.env.CONFIG_ID || "local";
// tslint:disable-next-line:non-literal-require
const config: IConsumerServiceConfiguration = require(`./data/config.${configId}.json`);

const loggingService = new ConsoleLoggingService();

ServiceFactory.register("logging", () => loggingService);
ServiceFactory.register("consumer-registration", () => new ApiRegistrationService(config.gridApiEndpoint));

if (config.localStorageFolder) {
    ServiceFactory.register(
        "consumer-storage-manager-state",
        () => new LocalFileStorageService<IConsumerManagerState>(
            config.localStorageFolder, config.consumer.id, "config"));
} else {
    ServiceFactory.register("consumer-storage-manager-state", () => new ApiStorageService<IConsumerManagerState>(
        config.gridApiEndpoint,
        config.consumer.id,
        "config"));
}

loggingService.log("app", `Consumer v${packageJson.version}`);
loggingService.log("app", `Config '${configId}'`);
loggingService.log("app", `   Id: ${config.consumer.id}`);
loggingService.log("app", `   Name: ${config.consumer.name}`);

/**
 * Start the consumer running.
 * @param consumerManager The consumer manager to start.
 */
async function start(consumerManager: ConsumerManager): Promise<void> {
    await consumerManager.initialise();

    // await consumerService.closedown();
}

start(new ConsumerManager(config.consumer, config.node))
    .catch(err => console.log(err));
