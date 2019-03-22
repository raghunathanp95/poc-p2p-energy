import { ApiStorageService, ConsoleLoggingService, LocalFileStorageService, ServiceFactory } from "poc-p2p-energy-grid-common";
import { IConfiguration } from "./models/IConfiguration";
import { IConsumerState } from "./models/IConsumerState";
import { ConsumerService } from "./services/consumerService";

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
        () => new LocalFileStorageService<IConsumerState>(config.localStorageFolder, config.consumer.id, "config"));
} else {
    ServiceFactory.register("storage-config", () => new ApiStorageService<IConsumerState>(
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
 * @param consumerService The consumer service to start.
 */
async function start(consumerService: ConsumerService): Promise<void> {
    await consumerService.intialise();

    // await consumerService.closedown();
}

start(new ConsumerService(config.consumer, config.gridApiEndpoint, config.node))
    .catch(err => console.log(err));
