import { StatusMessage } from "iota-react-components";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import React, { Component, ReactNode } from "react";
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
            gridState: this._demoGridManager.getGridState(),
            isBusy: true,
            isError: false,
            status: `Generating grid '${this.props.grid.name}'`
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        this._walletBalanceInterval = setInterval(() => this.checkWalletBalance(), 30000);
        this.checkWalletBalance();

        this._demoGridManager.subscribeGrid("liveContainer", (gridState) => {
            this.setState({ gridState });
        });

        try {
            await this._demoGridManager.initialise(this.props.grid, (progress) => {
                this.setState({
                    status: progress
                });
            });
            this.setState({
                isBusy: false,
                status: ""
            });
        } catch (err) {
            this.setState({
                isBusy: false,
                isError: true,
                status: `${this.state.status}\nError: ${err.message}`
            });
        }
    }

    /**
     * The component is going to unmount so tidy up.
     */
    public componentWillUnmount(): void {
        this._demoGridManager.closedown();

        if (this._walletBalanceInterval) {
            clearInterval(this._walletBalanceInterval);
            this._walletBalanceInterval = undefined;
        }

        this._demoGridManager.unsubscribeGrid("liveContainer");
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <div className="grid-live-container">
                <StatusMessage status={this.state.status} color={this.state.isError ? "danger" : "success"} isBusy={this.state.isBusy} />

                {!this.state.status && (
                    <React.Fragment>
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
                                    <div className="grid-live-producer">
                                        <div>There are no consumers configured.</div>
                                    </div>
                                )}
                                {this.props.grid.consumers.map((c, idx) => (
                                    <GridLiveConsumer key={idx} consumer={c} idx={idx} />
                                ))}
                            </div>
                        </div>

                        <br />
                        <hr />
                        <div>For this demonstration the updates are scheduled every 30s, so you may not see data immediately. In a real system the update speed would be much slower.
                            <br /><br />
                            Payment is only requested from Consumers on whole kWh, so they will have no outstanding balance immediately.
                            Additionally consumers only pay the grid when they have reached multiple of 10i.
                        </div>

                    </React.Fragment>
                )}
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
