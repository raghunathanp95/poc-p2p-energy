import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import React, { Component, ReactNode } from "react";
import grid from "../../../assets/grid/grid.svg";
import { GridState } from "../../../models/api/gridState";
import { IConfiguration } from "../../../models/config/IConfiguration";
import { ConfigurationService } from "../../../services/configurationService";
import { DemoApiClient } from "../../../services/demoApiClient";
import { DemoGridStateService } from "../../../services/demoGridStateService";
import "./GridLiveOverview.scss";
import { GridLiveOverviewProps } from "./GridLiveOverviewProps";
import { GridLiveOverviewState } from "./GridLiveOverviewState";

/**
 * Component which allows the grid to be viewed live.
 */
class GridLiveOverview extends Component<GridLiveOverviewProps, GridLiveOverviewState> {
    /**
     * The api client.
     */
    private readonly _apiClient: DemoApiClient;

    /**
     * The demo grid state service.
     */
    private readonly _demoGridStateService: DemoGridStateService;

    /**
     * Create a new instance of GridLiveOverview.
     * @param props The props for the component.
     */
    constructor(props: GridLiveOverviewProps) {
        super(props);

        const config = ServiceFactory.get<ConfigurationService<IConfiguration>>("configuration").get();
        this._apiClient = new DemoApiClient(config.apiEndpoint);
        this._demoGridStateService = ServiceFactory.get<DemoGridStateService>("demoGridState");

        this.state = {
            gridState: this._demoGridStateService.getGridState()
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        this._demoGridStateService.subscribeGrid("gridLiveOverview", (gridState) => {
            this.setState({gridState});
        });
    }

    /**
     * The component is going to unmount so tidy up.
     */
    public componentWillUnmount(): void {
        this._demoGridStateService.unsubscribeGrid("gridLiveOverview");
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <div className="grid-live-grid">
                <div className="grid-live-caption">
                    {this.props.grid.name}
                    <div className="grid-live-caption-id">ID: {this.props.grid.id}</div>
                </div>
                <img src={grid} alt="Grid" />
                <div className="grid-live-grid-sub-title">Connections</div>
                <div>Producers: {this.props.grid.producers.length}</div>
                <div>Consumers: {this.props.grid.consumers.length}</div>
                {this.state.gridState && (
                    <React.Fragment>
                        <div className="grid-live-grid-sub-title">Balances</div>
                        <div className="positive">Running costs received: {this.state.gridState.runningCostsBalance}i</div>
                        <br/>
                        <div className="negative">Producers are owed: {this.state.gridState.producerOwedBalance}i</div>
                        <div className="positive">Producers have received: {this.state.gridState.producerPaidBalance}i</div>
                        <br/>
                        <div className="negative">Consumers owe: {this.state.gridState.consumerOwedBalance}i</div>
                        <div className="positive">Consumers have paid: {this.state.gridState.consumerReceivedBalance}i</div>
                    </React.Fragment>
                )}
            </div>
        );
    }
}

export default GridLiveOverview;
