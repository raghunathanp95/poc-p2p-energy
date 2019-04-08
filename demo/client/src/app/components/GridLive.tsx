import { ILineChartOptions, IPieChartOptions } from "chartist";
import React, { Component, ReactNode } from "react";
import ChartistGraph from "react-chartist";
import consumer1 from "../../assets/consumers/consumer1.png";
import consumer2 from "../../assets/consumers/consumer2.png";
import grid from "../../assets/grid/grid.png";
import biomass from "../../assets/sources/biomass.png";
import geothermal from "../../assets/sources/geothermal.png";
import solar from "../../assets/sources/solar.png";
import wind from "../../assets/sources/wind.png";
import { ServiceFactory } from "../../factories/serviceFactory";
import { GridState } from "../../models/api/gridState";
import { IPowerSlice } from "../../models/api/IPowerSlice";
import { IConfiguration } from "../../models/config/IConfiguration";
import { ConfigurationService } from "../../services/configurationService";
import { DemoApiClient } from "../../services/demoApiClient";
import "./GridLive.scss";
import { GridLiveProps } from "./GridLiveProps";
import { GridLiveState } from "./GridLiveState";

/**
 * Component which allows the grid to be viewed live.
 */
class GridLive extends Component<GridLiveProps, GridLiveState> {
    /**
     * The api client.
     */
    private readonly _apiClient: DemoApiClient;

    /**
     * The source images.
     */
    private readonly _sourceImages: { [id: string]: any };

    /**
     * Create a new instance of GridLive.
     * @param props The props for the component.
     */
    constructor(props: GridLiveProps) {
        super(props);

        const config = ServiceFactory.get<ConfigurationService<IConfiguration>>("configuration").get();
        this._apiClient = new DemoApiClient(config.apiEndpoint);

        this._sourceImages = {
            solar,
            wind,
            geothermal,
            biomass
        };

        this.state = {
            powerSlices: {}
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        await this._apiClient.gridStatePut({
            name: this.props.grid.name,
            state: GridState.Running
        });

        // Get the latest power data from the api
        // await this._apiClient.gridStatePut({
        //     name: this.props.grid.name,
        //     state: GridState.Running
        // });
        const powerSlices: { [id: string]: IPowerSlice[] } = {};
        for (let i = 0; i < this.props.grid.producers.length; i++) {
            const producer = this.props.grid.producers[i];
            powerSlices[producer.id] = [];

            for (let k = 0; k < producer.sources.length; k++) {
                const source = producer.sources[k];
                powerSlices[source.id] = [];

                for (let j = 0; j < 10; j++) {
                    // tslint:disable-next-line:insecure-random
                    const powerSlice = { startTime: j * 100, endTime: ((j + 1) * 100) - 1, value: Math.random() * 180 };
                    powerSlices[source.id].push(powerSlice);
                    powerSlices[producer.id][j] = powerSlices[producer.id][j] || { startTime: powerSlice.startTime, endTime: powerSlice.endTime, value: 0 };
                    powerSlices[producer.id][j].value += powerSlice.value;
                }
            }
        }
        this.setState({ powerSlices });
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <div className="grid-live-container">
                <div className="grid-live-source-producer-column">
                    {this.props.grid.producers.length === 0 && (
                        <div className="grid-live-producer">
                            <div>There are no producers configured.</div>
                        </div>
                    )}
                    {this.props.grid.producers.map((p, idx) => (
                        <div key={idx} className="grid-live-producer">
                            <div className="grid-live-caption">
                                Producer: {p.name}
                                <div className="grid-live-caption-id">{p.id}</div>
                            </div>
                            {!this.state.powerSlices[p.id] || this.state.powerSlices[p.id].length === 0 && (
                                <div>There is no power data for this producer.</div>
                            )}
                            {this.state.powerSlices[p.id] && this.state.powerSlices[p.id].length > 0 && (
                                <div className="charts">
                                    <div className="charts-title">Current Output</div>
                                    <div className="charts-pie">
                                        <ChartistGraph
                                            style={{ height: 300, marginBottom: -100 }}
                                            data={{
                                                series: [
                                                    this.state.powerSlices[p.id][this.state.powerSlices[p.id].length - 1].value / p.sources.length,
                                                    180 - (this.state.powerSlices[p.id][this.state.powerSlices[p.id].length - 1].value / p.sources.length)
                                                ]
                                            }}
                                            options={{
                                                donut: true,
                                                donutWidth: 60,
                                                startAngle: 270,
                                                total: 360,
                                                showLabel: false
                                            } as IPieChartOptions}
                                            type="Pie"
                                        />
                                        <div className="last-value">{(this.state.powerSlices[p.id][this.state.powerSlices[p.id].length - 1].value / p.sources.length).toFixed(2)}</div>
                                    </div>
                                    <div className="charts-title">Historical Output</div>
                                    <br />
                                    <ChartistGraph
                                        data={{
                                            labels: this.state.powerSlices[p.id].map(ps => ps.startTime),
                                            series: [
                                                this.state.powerSlices[p.id].map(ps => ps.value)
                                            ]
                                        }}
                                        options={{
                                            low: 0,
                                            showArea: true,
                                            axisX: {
                                                labelInterpolationFnc: (label: number) => {
                                                    return label;
                                                }
                                            }
                                        } as ILineChartOptions}
                                        type="Line"
                                    />
                                </div>
                            )}
                            <hr />
                            <div className="grid-live-caption">
                                Sources
                            </div>
                            {p.sources.map((s, idx2) => (
                                <div key={idx2} className="grid-live-source">
                                    <img src={this._sourceImages[s.type.toLowerCase()]} alt={s.type} />
                                    <div className="grid-live-source-info">
                                        {s.name}<br />
                                        <div className="grid-live-source-info-id">{s.id}</div>
                                    </div>
                                </div>
                            ))}
                            {p.sources.length === 0 && (
                                <div>Please configure some sources for this producer.</div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="grid-live-grid-column">
                    <div className="grid-live-caption">
                        Grid: {this.props.grid.name}
                        <div className="grid-live-caption-id">{this.props.grid.id}</div>
                    </div>
                    <img src={grid} alt="Grid" />
                </div>

                <div className="grid-live-consumer-column">
                    {this.props.grid.consumers.length === 0 && (
                        <div>There are no consumers configured.</div>
                    )}
                    {this.props.grid.consumers.map((c, idx) => (
                        <div key={idx} className="grid-live-consumer">
                            <img src={idx % 2 === 0 ? consumer1 : consumer2} alt="Consumer" />
                            <div className="grid-live-consumer-info">
                                {c.name}<br />
                                <div className="grid-live-consumer-info-id">{c.id}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div >
        );
    }
}

export default GridLive;
