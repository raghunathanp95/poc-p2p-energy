import { Button, Fieldset, Form, FormActions, FormStatus, Heading } from "iota-react-components";
import React, { Component, ReactNode } from "react";
import { ServiceFactory } from "../../factories/serviceFactory";
import { IGrid } from "../../models/api/IGrid";
import { IConfiguration } from "../../models/config/IConfiguration";
import { ConfigurationService } from "../../services/configurationService";
import { DemoApiClient } from "../../services/demoApiClient";
import { LocalStorageService } from "../../services/localStorageService";
import { GridState } from "./GridState";

/**
 * Component which will show the users grid.
 */
class Grid extends Component<any, GridState> {
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
    constructor(props: any) {
        super(props);
        this._localStorageService = ServiceFactory.get<LocalStorageService>("localStorage");

        const config = ServiceFactory.get<ConfigurationService<IConfiguration>>("configuration").get();
        this._apiClient = new DemoApiClient(config.apiEndpoint);

        this.state = {
            gridName: "",
            status: ""
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        const gridName = this._localStorageService.get<string>("gridName");

        if (gridName) {
            this.setState({ gridName }, async () => this.loadGrid());
        }
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <React.Fragment>
                <Heading level={1}>Grid</Heading>
                {this.state.grid && (
                    <React.Fragment>
                        <p>{this.state.gridName}</p>
                        <Button
                            onClick={() => this.newGrid()}
                        >
                            New Grid
                        </Button>
                    </React.Fragment>
                )}
                {!this.state.grid && (
                    <React.Fragment>
                        <p>No grid configuration found, please enter the name of an existing grid or create a new one.</p>
                        <Form>
                            <Fieldset>
                                <label>Grid Name</label>
                                <input
                                    type="text"
                                    placeholder="Name for the grid with a least 5 characters"
                                    value={this.state.gridName}
                                    onChange={(e) => this.setState({ gridName: e.target.value }, () => this.validateData())}
                                    readOnly={this.state.isBusy}
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
        const isValid = this.state.gridName && this.state.gridName.trim().length >= 5 ? true : false;

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
                    blah: "goo"
                };
                const response = await this._apiClient.gridCreate({
                    name: this.state.gridName || "",
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
     * Create a new grid.
     */
    private async newGrid(): Promise<void> {
        await this._localStorageService.remove("gridName");

        this.setState({
            gridName: undefined,
            grid: undefined
        });
    }
}

export default Grid;
