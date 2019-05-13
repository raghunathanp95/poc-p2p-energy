import { composeAPI, LoadBalancerSettings } from "@iota/client-load-balancer";
import { generateAddress } from "@iota/core";
import { IPaymentService } from "../../models/services/IPaymentService";
import { TrytesHelper } from "../../utils/trytesHelper";

/**
 * Service to handle payment.
 */
export class SimplePaymentService implements IPaymentService {
    /**
     * Load balancer settings for communications.
     */
    private readonly _loadBalancerSettings: LoadBalancerSettings;

    /**
     * Wallet seed.
     */
    private readonly _walletSeed: string;

    /**
     * Create a new instance of SimplePaymentService
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param walletSeed The wallet seed.
     */
    constructor(loadBalancerSettings: LoadBalancerSettings, walletSeed: string) {
        this._loadBalancerSettings = loadBalancerSettings;
        this._walletSeed = walletSeed;
    }

    /**
     * Register with the payment service.
     * @param registrationId The registration id.
     * @returns True if registration was successful.
     */
    public async register(registrationId: string): Promise<boolean> {
        return true;
    }

    /**
     * Generate an address for the registration.
     * @param registrationId The registration id.
     * @param addressIndex The address index.
     * @returns The generated address.
     */
    public async getAddress(registrationId: string, addressIndex: number): Promise<string> {
        return generateAddress(this._walletSeed, addressIndex, 2);
    }

    /**
     * Make a payment from a registration.
     * @param registrationId The registration the payment is from.
     * @param toRegistrationId The registration the payment is to.
     * @param address The address we are making the payment to.
     * @param amount The amount of the payment.
     * @returns The bundle hash for the payment.
     */
    public async transfer(
        registrationId: string,
        toRegistrationId: string,
        address: string,
        amount: number): Promise<string> {

        const iota = composeAPI(
            this._loadBalancerSettings
        );

        const inputsResult = await iota.getInputs(this._walletSeed);

        const trytes = await iota.prepareTransfers(
            this._walletSeed,
            [
                {
                    address: address,
                    value: amount,
                    tag: "P2P9ENERGY9POC",
                    message: TrytesHelper.toTrytes({
                        from: registrationId
                    })
                }
            ],
            {
                inputs: inputsResult.inputs
            });

        const bundle = await iota.sendTrytes(trytes, undefined, undefined);

        return bundle[0].bundle;
    }
}
