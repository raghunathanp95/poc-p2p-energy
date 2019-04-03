import { Button, Fieldset, Form, FormActions, FormStatus, Heading, Modal, ScrollHelper, Table, TableBody, TableBodyRow, TableBodyRowData, TableHead, TableHeadRow, TableHeadRowHeader } from "iota-react-components";
import { TrytesHelper } from "p2p-energy-common/dist/utils/trytesHelper";
import React, { Component, ReactNode } from "react";
import { Redirect } from "react-router-dom";
import { ServiceFactory } from "../../factories/serviceFactory";
import { IProducer } from "../../models/api/IProducer";
import { IConfiguration } from "../../models/config/IConfiguration";
import { ConfigurationService } from "../../services/configurationService";
import { DemoApiClient } from "../../services/demoApiClient";
import { LocalStorageService } from "../../services/localStorageService";
import { GridConfigureProps } from "./GridConfigureProps";
import { GridConfigureState } from "./GridConfigureState";
import ProducerConfigure from "./ProducerConfigure";

/**
 * Component which allows the grid to be configured.
 */
class GridConfigure extends Component<GridConfigureProps, GridConfigureState> {
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
    constructor(props: GridConfigureProps) {
        super(props);
        this._localStorageService = ServiceFactory.get<LocalStorageService>("localStorage");

        const config = ServiceFactory.get<ConfigurationService<IConfiguration>>("configuration").get();
        this._apiClient = new DemoApiClient(config.apiEndpoint);

        this.state = {
            gridName: "",
            password: "",
            passwordConfigure: "",
            status: "",
            producers: [],
            passwordSupplied: props.grid.password ? false : true,
            showDelete: false,
            redirect: false
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        this.resetGrid();
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        if (this.state.redirect) {
            return (<Redirect to="/grid" />);
        }

        return (
            <Form>
                {!this.state.configureProducer && (
                    <React.Fragment>
                        <Heading level={2}>Grid</Heading>
                        {!this.state.passwordSupplied && (
                            <React.Fragment>
                                <p>The grid is password protected, please enter the password configure it.</p>
                                <Fieldset>
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter the password for the grid"
                                        value={this.state.passwordConfigure}
                                        onChange={(e) => this.setState({ passwordConfigure: e.target.value })}
                                        readOnly={this.state.isBusy}
                                    />
                                </Fieldset>
                                <FormActions>
                                    <Button disabled={!this.state.isValid || this.state.isBusy} onClick={async () => this.checkPassword()}>Continue</Button>
                                </FormActions>
                                <FormStatus message={this.state.status} isBusy={this.state.isBusy} isError={this.state.isErrored} isSuccess={this.state.isSuccess} />
                            </React.Fragment>
                        )}
                        {this.state.passwordSupplied && (
                            <React.Fragment>
                                <p>Please enter the details for your grid.</p>
                                <Fieldset>
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        placeholder="Name for the grid with a least 5 characters"
                                        value={this.state.gridName}
                                        onChange={(e) => this.setState({ gridName: e.target.value }, () => this.validateData())}
                                        readOnly={this.state.isBusy}
                                    />
                                </Fieldset>
                                <Fieldset>
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        placeholder="Leave password blank to have no password"
                                        value={this.state.password}
                                        onChange={(e) => this.setState({ password: e.target.value }, () => this.validateData())}
                                        readOnly={this.state.isBusy}
                                    />
                                </Fieldset>
                                <hr />
                                <Heading level={3} id="producers">Producers</Heading>
                                <Table>
                                    <TableHead>
                                        <TableHeadRow>
                                            <TableHeadRowHeader>Producer</TableHeadRowHeader>
                                            {this.state.producers.length > 0 && (
                                                <TableHeadRowHeader align="right">
                                                    Actions
                                                </TableHeadRowHeader>
                                            )}
                                        </TableHeadRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.producers.length === 0 && (
                                            <TableBodyRow>
                                                <TableBodyRowData>
                                                    There are currently no producers.
                                                </TableBodyRowData>
                                            </TableBodyRow>
                                        )}
                                        {this.state.producers.map((p, idx) => (
                                            <TableBodyRow key={p.id}>
                                                <TableBodyRowData>{p.name}</TableBodyRowData>
                                                <TableBodyRowData align="right">
                                                    <div className="no-vertical-margin">
                                                        <Button size="small" color="secondary" onClick={() => this.producerConfigure(p)}>Configure</Button>
                                                        <Button size="small" color="secondary" onClick={() => this.producerDelete(p)}>Delete</Button>
                                                    </div>
                                                </TableBodyRowData>
                                            </TableBodyRow>
                                        ))}
                                        <TableBodyRow>
                                            <TableBodyRowData>
                                                <Button size="small" color="secondary" onClick={() => this.producerAdd()}>Add Producer</Button>
                                            </TableBodyRowData>
                                        </TableBodyRow>
                                    </TableBody>
                                </Table>
                                <FormActions>
                                    <Button disabled={!this.state.isValid || this.state.isBusy} onClick={async () => this.gridSave()}>Save</Button>
                                    <Button disabled={this.state.isBusy} onClick={async () => this.resetGrid()}>Reset</Button>
                                    <Button disabled={this.state.isBusy} onClick={async () => this.gridDelete()}>Delete</Button>
                                </FormActions>
                                <FormStatus message={this.state.status} isBusy={this.state.isBusy} isError={this.state.isErrored} isSuccess={this.state.isSuccess} />
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
                {this.state.configureProducer && (
                    <ProducerConfigure producer={this.state.configureProducer} onChange={(p) => this.producerUpdate(p)} />
                )}
                {this.state.deleteProducer && (
                    <Modal
                        title="Confirmation"
                        onClose={(id) => this.producerDeleteConfirmation(id)}
                        buttons={[
                            {
                                id: "yes",
                                label: "Yes"
                            },
                            {
                                id: "no",
                                label: "No"
                            }
                        ]}
                    >
                        Are you sure you want to delete producer '{this.state.deleteProducer.name}' ?
                    </Modal>
                )}
                {this.state.showDelete && (
                    <Modal
                        title="Confirmation"
                        onClose={(id) => this.gridDeleteConfirmation(id)}
                        buttons={[
                            {
                                id: "yes",
                                label: "Yes"
                            },
                            {
                                id: "no",
                                label: "No"
                            }
                        ]}
                    >
                        Are you sure you want to delete the grid ?
                    </Modal>
                )}
            </Form>
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
     * Check the password for the grid is valid.
     */
    private async checkPassword(): Promise<void> {
        this.setState(
            {
                isBusy: true,
                status: "Checking password, please wait...",
                isErrored: false,
                isSuccess: false
            },
            async () => {
                const response = await this._apiClient.gridPasswordCheck({
                    name: this.props.grid.name,
                    password: this.state.passwordConfigure
                });

                this.setState({
                    isBusy: false,
                    status: response.success ? "" : response.message,
                    isErrored: !response.success,
                    isSuccess: response.success,
                    passwordSupplied: response.success,
                    password: this.state.passwordConfigure
                });
            });
    }

    /**
     * Create a grid using the api.
     */
    private async gridSave(): Promise<void> {
        this.setState(
            {
                isBusy: true,
                status: "Saving Grid, please wait...",
                isErrored: false,
                isSuccess: false
            },
            async () => {
                const updatedGrid = {
                    id: this.props.grid.id,
                    name: this.state.gridName || "",
                    password: this.state.password || "",
                    producers: this.state.producers,
                    consumers: []
                };

                const response = await this._apiClient.gridUpdate({
                    name: this.props.grid.name,
                    password: this.state.passwordConfigure,
                    grid: updatedGrid
                });

                if (response.success) {
                    await this._localStorageService.set("gridName", this.state.gridName);

                    if (this.props.onChange) {
                        this.props.onChange(updatedGrid);
                    }

                    this.setState({
                        isBusy: false,
                        status: response.message,
                        isErrored: false,
                        isSuccess: true,
                        passwordConfigure: response.password || ""
                    });

                    setTimeout(() => this.setState({ status: "" }), 3000);
                } else {
                    this.setState({
                        isBusy: false,
                        status: response.message,
                        isErrored: true,
                        isSuccess: false
                    });
                }
            });
    }

    /**
     * Delete a grid using the api.
     */
    private async gridDelete(): Promise<void> {
        this.setState({
            showDelete: true
        });
    }

    /**
     * Delete a grid using the api.
     * @param id The modal result.
     */
    private async gridDeleteConfirmation(id?: string): Promise<void> {
        this.setState(
            {
                showDelete: false
            },
            () => {
                if (id === "yes") {
                    this.setState(
                        {
                            isBusy: true,
                            status: "Deleting Grid, please wait...",
                            isErrored: false,
                            isSuccess: false
                        },
                        async () => {
                            const response = await this._apiClient.gridDelete({
                                name: this.props.grid.name,
                                password: this.state.passwordConfigure
                            });

                            if (response.success) {
                                await this._localStorageService.remove("gridName");

                                this.setState({
                                    isBusy: false,
                                    status: response.message,
                                    isErrored: false,
                                    isSuccess: true,
                                    redirect: true
                                });
                            } else {
                                this.setState({
                                    isBusy: false,
                                    status: response.message,
                                    isErrored: true,
                                    isSuccess: false
                                });
                            }
                        });
                }
            });
    }

    /**
     * Reset the form data.
     */
    private async resetGrid(): Promise<void> {
        this.setState(
            {
                gridName: this.props.grid.name,
                producers: this.props.grid.producers.slice(0)
            },
            () => this.validateData());
    }

    /**
     * Add a new producer.
     */
    private producerAdd(): void {
        ScrollHelper.scrollRoot();

        this.setState({
            configureProducer: {
                id: "",
                name: "",
                sources: []
            }
        });
    }

    /**
     * Configure a producer for the grid.
     * @param producer The producer to configure.
     */
    private producerConfigure(producer: IProducer): void {
        ScrollHelper.scrollRoot();

        this.setState({
            configureProducer: producer
        });
    }

    /**
     * Delete a producer from the grid.
     * @param producer The producer to configure.
     */
    private producerDelete(producer: IProducer): void {
        this.setState({ deleteProducer: producer });
    }

    /**
     * Confirmation of delete a producer from the grid.
     * @param id The producer to configure.
     */
    private producerDeleteConfirmation(id?: string): void {
        if (id === "yes") {
            const producers = this.state.producers;
            const findProducer = this.state.deleteProducer;
            if (findProducer) {
                producers.splice(producers.findIndex(p => p.id === findProducer.id), 1);
            }
            this.setState({
                producers,
                deleteProducer: undefined
            });
        } else {
            this.setState({
                deleteProducer: undefined
            });
        }
    }

    /**
     * Update a new producer.
     * @param producer The producer that was updated.
     */
    private producerUpdate(producer?: IProducer): void {
        if (producer) {
            const producers = this.state.producers;
            if (producer.id === "") {
                producer.id = TrytesHelper.generateHash(27);
                producers.push(producer);
            } else {
                producers.splice(producers.findIndex(p => p.id === producer.id), 1, producer);
            }

            this.setState(
                {
                    configureProducer: undefined,
                    producers
                },
                () => ScrollHelper.scrollIntoViewBySelector("#producers"));
        } else {
            this.setState({ configureProducer: undefined }, () => ScrollHelper.scrollIntoViewBySelector("#producers"));
        }
    }
}

export default GridConfigure;
