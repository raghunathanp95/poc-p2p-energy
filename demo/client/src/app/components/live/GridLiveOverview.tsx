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
            runningCostsTotal: "-----",
            runningCostsReceived: "-----",
            producersTotalOutput: "-----",
            producersTotalReceived: "-----",
            producersTotalOwed: "-----",
            consumersTotalUsage: "-----",
            consumersTotalPaid: "-----",
            consumersTotalOutstanding: "-----"
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        this._demoGridManager.subscribeGrid("liveOverview", (gridState) => {
            const gridManagerState = gridState && gridState.gridManagerState;
            const gridStrategyState = gridManagerState && gridManagerState.strategyState;

            let producersTotalOutput = 0;
            let producersTotalReceived = 0;
            let producersTotalOwed = 0;
            let consumersTotalUsage = 0;
            let consumersTotalOutstanding = 0;
            let consumersTotalPaid = 0;

            if (gridStrategyState) {
                for (const producerId in gridStrategyState.producerTotals) {
                    producersTotalOutput += gridStrategyState.producerTotals[producerId].output;
                    producersTotalReceived += gridStrategyState.producerTotals[producerId].received;
                    producersTotalOwed += gridStrategyState.producerTotals[producerId].owed;
                }
                for (const consumerId in gridStrategyState.consumerTotals) {
                    consumersTotalUsage += gridStrategyState.consumerTotals[consumerId].usage;
                    consumersTotalOutstanding += gridStrategyState.consumerTotals[consumerId].outstanding;
                    consumersTotalPaid += gridStrategyState.consumerTotals[consumerId].paid;
                }
            }

            this.setState({
                runningCostsTotal: gridStrategyState && gridStrategyState.runningCostsTotal !== undefined
                    ? `${gridStrategyState.runningCostsTotal}i` : "0i",
                runningCostsReceived: gridStrategyState && gridStrategyState.runningCostsReceived !== undefined
                    ? `${gridStrategyState.runningCostsReceived}i` : "0i",
                producersTotalOutput: `${Math.ceil(producersTotalOutput)} kWh`,
                producersTotalReceived: `${producersTotalReceived}i`,
                producersTotalOwed: `${producersTotalOwed}i`,
                consumersTotalUsage: `${Math.floor(consumersTotalUsage * 10) / 10} kWh`,
                consumersTotalOutstanding: `${consumersTotalOutstanding}i`,
                consumersTotalPaid: `${consumersTotalPaid}i`
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
                <div className="grid-live-grid-sub-title">Totals</div>
                <div className="positive">Running costs total: {this.state.runningCostsTotal}</div>
                <div className="positive">Running costs received: {this.state.runningCostsReceived}</div>
                <br />
                <div>Producers output: {this.state.producersTotalOutput}</div>
                <div className="positive">Producers received: {this.state.producersTotalReceived}</div>
                <div className="negative">Producers owed: {this.state.producersTotalOwed}</div>
                <br />
                <div>Consumers usage: {this.state.consumersTotalUsage}</div>
                <div className="positive">Consumers paid: {this.state.consumersTotalPaid}</div>
                <div className="negative">Consumers outstanding: {this.state.consumersTotalOutstanding}</div>
            </div>
        );
    }
}

export default GridLiveOverview;
