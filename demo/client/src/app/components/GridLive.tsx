import React, { Component, ReactNode } from "react";
import { ServiceFactory } from "../../factories/serviceFactory";
import { GridState } from "../../models/api/gridState";
import { IConfiguration } from "../../models/config/IConfiguration";
import { ConfigurationService } from "../../services/configurationService";
import { DemoApiClient } from "../../services/demoApiClient";
import { GridLiveProps } from "./GridLiveProps";

/**
 * Component which allows the grid to be viewed live.
 */
class GridLive extends Component<GridLiveProps, any> {
    /**
     * The api client.
     */
    private readonly _apiClient: DemoApiClient;

    /**
     * Create a new instance of GridLive.
     * @param props The props for the component.
     */
    constructor(props: GridLiveProps) {
        super(props);

        const config = ServiceFactory.get<ConfigurationService<IConfiguration>>("configuration").get();
        this._apiClient = new DemoApiClient(config.apiEndpoint);
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        this._apiClient.gridStatePut({
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
            <React.Fragment>
                <ul>
                    <li>Grid: {this.props.grid.name} [{this.props.grid.id}]</li>
                    <ul>
                        {this.props.grid.producers.map((p, idx) => (
                            <React.Fragment key={idx}>
                                <li>Producer: {p.name} [{p.id}]</li>
                                {p.sources.length > 0 && (
                                    <ul>
                                        {p.sources.map((s, idx2) => (
                                            <li key={idx2}>&nbsp;&nbsp;&nbsp;Source: {s.name} [{s.id}] [{s.type}]</li>
                                        ))}
                                    </ul>
                                )}
                            </React.Fragment>
                        ))}
                    </ul>
                    <ul>
                        {this.props.grid.consumers.map((c, idx) => (
                            <li key={idx}>Consumer: {c.name} [{c.id}]</li>
                        ))}
                    </ul>
                </ul>
            </React.Fragment >
        );
    }
}

export default GridLive;
