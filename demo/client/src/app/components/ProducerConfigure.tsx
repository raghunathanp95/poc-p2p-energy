import { Button, Fieldset, FormActions, Heading } from "iota-react-components";
import React, { Component, ReactNode } from "react";
import { ProducerConfigureProps } from "./ProducerConfigureProps";
import { ProducerConfigureState } from "./ProducerConfigureState";

/**
 * Component which allows the producer to be configured.
 */
class ProducerConfigure extends Component<ProducerConfigureProps, ProducerConfigureState> {
    /**
     * Create a new instance of Producer.
     * @param props The props to create the component with.
     */
    constructor(props: ProducerConfigureProps) {
        super(props);
        this.state = {
            name: ""
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        this.reset();
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <React.Fragment>
                <Heading level={2}>Producer</Heading>
                <p>Please enter the details for your producer.</p>
                <Fieldset>
                    <label>Name</label>
                    <input
                        type="text"
                        placeholder="Name for the producer with a least 5 characters"
                        value={this.state.name}
                        onChange={(e) => this.setState({ name: e.target.value }, () => this.validateData())}
                    />
                </Fieldset>
                <FormActions>
                    <Button disabled={!this.state.isValid} onClick={async () => this.ok()}>OK</Button>
                    <Button onClick={async () => this.cancel()}>Cancel</Button>
                </FormActions>
            </React.Fragment >
        );
    }

    /**
     * Validate the form data.
     */
    private validateData(): void {
        const isValid = this.state.name && this.state.name.trim().length >= 5 ? true : false;

        this.setState({ isValid });
    }

    /**
     * Create a grid using the api.
     */
    private async ok(): Promise<void> {
        const updatedProducer = {
            ...this.props.producer,
            name: this.state.name || ""
        };

        if (this.props.onChange) {
            this.props.onChange(updatedProducer);
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

    /**
     * Reset the form data.
     */
    private async reset(): Promise<void> {
        this.setState(
            {
                name: this.props.producer.name
            },
            () => this.validateData());
    }

}

export default ProducerConfigure;
