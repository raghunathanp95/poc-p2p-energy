import { composeAPI, LoadBalancerSettings } from "@iota/client-load-balancer";
import { Inputs } from "@iota/core";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { ILoggingService } from "p2p-energy-common/dist/models/services/ILoggingService";
import { AmazonS3Service } from "p2p-energy-common/dist/services/amazon/amazonS3Service";
import { IDemoApiConfiguration } from "../models/IDemoApiConfiguration";
import { IDemoWalletTransferContainer } from "../models/services/IDemoWalletTransferContainer";
import { WalletService } from "../services/walletService";
import { WalletTransferService } from "../services/walletTransferService";

/**
 * Initialise the components for the demo api.
 */
export async function init(config: IDemoApiConfiguration): Promise<string[]> {
    const loggingService = ServiceFactory.get<ILoggingService>("logging");

    loggingService.startCapture(["init", "s3", "dynamoDb"]);
    loggingService.log("init", "Initializing");

    try {
        if (config.s3Connection) {
            await new AmazonS3Service(config.s3Connection, "grids")
                .createBucket(loggingService);
            await new WalletService(config.dynamoDbConnection)
                .createTable(loggingService);

            const walletTransferService = new WalletTransferService(config.dynamoDbConnection);
            await walletTransferService.createTable(loggingService);

            const iota = composeAPI(
                ServiceFactory.get<LoadBalancerSettings>("load-balancer-settings")
            );

            const inputsResponse: Inputs =
                await iota.getInputs(config.walletSeed);

            if (inputsResponse &&
                inputsResponse.totalBalance > 0 &&
                inputsResponse.inputs &&
                inputsResponse.inputs.length > 0) {
                loggingService.log("init", `Wallet balance ${inputsResponse.totalBalance}`);
                const demoWalletTransferContainer: IDemoWalletTransferContainer = {
                    startIndex: inputsResponse.inputs[0].keyIndex,
                    lastUsedIndex: inputsResponse.inputs[inputsResponse.inputs.length - 1].keyIndex,
                    queue: []
                };
                await walletTransferService.set("global", demoWalletTransferContainer);
            }
        }

        loggingService.log("init", `Initialization Complete`);
    } catch (err) {
        loggingService.error("init", `Initialization Failed`, err);
    }

    return loggingService.formatCapture(loggingService.stopCapture());
}
