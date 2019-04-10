import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import React, { Component, ReactNode } from "react";
import { GridState } from "../../../models/api/gridState";
import { IConfiguration } from "../../../models/config/IConfiguration";
import { ConfigurationService } from "../../../services/configurationService";
import { DemoApiClient } from "../../../services/demoApiClient";
import { DemoGridManager } from "../../../services/demoGridManager";
import GridLiveConsumer from "./GridLiveConsumer";
import "./GridLiveContainer.scss";
import { GridLiveContainerProps } from "./GridLiveContainerProps";
import { GridLiveContainerState } from "./GridLiveContainerState";
import GridLiveOverview from "./GridLiveOverview";
import GridLiveProducer from "./GridLiveProducer";

/**
 * Component which allows the grid to be viewed live.
 */
class GridLiveContainer extends Component<GridLiveContainerProps, GridLiveContainerState> {
    /**
     * The api client.
     */
    private readonly _apiClient: DemoApiClient;

    /**
     * The demo grid manager.
     */
    private readonly _demoGridManager: DemoGridManager;

    /**
     * Timer to check the wallet balance.
     */
    private _walletBalanceInterval?: NodeJS.Timer;

    /**
     * Create a new instance of GridLiveContainer.
     * @param props The props for the component.
     */
    constructor(props: GridLiveContainerProps) {
        super(props);

        const config = ServiceFactory.get<ConfigurationService<IConfiguration>>("configuration").get();
        this._apiClient = new DemoApiClient(config.apiEndpoint);
        this._demoGridManager = ServiceFactory.get<DemoGridManager>("demo-grid-manager");

        this.state = {
            walletBalance: "-----",
            gridState: this._demoGridManager.getGridState()
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        this._walletBalanceInterval = setInterval(() => this.checkWalletBalance(), 30000);
        this.checkWalletBalance();

        this._demoGridManager.subscribeGrid("gridLiveContainer", (gridState) => {
            this.setState({gridState});
        });

        await this._demoGridManager.load(this.props.grid);
    }

    /**
     * The component is going to unmount so tidy up.
     */
    public componentWillUnmount(): void {
        if (this._walletBalanceInterval) {
            clearInterval(this._walletBalanceInterval);
            this._walletBalanceInterval = undefined;
        }

        this._demoGridManager.unsubscribeGrid("gridLiveContainer");
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <div className="grid-live-container">
                <div>Global Wallet Balance: {this.state.walletBalance}</div>

                <div className="grid-live-columns">
                    <div className="grid-live-source-producer-column">
                        <div className="grid-live-caption">Producers</div>
                        {this.props.grid.producers.length === 0 && (
                            <div className="grid-live-producer">
                                <div>There are no producers configured.</div>
                            </div>
                        )}
                        {this.props.grid.producers.map((p, idx) => (
                            <GridLiveProducer key={idx} producer={p} idx={idx} />
                        ))}
                    </div>
                    <div className="grid-live-grid-column">
                        <div className="grid-live-caption">Grid</div>
                        <GridLiveOverview grid={this.props.grid} />
                    </div>

                    <div className="grid-live-consumer-column">
                        <div className="grid-live-caption">Consumers</div>
                        {this.props.grid.consumers.length === 0 && (
                            <div>There are no consumers configured.</div>
                        )}
                        {this.props.grid.consumers.map((c, idx) => (
                            <GridLiveConsumer key={idx} consumer={c} idx={idx} />
                        ))}
                    </div>
                </div>
            </div >
        );
    }

    /**
     * Check the wallet balance for the global wallet.
     */
    private async checkWalletBalance(): Promise<void> {
        const walletResponse = await this._apiClient.walletGet();
        if (walletResponse && walletResponse.success && walletResponse.balance) {
            this.setState({ walletBalance: `${walletResponse.balance}i` });
        }
    }
}

export default GridLiveContainer;
