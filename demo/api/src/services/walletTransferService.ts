import { composeAPI, LoadBalancerSettings } from "@iota/client-load-balancer";
import { API, generateAddress, Inputs, Transfer } from "@iota/core";
import { Transaction } from "@iota/transaction-converter";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import { IAWSDynamoDbConfiguration } from "p2p-energy-common/dist/models/config/IAWSDynamoDbConfiguration";
import { ILoggingService } from "p2p-energy-common/dist/models/services/ILoggingService";
import { AmazonDynamoDbService } from "p2p-energy-common/dist/services/amazon/amazonDynamoDbService";
import { TrytesHelper } from "p2p-energy-common/dist/utils/trytesHelper";
import { IDemoWalletTransfer } from "../models/services/IDemoWalletTransfer";
import { IDemoWalletTransferContainer } from "../models/services/IDemoWalletTransferContainer";
import { WalletService } from "./walletService";

/**
 * Service to payment entities states in AmazonS3.
 */
export class WalletTransferService extends AmazonDynamoDbService<IDemoWalletTransferContainer> {
    /**
     * The name of the database table.
     */
    public static readonly TABLE_NAME: string = "transfer";

    /**
     * The logging service.
     */
    private readonly _loggingService: ILoggingService;

    /**
     * The wallet service.
     */
    private readonly _walletService: WalletService;

    /**
     * Is the service busy doing an update already.
     */
    private _isBusy: boolean;

    /**
     * Transfers ready to add.
     */
    private _toAdd: IDemoWalletTransfer[];

    /**
     * Create a new instance of PaymentRegistrationService
     * @param config The configuration.
     */
    constructor(config: IAWSDynamoDbConfiguration) {
        super(config, WalletTransferService.TABLE_NAME, "id");

        this._toAdd = [];
        this._loggingService = ServiceFactory.get<ILoggingService>("logging");
        this._walletService = ServiceFactory.get<WalletService>("wallet");
    }

    /**
     * Add a new transfer for the service to perform.
     * @param transfer The tranfer to add
     */
    public addTransfer(transfer: IDemoWalletTransfer): void {
        this._toAdd.push(transfer);
    }

    /**
     * Send any pending transfers.
     * @param loadBalancerSettings The load balancer settings.
     */
    public async poll(loadBalancerSettings: LoadBalancerSettings): Promise<void> {
        if (!this._isBusy) {
            this._isBusy = true;

            let walletTransferContainer = await super.get("global");

            let updated1 = false;
            if (!walletTransferContainer) {
                walletTransferContainer = {
                    queue: []
                };
                updated1 = true;
            }

            if (this._toAdd.length > 0) {
                walletTransferContainer.queue = walletTransferContainer.queue.concat(this._toAdd);
                this._toAdd = [];
                updated1 = true;
            }

            const iota = composeAPI(
                loadBalancerSettings
            );

            const updated2 = await this.checkPending(iota, walletTransferContainer);

            const updated3 = await this.sendTransaction(iota, walletTransferContainer);

            if (updated1 || updated2 || updated3) {
                await super.set("global", walletTransferContainer);
            }

            this._isBusy = false;
        }
    }

    /**
     * Send the next transaction if we have no pending one.
     * @param iota The iota API instance.
     * @param walletTransferContainer The current transfers.
     * @returns True if the state was updated.
     */
    private async sendTransaction(iota: API, walletTransferContainer: IDemoWalletTransferContainer): Promise<boolean> {
        let updated = false;

        if (!walletTransferContainer.pending && walletTransferContainer.queue.length > 0) {
            try {
                const nextTransfer = walletTransferContainer.queue[0];

                const sourceWallet = await this._walletService.get(nextTransfer.sourceWalletId);
                const receiveWallet = await this._walletService.get(nextTransfer.receiveWalletId);

                if (sourceWallet && receiveWallet) {
                    const inputsResponse: Inputs =
                        await iota.getInputs(sourceWallet.seed, {
                            start: sourceWallet.startIndex,
                            end: Math.max(sourceWallet.startIndex + 10, sourceWallet.lastIndex)
                        });

                    if (inputsResponse && inputsResponse.inputs && inputsResponse.inputs.length > 0) {
                        const lastSourceUsedIndex = Math.max(
                            inputsResponse.inputs[inputsResponse.inputs.length - 1].keyIndex,
                            sourceWallet.lastIndex);

                        sourceWallet.startIndex = inputsResponse.inputs[0].keyIndex;
                        sourceWallet.lastIndex = lastSourceUsedIndex + 1;
                        sourceWallet.balance = inputsResponse.totalBalance;

                        const remainderAddress = generateAddress(sourceWallet.seed, lastSourceUsedIndex + 1, 2);

                        receiveWallet.lastIndex++;

                        nextTransfer.address = generateAddress(receiveWallet.seed, receiveWallet.lastIndex, 2);

                        const trytes = await iota.prepareTransfers(
                            sourceWallet.seed,
                            [{
                                address: nextTransfer.address,
                                value: nextTransfer.value,
                                tag: nextTransfer.tag,
                                message: nextTransfer.payload ? TrytesHelper.toTrytes(nextTransfer.payload) : ""
                            }],
                            {
                                inputs: inputsResponse.inputs,
                                remainderAddress
                            });

                        const sendTrytesResponse: Transaction[] =
                            await iota.sendTrytes(trytes, undefined, undefined);

                        nextTransfer.bundle = sendTrytesResponse[0].bundle;

                        this._loggingService.log(
                            "wallet",
                            `Created transaction ${sendTrytesResponse[0].hash}`,
                            sourceWallet.balance);

                        await this._walletService.set(sourceWallet.id, sourceWallet);
                        await this._walletService.set(receiveWallet.id, receiveWallet);

                        walletTransferContainer.pending = nextTransfer;
                    }
                }
                walletTransferContainer.queue.shift();
                updated = true;
            } catch (err) {
                this._loggingService.error("wallet", "Sending transaction", err);
            }
        }

        return updated;
    }

    /**
     * Confirm the current pending transaction.
     * @param iota The iota API instance.
     * @param walletTransferContainer The current transfers.
     * @returns True if the state was updated.
     */
    private async checkPending(iota: API, walletTransferContainer: IDemoWalletTransferContainer): Promise<boolean> {
        let updated = false;

        if (walletTransferContainer.pending) {
            try {
                const txs: Transaction[] =
                    await iota.findTransactionObjects({ bundles: [walletTransferContainer.pending.bundle] });

                if (txs && txs.length > 0) {
                    const remainingByHash: { [hash: string]: Transaction } = {};
                    const startTransactions: Transaction[] = [];

                    for (let i = 0; i < txs.length; i++) {
                        if (txs[i].currentIndex === 0) {
                            startTransactions.push(txs[i]);
                        } else {
                            remainingByHash[txs[i].hash] = txs[i];
                        }
                    }

                    startTransactions.sort((a, b) => a.attachmentTimestamp - b.attachmentTimestamp);

                    let confirmedIndex = -1;
                    for (let i = 0; i < startTransactions.length; i++) {
                        let currentHash = startTransactions[i].trunkTransaction;
                        const subBundle = [startTransactions[i]];

                        while (remainingByHash[currentHash]) {
                            subBundle.push(remainingByHash[currentHash]);
                            currentHash = remainingByHash[currentHash].trunkTransaction;
                        }

                        const states = await iota.getLatestInclusion(subBundle.map(tx => tx.hash));

                        if (states.indexOf(false) < 0) {
                            confirmedIndex = i;
                            break;
                        }
                    }

                    if (confirmedIndex >= 0) {
                        const sourceWalletId = walletTransferContainer.pending.sourceWalletId;
                        const receiveWalletId = walletTransferContainer.pending.receiveWalletId;

                        walletTransferContainer.pending.confirmed = Date.now();

                        const sourceWallet = await this._walletService.get(sourceWalletId);
                        if (sourceWallet) {
                            sourceWallet.balance -= startTransactions[confirmedIndex].value;
                            await this._walletService.set(sourceWallet.id, sourceWallet);
                        }

                        const receiveWallet = await this._walletService.get(receiveWalletId);
                        if (receiveWallet) {
                            receiveWallet.balance += startTransactions[confirmedIndex].value;
                            receiveWallet.lastIndex++;

                            await this._walletService.set(receiveWallet.id, receiveWallet);
                        }

                        if (walletTransferContainer.pending.payload) {
                            const fromWallet = await this._walletService.get(
                                walletTransferContainer.pending.payload.from);
                            if (fromWallet) {
                                fromWallet.outgoingTransfers = fromWallet.outgoingTransfers || [];
                                fromWallet.outgoingTransfers.push(walletTransferContainer.pending);

                                await this._walletService.set(fromWallet.id, fromWallet);
                            }

                            const toWallet = await this._walletService.get(
                                walletTransferContainer.pending.payload.to);
                            if (toWallet) {
                                toWallet.incomingTransfers = toWallet.incomingTransfers || [];
                                toWallet.incomingTransfers.push(walletTransferContainer.pending);

                                await this._walletService.set(toWallet.id, toWallet);
                            }
                        }

                        walletTransferContainer.pending = undefined;
                        updated = true;

                        this._loggingService.log(
                            "wallet",
                            `Confirmed transaction ${startTransactions[confirmedIndex].hash}`);
                    } else {
                        const tail = startTransactions[0].hash;
                        const attachmentTimestamp = startTransactions[0].attachmentTimestamp;
                        const timeSinceAttachment = Date.now() - attachmentTimestamp;

                        // If it is taking a long time to attach the bundle (10s)
                        // try promoting it
                        if (timeSinceAttachment > 10000) {
                            // If the bundle is promotable then just spam some transactions
                            // against it
                            //const isPromotable = await iota.isPromotable(tail);
                            //if (isPromotable) {
                            //   await iota.promoteTransaction(tail, undefined, undefined);
                            //} else {
                            const isConsistent = await iota.checkConsistency([tail]);

                            const MILESTONE_INTERVAL = 2 * 60 * 1000;
                            const ONE_WAY_DELAY = 1 * 60 * 1000;
                            const DEPTH = 6;

                            const isAboveMaxDepth = (at: number, depth = DEPTH) =>
                                at < Date.now() && Date.now() - at < depth * MILESTONE_INTERVAL - ONE_WAY_DELAY;

                            if (isConsistent && isAboveMaxDepth(attachmentTimestamp)) {
                                this._loggingService.log(
                                    "wallet",
                                    `Promoting bundle ${tail}`);

                                const spamTransfers: Transfer[] = [
                                    {
                                        address: "9".repeat(81),
                                        value: 0,
                                        tag: "9".repeat(27),
                                        message: "9".repeat(27 * 81)
                                    }
                                ];

                                const spamTrytes = await iota.prepareTransfers(
                                    "9".repeat(81),
                                    spamTransfers
                                );

                                await iota.sendTrytes(spamTrytes, undefined, undefined, tail);
                            } else {
                                // Bundle is not promotable, so replay it and store the new hash
                                const sendTrytesResponse: Transaction[] =
                                    await iota.replayBundle(startTransactions[0].hash, undefined, undefined);

                                walletTransferContainer.pending.bundle = sendTrytesResponse[0].bundle;
                                updated = true;

                                this._loggingService.log(
                                    "wallet",
                                    `Replaying bundle ${startTransactions[0].hash} to ${sendTrytesResponse[0].bundle}`);
                            }
                        }
                    }
                }
            } catch (err) {
                this._loggingService.error("wallet", "Confirming transaction", err);
            }
        }
        return updated;
    }
}
