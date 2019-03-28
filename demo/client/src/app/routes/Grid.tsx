import { Button, Fieldset, Form, FormActions, FormStatus, Heading } from "iota-react-components";
import React, { Component, ReactNode } from "react";
import { ServiceFactory } from "../../factories/serviceFactory";
import { LocalStorageService } from "../../services/localStorageService";
import { GridState } from "./GridState";

/**
 * Component which will show the users grid.
 */
class Grid extends Component<any, GridState> {
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

        this.state = {
            gridName: undefined,
            status: ""
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        const gridName = this._localStorageService.get<string>("gridName");

        if (gridName) {
            await this.loadGrid();
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
                {this.state.gridData && (
                    <React.Fragment>
                        <p>{this.state.gridData.name}</p>
                        <Button
                            onClick={() => this.setState({
                                gridName: undefined,
                                gridData: undefined
                            })}
                        >
                            New Grid
                        </Button>
                    </React.Fragment>
                )}
                {!this.state.gridData && (
                    <React.Fragment>
                        <p>No grid configuration found, please enter the name of an existing grid or create a new one.</p>
                        <Form>
                            <Fieldset>
                                <label>Grid Name</label>
                                <input
                                    type="text"
                                    placeholder="Please enter a name for the grid > 5 characters"
                                    value={this.state.gridName}
                                    onChange={(e) => this.setState({ gridName: e.target.value }, () => this.validateData())}
                                    readOnly={this.state.isBusy}
                                />
                            </Fieldset>
                            <FormActions>
                                <Button disabled={!this.state.isValid || this.state.isBusy} onClick={async () => this.createGrid()}>Create</Button>
                                <Button disabled={!this.state.isValid || this.state.isBusy} onClick={async () => this.loadGrid()}>Load</Button>
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
        const isValid = this.state.gridName && this.state.gridName.trim().length > 5 ? true : false;

        this.setState({ isValid });
    }

    /**
     * Create or load a grid the api.
     */
    private async createGrid(): Promise<void> {

    }

    /**
     * Load a grid from the api.
     */
    private async loadGrid(): Promise<void> {
    }
}

export default Grid;
