import { Button, ButtonContainer, Fieldset, Form, FormActions, FormStatus, Heading } from "iota-react-components";
import { TrytesHelper } from "p2p-energy-common/dist/utils/trytesHelper";
import React, { Component, ReactNode } from "react";
import { RouteComponentProps } from "react-router";
import { ServiceFactory } from "../../factories/serviceFactory";
import { IGrid } from "../../models/api/IGrid";
import { IConfiguration } from "../../models/config/IConfiguration";
import { ConfigurationService } from "../../services/configurationService";
import { DemoApiClient } from "../../services/demoApiClient";
import { LocalStorageService } from "../../services/localStorageService";
import GridConfigure from "../components/configure/GridConfigure";
import GridLiveContainer from "../components/live/GridLiveContainer";
import { GridParams } from "./GridParams";
import { GridState } from "./GridState";

/**
 * Component which will show the users grid.
 */
class Grid extends Component<RouteComponentProps<GridParams>, GridState> {
    /**
     * The api client.
     */
    private readonly _apiClient: DemoApiClient;

    /**
     * Access local storage in the browser.
     */
    private readonly _localStorageService: LocalStorageService;

    /**
     * Create a new instance of Grid.
     * @param props The props to create the component with.
     */
    constructor(props: RouteComponentProps<GridParams>) {
        super(props);
        this._localStorageService = ServiceFactory.get<LocalStorageService>("localStorage");

        const config = ServiceFactory.get<ConfigurationService<IConfiguration>>("configuration").get();
        this._apiClient = new DemoApiClient(config.apiEndpoint);

        this.state = {
            gridName: this.props.match.params && this.props.match.params.gridName === undefined ? "" : this.props.match.params.gridName,
            status: "",
            view: "live"
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        const gridName = this.state.gridName || this._localStorageService.get<string>("gridName");

        if (gridName && gridName.length >= 5) {
            this.setState({ gridName, isValid: true }, async () => this.loadGrid());
        }
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <React.Fragment>
                {this.state.grid && (
                    <React.Fragment>
                        <ButtonContainer>
                            <Button size="small" color="secondary" onClick={() => this.loadCreateGrid()}>Load/Create Grid</Button>
                            <Button size="small" color={this.state.view === "live" ? "primary" : "secondary"} onClick={() => this.liveView()}>Live</Button>
                            <Button size="small" color={this.state.view === "configure" ? "primary" : "secondary"} onClick={() => this.configureView()}>Configure</Button>
                        </ButtonContainer>
                        {this.state.view === "configure" && (
                            <GridConfigure grid={this.state.grid} onChange={(grid) => this.setState({grid})} />
                        )}
                        {this.state.view === "live" && (
                            <GridLiveContainer grid={this.state.grid} />
                        )}
                    </React.Fragment>
                )}
                {!this.state.grid && (
                    <React.Fragment>
                        <Heading level={1}>Load/Create Grid</Heading>
                        <p>Please enter the name of an existing grid to load, or fill in a name to create a new one.
                            <br/>
                            An existing grid named '<strong>Demonstration</strong>' is already available to load.
                        </p>
                        <Form>
                            <Fieldset>
                                <label>Grid Name</label>
                                <input
                                    type="text"
                                    placeholder="Name for the grid between 5 and 30 characters"
                                    value={this.state.gridName}
                                    onChange={(e) => this.setState({ gridName: e.target.value }, () => this.validateData())}
                                    readOnly={this.state.isBusy}
                                    maxLength={30}
                                />
                            </Fieldset>
                            <FormActions>
                                <Button disabled={!this.state.isValid || this.state.isBusy} onClick={async () => this.loadGrid()}>Load</Button>
                                <Button disabled={!this.state.isValid || this.state.isBusy} onClick={async () => this.createGrid()}>Create</Button>
                            </FormActions>
                            <FormStatus message={this.state.status} isBusy={this.state.isBusy} isError={this.state.isErrored} />
                        </Form>
                    </React.Fragment>
                )}
            </React.Fragment >
        );
    }

    /**
     * Validate the form data.
     */
    private validateData(): void {
        const isValid = this.state.gridName && this.state.gridName.trim().length >= 5 && this.state.gridName.trim().length <= 30 ? true : false;

        this.setState({ isValid });
    }

    /**
     * Create a grid using the api.
     */
    private async createGrid(): Promise<void> {
        this.setState(
            {
                isBusy: true,
                status: "Creating Grid, please wait...",
                isErrored: false
            },
            async () => {
                const grid: IGrid = {
                    id: TrytesHelper.generateHash(27),
                    name: this.state.gridName || "",
                    producers: [],
                    consumers: []
                };

                const response = await this._apiClient.gridCreate({
                    grid
                });

                if (response.success) {
                    await this._localStorageService.set("gridName", this.state.gridName);

                    this.setState({
                        isBusy: false,
                        status: "",
                        isErrored: false,
                        grid
                    });
                } else {
                    this.setState({
                        isBusy: false,
                        status: response.message,
                        isErrored: true
                    });
                }
            });
    }

    /**
     * Load a grid from the api.
     */
    private async loadGrid(): Promise<void> {
        this.setState(
            {
                isBusy: true,
                status: "Loading Grid, please wait...",
                isErrored: false
            },
            async () => {
                const response = await this._apiClient.gridGet({
                    name: this.state.gridName || ""
                });

                if (response.success) {
                    await this._localStorageService.set("gridName", this.state.gridName);

                    this.setState({
                        isBusy: false,
                        status: "",
                        isErrored: false,
                        grid: response.grid
                    });
                } else {
                    this.setState({
                        isBusy: false,
                        status: response.message,
                        isErrored: true
                    });
                }
            });
    }

    /**
     * Show the live view of the grid.
     */
    private liveView(): void {
        this.setState({
            view: "live"
        });
    }

    /**
     * Show the configure view of the grid.
     */
    private configureView(): void {
        this.setState({
            view: "configure"
        });
    }

    /**
     * Create a new grid.
     */
    private async loadCreateGrid(): Promise<void> {
        await this._localStorageService.remove("gridName");
        this.props.history.replace("/grid");

        this.setState(
            {
                gridName: "",
                grid: undefined,
                view: "live"
            },
            () => this.validateData());
    }
}

export default Grid;
