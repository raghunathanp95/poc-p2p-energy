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
                <ul>
                    <li>Grid: {this.props.grid.name} [{this.props.grid.id}]</li>
                    <ul>
                        {this.props.grid.producers.map((p, idx) => (
                            <React.Fragment key={idx}>
                                <li>Producer: {p.name} [{p.id}]</li>
                                {p.sources.length > 0 && (
                                    <ul>
                                        {p.sources.map((s, idx2) => (
                                            <li key={idx2}>&nbsp;&nbsp;&nbsp;Source: {s.name} [{s.id}] [{s.type}]</li>
                                        ))}
                                    </ul>
                                )}
                            </React.Fragment>
                        ))}
                    </ul>
                    <ul>
                        {this.props.grid.consumers.map((c, idx) => (
                            <li key={idx}>Consumer: {c.name} [{c.id}]</li>
                        ))}
                    </ul>
                </ul>
            </React.Fragment >
        );
    }
}

export default GridLive;
