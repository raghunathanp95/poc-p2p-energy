import React, { Component, ReactNode } from "react";
import grid from "../../../assets/grid/grid.svg";
import { ServiceFactory } from "../../../factories/serviceFactory";
import { GridState } from "../../../models/api/gridState";
import { IConfiguration } from "../../../models/config/IConfiguration";
import { ConfigurationService } from "../../../services/configurationService";
import { DemoApiClient } from "../../../services/demoApiClient";
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
     * Create a new instance of GridLiveOverview.
     * @param props The props for the component.
     */
    constructor(props: GridLiveOverviewProps) {
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
            <div className="grid-live-grid">
                <div className="grid-live-caption">
                    {this.props.grid.name}
                    <div className="grid-live-caption-id">ID: {this.props.grid.id}</div>
                </div>
                <img src={grid} alt="Grid" />
                <div className="grid-live-grid-sub-title">Connections</div>
                <div>Producers: {this.props.grid.producers.length}</div>
                <div>Consumers: {this.props.grid.consumers.length}</div>
            </div>
        );
    }
}

export default GridLiveOverview;
