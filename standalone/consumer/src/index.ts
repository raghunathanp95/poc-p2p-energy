import { LoadBalancerSettings, RandomWalkStrategy } from "@iota/client-load-balancer";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IConsumerServiceConfiguration } from "p2p-energy-common/dist/models/config/consumer/IConsumerServiceConfiguration";
import { IConsumerManagerState } from "p2p-energy-common/dist/models/state/IConsumerManagerState";
import { ConsoleLoggingService } from "p2p-energy-common/dist/services/consoleLoggingService";
import { ConsumerManager } from "p2p-energy-common/dist/services/consumerManager";
import { ApiRegistrationService } from "p2p-energy-common/dist/services/registration/apiRegistrationService";
import { ApiStorageService } from "p2p-energy-common/dist/services/storage/apiStorageService";
import { LocalFileStorageService } from "p2p-energy-common/dist/services/storage/localFileStorageService";

// tslint:disable:no-var-requires no-require-imports
const packageJson = require("../package.json");
const configId = process.env.CONFIG_ID || "local";
// tslint:disable-next-line:non-literal-require
const config: IConsumerServiceConfiguration = require(`./data/config.${configId}.json`);

const loggingService = new ConsoleLoggingService();

const loadBalancerSettings: LoadBalancerSettings = {
    nodeWalkStrategy: new RandomWalkStrategy(config.nodes),
    timeoutMs: 10000
};

ServiceFactory.register("logging", () => loggingService);
ServiceFactory.register("consumer-registration", () => new ApiRegistrationService(config.gridApiEndpoint));

if (config.localStorageFolder) {
    ServiceFactory.register(
        "consumer-storage-manager-state",
        () => new LocalFileStorageService<IConsumerManagerState>(
            `${config.localStorageFolder}/consumer/state`));
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

    // Now we create some dummy data for the consumer
    // In a real life scenario this would come from a device such as a meter
    // and at an interval of the implementers choice
    for (let i = 0; i < 5; i++) {
        // tslint:disable-next-line:insecure-random
        await consumerManager.sendUsageCommand(Date.now(), Math.random() * 10);
    }

    // Don't close down unless you want to remove the registration
    // await consumerService.closedown();
}

start(new ConsumerManager(config.consumer, loadBalancerSettings))
    .catch(err => console.log(err));
