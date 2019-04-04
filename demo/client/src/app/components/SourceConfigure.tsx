import { Button, Fieldset, FormActions, Heading, Select } from "iota-react-components";
import React, { Component, ReactNode } from "react";
import { SourceConfigureProps } from "./SourceConfigureProps";
import { SourceConfigureState } from "./SourceConfigureState";

/**
 * Component which allows the source to be configured.
 */
class SourceConfigure extends Component<SourceConfigureProps, SourceConfigureState> {
    /**
     * Create a new instance of Source.
     * @param props The props to create the component with.
     */
    constructor(props: SourceConfigureProps) {
        super(props);

        this.state = {
            name: this.props.item.name,
            type: this.props.item.type || "Solar"
        };
    }

    /**
     * The component was mounted.
     */
    public componentDidMount(): void {
        this.validateData();
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <React.Fragment>
                <Heading level={2}>Source</Heading>
                <p>Please enter the details for the source.</p>
                <Fieldset>
                    <label>Name</label>
                    <input
                        type="text"
                        placeholder="Name for the source between 5 and 30 characters"
                        value={this.state.name}
                        onChange={(e) => this.setState({ name: e.target.value }, () => this.validateData())}
                        maxLength={30}
                    />
                </Fieldset>
                <Fieldset>
                    <label>Type</label>
                    <Select
                        value={this.state.type}
                        onChange={(e) => this.setState({ type: e.target.value }, () => this.validateData())}
                    >
                        <option>Solar</option>
                        <option>Wind</option>
                        <option>Geothermal</option>
                        <option>Biomass</option>
                    </Select>
                </Fieldset>
                <FormActions>
                    <Button disabled={!this.state.isValid} onClick={async () => this.ok()}>OK</Button>
                    <Button color="secondary" onClick={async () => this.cancel()}>Cancel</Button>
                </FormActions>
            </React.Fragment >
        );
    }

    /**
     * Validate the form data.
     */
    private validateData(): void {
        const isValid = this.state.name && this.state.name.trim().length >= 5 && this.state.name.trim().length <= 30 ? true : false;

        this.setState({ isValid });
    }

    /**
     * Confirm the editing.
     */
    private async ok(): Promise<void> {
        const updated = {
            ...this.props.item,
            name: this.state.name,
            type: this.state.type
        };

        if (this.props.onChange) {
            this.props.onChange(updated);
        }
    }

    /**
     * Cancel the editing.
     */
    private async cancel(): Promise<void> {
        if (this.props.onChange) {
            this.props.onChange(undefined);
        }
    }
}

export default SourceConfigure;
