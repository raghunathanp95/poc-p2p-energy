import React, { Component, ReactNode } from "react";
import { ServiceFactory } from "../../../factories/serviceFactory";
import { GridState } from "../../../models/api/gridState";
import { IConfiguration } from "../../../models/config/IConfiguration";
import { ConfigurationService } from "../../../services/configurationService";
import { DemoApiClient } from "../../../services/demoApiClient";
import GridLiveConsumer from "./GridLiveConsumer";
import "./GridLiveContainer.scss";
import { GridLiveContainerProps } from "./GridLiveContainerProps";
import GridLiveOverview from "./GridLiveOverview";
import GridLiveProducer from "./GridLiveProducer";

/**
 * Component which allows the grid to be viewed live.
 */
class GridLiveContainer extends Component<GridLiveContainerProps, any> {
    /**
     * The api client.
     */
    private readonly _apiClient: DemoApiClient;

    /**
     * Create a new instance of GridLiveContainer.
     * @param props The props for the component.
     */
    constructor(props: GridLiveContainerProps) {
        super(props);

        const config = ServiceFactory.get<ConfigurationService<IConfiguration>>("configuration").get();
        this._apiClient = new DemoApiClient(config.apiEndpoint);

        this.state = {
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
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <div className="grid-live-container">
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
            </div >
        );
    }
}

export default GridLiveContainer;
