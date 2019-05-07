import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import React, { Component, ReactNode } from "react";
import grid from "../../../assets/grid/grid.svg";
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
            runningCostsBalance: "-----",
            producerPaidBalance: "-----",
            producerOwedBalance: "-----",
            consumerOwedBalance: "-----",
            consumerReceivedBalance: "-----"
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        this._demoGridManager.subscribeGrid("liveOverview", (gridState) => {
            const gridManagerState = gridState && gridState.gridManagerState;
            const gridStrategyState = gridManagerState && gridManagerState.strategyState;

            this.setState({
                runningCostsBalance: gridStrategyState && gridStrategyState.runningCostsBalance !== undefined
                    ? `${gridStrategyState.runningCostsBalance}i` : "-----",
                producerPaidBalance: gridStrategyState && gridStrategyState.producerPaidBalance !== undefined
                    ? `${gridStrategyState.producerPaidBalance}i` : "-----",
                producerOwedBalance: gridStrategyState && gridStrategyState.producerOwedBalance !== undefined
                    ? `${gridStrategyState.producerOwedBalance}i` : "-----",
                consumerOwedBalance: gridStrategyState && gridStrategyState.consumerOwedBalance !== undefined
                    ? `${gridStrategyState.consumerOwedBalance}i` : "-----",
                consumerReceivedBalance: gridStrategyState && gridStrategyState.consumerReceivedBalance !== undefined
                    ? `${gridStrategyState.consumerReceivedBalance}i` : "-----"
            });
        });
    }

    /**
     * The component is going to unmount so tidy up.
     */
    public componentWillUnmount(): void {
        this._demoGridManager.unsubscribeGrid("liveOverview");
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
                <div className="grid-live-grid-sub-title">Balances</div>
                <div className="positive">Running costs received: {this.state.runningCostsBalance}</div>
                <br />
                <div className="negative">Producers are owed: {this.state.producerOwedBalance}</div>
                <div className="positive">Producers have received: {this.state.producerPaidBalance}</div>
                <br />
                <div className="negative">Consumers owe: {this.state.consumerOwedBalance}</div>
                <div className="positive">Consumers have paid: {this.state.consumerReceivedBalance}</div>
            </div>
        );
    }
}

export default GridLiveOverview;
