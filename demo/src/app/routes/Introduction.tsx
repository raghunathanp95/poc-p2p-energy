import { Heading } from "iota-react-components";
import React, { Component, ReactNode } from "react";

/**
 * Component which will show information about the demonstration.
 */
class Introduction extends Component<any, any> {
    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <React.Fragment>
                <Heading level={1}>Introduction</Heading>
                <p>Blah blah.</p>
            </React.Fragment >
        );
    }
}

export default Introduction;
