import { ConsoleLoggingService, ServiceFactory } from "poc-p2p-energy-grid-common";
import { IConfiguration } from "./models/IConfiguration";
import { SourceService } from "./services/sourceService";

// tslint:disable:no-var-requires no-require-imports
const packageJson = require("../package.json");
const configId = process.env.CONFIG_ID || "local";
// tslint:disable-next-line:non-literal-require
const config: IConfiguration = require(`./data/config.${configId}.json`);

const loggingService = new ConsoleLoggingService();
ServiceFactory.register("logging", () => loggingService);

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

    let lastOutputTime = Date.now();

    for (let i = 0; i < 1; i++) {
        const endTime = Date.now();
        await sourceService.sendCommand({
            command: "output",
            startTime: lastOutputTime,
            endTime: endTime,
            // tslint:disable-next-line:insecure-random
            output: Math.random() * 1000
        });
        lastOutputTime = endTime + 1;
    }

    await sourceService.closedown();
}

start(new SourceService(config.source, config.producerApiEndpoint, config.node))
    .catch(err => console.log(err));
