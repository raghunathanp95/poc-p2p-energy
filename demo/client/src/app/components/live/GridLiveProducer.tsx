import { ILineChartOptions } from "chartist";
import classnames from "classnames";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import React, { Component, ReactNode } from "react";
import ChartistGraph from "react-chartist";
import producer1 from "../../../assets/producers/producer1.svg";
import producer2 from "../../../assets/producers/producer2.svg";
import producer3 from "../../../assets/producers/producer3.svg";
import { ISource } from "../../../models/api/ISource";
import { DemoGridManager } from "../../../services/demoGridManager";
import "./GridLiveProducer.scss";
import { GridLiveProducerProps } from "./GridLiveProducerProps";
import { GridLiveProducerState } from "./GridLiveProducerState";
import GridLiveSource from "./GridLiveSource";

/**
 * Component which allows the grid to be viewed live.
 */
class GridLiveProducer extends Component<GridLiveProducerProps, GridLiveProducerState> {
    /**
     * The producer images.
     */
    private readonly _producerImages: any[];

    /**
     * The demo grid manager.
     */
    private readonly _demoGridManager: DemoGridManager;

    /**
     * The selected sources for the graph.
     */
    private readonly _selectedSources: string[];

    /**
     * Create a new instance of GridLiveProducer.
     * @param props The props for the component.
     */
    constructor(props: GridLiveProducerProps) {
        super(props);

        this._producerImages = [
            producer1,
            producer2,
            producer3
        ];

        this._demoGridManager = ServiceFactory.get<DemoGridManager>("demoGridState");

        this._selectedSources = [];

        this.state = {
            producerState: this._demoGridManager.getProducerState(this.props.producer.id),
            isExpanded: false,
            graphLabels: [],
            graphSeries: []
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        this.calculateGraph();

        this._demoGridManager.subscribeProducer(this.props.producer.id, (producerState) => {
            this.setState({ producerState });
        });
    }

    /**
     * The component is going to unmount so tidy up.
     */
    public componentWillUnmount(): void {
        this._demoGridManager.unsubscribeProducer(this.props.producer.id);
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <div className="grid-live-producer">
                <div className="grid-live-producer-info-wrapper">
                    <button
                        className={
                            classnames(
                                "grid-live-producer-btn",
                                { "grid-live-producer-btn--expanded": this.state.isExpanded }
                            )
                        }
                        onClick={() => this.setState({ isExpanded: !this.state.isExpanded })}
                    >
                        <div className="grid-live-producer-btn-top">
                            <img src={this._producerImages[this.props.idx % 3]} alt={this.props.producer.name} />
                        </div>
                        <div className="grid-live-producer-btn-bottom">
                            {this.props.producer.name}
                        </div>
                    </button>
                    <div className="grid-live-producer-info">
                        <div className="grid-live-producer-info-id">ID: {this.props.producer.id}</div>
                        {this.state.producerState && (
                            <React.Fragment>
                                <div className="grid-live-producer-sub-title">Balance</div>
                                <div className="grid-live-producer-info-data">Received: {this.state.producerState.receivedBalance}i</div>
                                <div className="grid-live-producer-info-data">Owed: {this.state.producerState.owedBalance}i</div>
                            </React.Fragment>
                        )}
                    </div>
                </div>
                {this.state.isExpanded && (
                    <div
                        className={
                            classnames(
                                "grid-live-producer-detail",
                                { "grid-live-producer-detail--expanded": this.state.isExpanded }
                            )}
                    >
                        <div className="grid-live-producer-sub-title">Power Output</div>
                        {this.state.graphSeries.length === 0 && (
                            <div>There is no power data for this producer.</div>
                        )}
                        {this.state.graphSeries.length > 0 && (
                            <div className="charts">
                                <ChartistGraph
                                    data={{
                                        labels: this.state.graphLabels,
                                        series: this.state.graphSeries
                                    }}
                                    options={{
                                        low: 0,
                                        showArea: true
                                    } as ILineChartOptions}
                                    type="Line"
                                />
                            </div>
                        )}
                        <div className="grid-live-producer-sub-title">
                            Sources
                            {this.props.producer.sources.length > 0 && (
                                <span className="grid-live-producer-sub-title-minor"> - Select a source to add its output to the power graph.</span>
                            )}
                        </div>
                        <div className="grid-live-sources">
                            {this.props.producer.sources.length === 0 && (
                                <div>Please configure some sources for this producer.</div>
                            )}
                            {this.props.producer.sources.map((s, idx2) => (
                                <GridLiveSource
                                    key={idx2}
                                    source={s}
                                    isSelected={this._selectedSources.indexOf(s.id) >= 0}
                                    onSourceSelected={(source, isSelected) => this.handleSelectSource(source, isSelected)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    /**
     * A source has been selected.
     * @param source The source that was selected.
     * @param isSelected Is the source selected.
     */
    private handleSelectSource(source: ISource, isSelected: boolean): void {
        const idx = this._selectedSources.indexOf(source.id);
        if (isSelected && idx < 0) {
            this._selectedSources.push(source.id);
            this.calculateGraph();
        } else if (!isSelected && idx >= 0) {
            this._selectedSources.splice(idx, 1);
            this.calculateGraph();
        }
    }

    /**
     * Calculate the graph data.
     */
    private calculateGraph(): void {
        if (this.state.producerState) {
            let graphLabels: string[] = [];
            const graphSeries: number[][] = [];

            if (this.state.producerState.powerSlices && this.state.producerState.powerSlices.length > 0) {
                graphSeries.push(this.state.producerState.powerSlices.map(p => p.value));
                graphLabels = this.state.producerState.powerSlices.map(p => p.startTime.toString());
            }

            for (let i = 0; i < this.props.producer.sources.length; i++) {
                if (this._selectedSources.indexOf(this.props.producer.sources[i].id) >= 0) {
                    const sourceState = this.state.producerState.sourceStates[this.props.producer.sources[i].id];
                    if (sourceState) {
                        const powerSlices = sourceState.powerSlices;
                        if (powerSlices) {
                            graphSeries.push(powerSlices.map(p => p.value));
                        }
                    }
                }
            }

            this.setState({ graphSeries, graphLabels });
        }
    }
}

export default GridLiveProducer;
