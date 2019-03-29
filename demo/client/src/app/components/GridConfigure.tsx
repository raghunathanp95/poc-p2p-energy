import { Heading } from "iota-react-components";
import React, { Component, ReactNode } from "react";
import { GridConfigureProps } from "./GridConfigureProps";

/**
 * Component which allows the grid to be configured.
 */
class GridConfigure extends Component<GridConfigureProps, any> {
    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <React.Fragment>
                <Heading level={1}>Configuration</Heading>
                <p>{this.props.grid.name}</p>
                <p>{this.props.grid.id}</p>
            </React.Fragment >
        );
    }
}

export default GridConfigure;
