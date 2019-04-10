import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import React, { Component, ReactNode } from "react";
import grid from "../../../assets/grid/grid.svg";
import { GridState } from "../../../models/api/gridState";
import { IConfiguration } from "../../../models/config/IConfiguration";
import { ConfigurationService } from "../../../services/configurationService";
import { DemoApiClient } from "../../../services/demoApiClient";
import { DemoGridManager } from "../../../services/demoGridManager";
import "./GridLiveOverview.scss";
import { GridLiveOverviewProps } from "./GridLiveOverviewProps";
import { GridLiveOverviewState } from "./GridLiveOverviewState";

/**
 * Component which allows the grid to be viewed live.
 */
class GridLiveOverview extends Component<GridLiveOverviewProps, GridLiveOverviewState> {
    /**
     * The demo grid manager.
     */
    private readonly _demoGridManager: DemoGridManager;

    /**
     * Create a new instance of GridLiveOverview.
     * @param props The props for the component.
     */
    constructor(props: GridLiveOverviewProps) {
        super(props);

        this._demoGridManager = ServiceFactory.get<DemoGridManager>("demo-grid-manager");

        this.state = {
            gridState: this._demoGridManager.getGridState()
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        this._demoGridManager.subscribeGrid("gridLiveOverview", (gridState) => {
            this.setState({gridState});
        });
    }

    /**
     * The component is going to unmount so tidy up.
     */
    public componentWillUnmount(): void {
        this._demoGridManager.unsubscribeGrid("gridLiveOverview");
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
