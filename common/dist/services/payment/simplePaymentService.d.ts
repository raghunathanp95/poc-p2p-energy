import { LoadBalancerSettings } from "@iota/client-load-balancer";
import { IPaymentService } from "../../models/services/IPaymentService";
/**
 * Service to handle payment.
 */
export declare class SimplePaymentService implements IPaymentService {
    /**
     * Load balancer settings for communications.
     */
    private readonly _loadBalancerSettings;
    /**
     * Wallet seed.
     */
    private readonly _walletSeed;
    /**
     * Create a new instance of SimplePaymentService
     * @param loadBalancerSettings Load balancer settings for communications.
     * @param walletSeed The wallet seed.
     */
    constructor(loadBalancerSettings: LoadBalancerSettings, walletSeed: string);
    /**
     * Register with the payment service.
     * @param registrationId The registration id.
     * @returns True if registration was successful.
     */
    register(registrationId: string): Promise<boolean>;
    /**
     * Generate an address for the registration.
     * @param registrationId The registration id.
     * @param addressIndex The address index.
     * @returns The generated address.
     */
    getAddress(registrationId: string, addressIndex: number): Promise<string>;
    /**
     * Make a payment from a registration.
     * @param registrationId The registration the payment is from.
     * @param toRegistrationId The registration the payment is to.
     * @param address The address we are making the payment to.
     * @param amount The amount of the payment.
     * @returns The bundle hash for the payment.
     */
    transfer(registrationId: string, toRegistrationId: string, address: string, amount: number): Promise<string>;
}
