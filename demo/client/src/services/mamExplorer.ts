/**
 * Explorer MAM Channels.
 */
export class MamExplorer {
    /**
     * The url to use for opening links.
     */
    private readonly _url: string;

    /**
     * The provider for getting the data.
     */
    private readonly _provider: string;

    /**
     * Create a new instance of MamExplorer.
     * @param url The url to use for opening the links.
     * @param provider The provider for getting the data.
     */
    constructor(url: string, provider: string) {
        this._url = url;
        this._provider = provider;
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
        finalUrl = finalUrl.replace(":provider", this._provider || "");
        finalUrl = finalUrl.replace(":mode", mode || "");
        finalUrl = finalUrl.replace(":sideKey", sideKey || "");
        window.open(finalUrl, "_blank");
    }
}
