import { LoadBalancerSettings } from "@iota/client-load-balancer";

/**
 * Explorer MAM Channels.
 */
export class MamExplorer {
    /**
     * The url to use for opening links.
     */
    private readonly _url: string;

    /**
     * Load balancer settings for communications.
     */
    private readonly _loadBalancerSettings: LoadBalancerSettings;

    /**
     * Create a new instance of MamExplorer.
     * @param url The url to use for opening the links.
     * @param loadBalancerSettings Load balancer settings for communications.
     */
    constructor(url: string, loadBalancerSettings: LoadBalancerSettings) {
        this._url = url;
        this._loadBalancerSettings = loadBalancerSettings;
    }

    /**
     * Explorer the mam channel.
     * @param root The root for the channel.
     * @param mode The mode of the channel.
     * @param sideKey The sideKey if private or restricted.
     */
    public explore(root?: string, mode: "public" | "private" | "restricted" = "public", sideKey?: string): void {
        let finalUrl = this._url;
        finalUrl = finalUrl.replace(":root", root || "");
        finalUrl = finalUrl.replace(":provider", this._loadBalancerSettings.nodeWalkStrategy.current().provider || "");
        finalUrl = finalUrl.replace(":mode", mode || "");
        finalUrl = finalUrl.replace(":sideKey", sideKey || "");
        window.open(finalUrl, "_blank");
    }
}
