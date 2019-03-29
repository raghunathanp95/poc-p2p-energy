import { Heading } from "iota-react-components";
import React, { Component, ReactNode } from "react";
import { GridLiveProps } from "./GridLiveProps";

/**
 * Component which allows the grid to be viewed live.
 */
class GridLive extends Component<GridLiveProps, any> {
    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <React.Fragment>
                <Heading level={1}>Live</Heading>
                <p>{this.props.grid.name}</p>
                <p>{this.props.grid.id}</p>
            </React.Fragment >
        );
    }
}

export default GridLive;
