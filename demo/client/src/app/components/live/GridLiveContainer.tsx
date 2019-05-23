import { StatusMessage } from "iota-react-components";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import React, { Component, ReactNode } from "react";
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
     * The demo grid manager.
     */
    private readonly _demoGridManager: DemoGridManager;

    /**
     * Create a new instance of GridLiveContainer.
     * @param props The props for the component.
     */
    constructor(props: GridLiveContainerProps) {
        super(props);

        this._demoGridManager = ServiceFactory.get<DemoGridManager>("demo-grid-manager");

        this.state = {
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
                        <div>For this demonstration the updates are scheduled every 30s, so you may not see data immediately, in a real system the updates would be at even longer intervals.
                            <br /><br />
                            Payment is only requested from Consumers on whole kWh, so they will have no outstanding balance immediately. Consumers only pay the grid when they reach multiples of 25i.
                            <br /><br />
                            The grid takes 20% of the payment for its running costs and then distributes the rest to the producers weighted by how much they have contributed to the grid.
                            <br /><br />
                            Payment distribution from the grid to the producers is done in 40i intervals.
                        </div>

                    </React.Fragment>
                )}
            </div >
        );
    }
}

export default GridLiveContainer;
