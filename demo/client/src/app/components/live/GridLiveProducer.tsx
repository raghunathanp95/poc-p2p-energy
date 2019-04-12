import { ILineChartOptions } from "chartist";
import classnames from "classnames";
import { Button } from "iota-react-components";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import React, { Component, ReactNode } from "react";
import ChartistGraph from "react-chartist";
import producer1 from "../../../assets/producers/producer1.svg";
import producer2 from "../../../assets/producers/producer2.svg";
import producer3 from "../../../assets/producers/producer3.svg";
import { ISource } from "../../../models/api/ISource";
import { DemoGridManager } from "../../../services/demoGridManager";
import { MamExplorer } from "../../../services/mamExplorer";
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
     * Mam explorer service.
     */
    private readonly _mamExplorer: MamExplorer;

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

        this._mamExplorer = ServiceFactory.get<MamExplorer>("mam-explorer");
        this._demoGridManager = ServiceFactory.get<DemoGridManager>("demo-grid-manager");

        this.state = {
            isExpanded: false,
            selectedSources: {},
            graphLabels: [],
            graphSeries: [],
            receivedBalance: "-----",
            owedBalance: "-----"
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        this._demoGridManager.subscribeProducer(this.props.producer.id, (producerState) => {
            const mamChannel = producerState && producerState.producerManagerState && producerState.producerManagerState.channel;
            const producerManagerState = producerState && producerState.producerManagerState;

            this.setState(
                {
                    receivedBalance: producerManagerState && producerManagerState.receivedBalance !== undefined
                        ? `${producerManagerState.receivedBalance}i` : "-----",
                    owedBalance: producerManagerState && producerManagerState.owedBalance !== undefined ?
                        `${producerManagerState.owedBalance}i` : "-----",
                    mamRoot: mamChannel && mamChannel.initialRoot,
                    sideKey: mamChannel && mamChannel.sideKey
                },
                () => this.calculateGraph()
            );
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
                            <span className={this.state.isExpanded ? "icon-chevron-up" : "icon-chevron-down"} />
                        </div>
                    </button>
                    <div className="grid-live-producer-info">
                        <div className="grid-live-producer-info-id">ID: {this.props.producer.id}</div>
                        <div className="grid-live-producer-sub-title">Balance</div>
                        <div className="grid-live-producer-info-data">Received: {this.state.receivedBalance}</div>
                        <div className="grid-live-producer-info-data">Owed: {this.state.owedBalance}</div>
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
                        <div className="grid-live-producer-sub-title">
                            Power Output
                            {this.state.mamRoot && (
                                <Button
                                    size="extra-small"
                                    color="secondary"
                                    onClick={() => this._mamExplorer.explore(this.state.mamRoot, "restricted", this.state.sideKey)}
                                >
                                    MAM Output
                                </Button>
                            )}
                        </div>
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
                                    } as ILineChartOptions}
                                    type="Line"
                                />
                            </div>
                        )}
                        <div className="grid-live-producer-sub-title">
                            Sources
                            {this.props.producer.sources.length > 0 && (
                                <React.Fragment>
                                    <Button
                                        size="extra-small"
                                        color="secondary"
                                        onClick={() => this.selectAllSources(true)}
                                    >
                                        Select All
                                    </Button>
                                    <Button
                                        size="extra-small"
                                        color="secondary"
                                        onClick={() => this.selectAllSources(false)}
                                    >
                                        Clear All
                                    </Button>
                                    <div className="grid-live-producer-sub-title-minor">
                                        Select a source to add its output to the power graph.
                                    </div>
                                </React.Fragment>
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
                                    isSelected={this.state.selectedSources[s.id] !== undefined}
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
     * Select or unselect all the sources.
     * @param isSelected Is the source selected.
     */
    private selectAllSources(isSelected: boolean): void {
        for (let i = 0; i < this.props.producer.sources.length; i++) {
            this.handleSelectSource(this.props.producer.sources[i], isSelected);
        }
    }

    /**
     * A source has been selected.
     * @param source The source that was selected.
     * @param isSelected Is the source selected.
     */
    private handleSelectSource(source: ISource, isSelected: boolean): void {
        if (isSelected && !this.state.selectedSources[source.id]) {
            this._demoGridManager.subscribeSource(source.id, (sourceState) => {
                if (sourceState) {
                    this.state.selectedSources[source.id] = sourceState;
                    this.setState({ selectedSources: this.state.selectedSources }, () => this.calculateGraph());
                }
            });
        } else if (!isSelected && this.state.selectedSources[source.id]) {
            this._demoGridManager.unsubscribeSource(source.id);
            delete this.state.selectedSources[source.id];
            this.setState({ selectedSources: this.state.selectedSources }, () => this.calculateGraph());
        }
    }

    /**
     * Calculate the graph data.
     */
    private calculateGraph(): void {
        const graphLabels: string[] = [];
        const graphSeries: number[][] = [];
        if (this.state.mamRoot) {
            for (const sourceId in this.state.selectedSources) {
                if (this.state.selectedSources[sourceId].outputCommands.length > 0) {
                    graphSeries.push(this.state.selectedSources[sourceId].outputCommands.map(p => p.output));
                }
            }
        }
        this.setState({ graphSeries, graphLabels });
    }
}

export default GridLiveProducer;
