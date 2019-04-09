import classnames from "classnames";
import React, { Component, ReactNode } from "react";
import biomass from "../../../assets/sources/biomass.svg";
import geothermal from "../../../assets/sources/geothermal.svg";
import solar from "../../../assets/sources/solar.svg";
import wind from "../../../assets/sources/wind.svg";
import "./GridLiveSource.scss";
import { GridLiveSourceProps } from "./GridLiveSourceProps";
import { GridLiveSourceState } from "./GridLiveSourceState";

/**
 * Component which allows the grid to be viewed live.
 */
class GridLiveSource extends Component<GridLiveSourceProps, GridLiveSourceState> {
    /**
     * The source images.
     */
    private readonly _sourceImages: { [id: string]: any };

    /**
     * Create a new instance of GridLiveSource.
     * @param props The props for the component.
     */
    constructor(props: GridLiveSourceProps) {
        super(props);

        this._sourceImages = {
            solar,
            wind,
            geothermal,
            biomass
        };

        this.state = {
            isSelected: this.props.isSelected
        };
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <div className="grid-live-source">
                <button
                    className={
                        classnames(
                            "grid-live-source-btn",
                            { "grid-live-source-btn--selected": this.state.isSelected }
                        )
                    }
                    onClick={() => this.selectSource()}
                >
                    <div className="grid-live-source-btn-top">
                        <img src={this._sourceImages[this.props.source.type.toLowerCase()]} alt={this.props.source.type} />
                    </div>
                    <div className="grid-live-source-btn-bottom">
                        {this.props.source.name}
                    </div>
                </button>
            </div>
        );
    }

    /**
     * Change the selected state of the source.
     */
    private selectSource(): void {
        this.setState({ isSelected: !this.state.isSelected }, () => {
            this.props.onSourceSelected(this.props.source, this.state.isSelected);
        });
    }
}

export default GridLiveSource;
