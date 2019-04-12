import classnames from "classnames";
import { Button } from "iota-react-components";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import React, { Component, ReactNode } from "react";
import biomass from "../../../assets/sources/biomass.svg";
import geothermal from "../../../assets/sources/geothermal.svg";
import solar from "../../../assets/sources/solar.svg";
import wind from "../../../assets/sources/wind.svg";
import { DemoGridManager } from "../../../services/demoGridManager";
import { MamExplorer } from "../../../services/mamExplorer";
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
     * The demo grid manager.
     */
    private readonly _demoGridManager: DemoGridManager;

    /**
     * Mam explorer service.
     */
    private readonly _mamExplorer: MamExplorer;

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

        this._mamExplorer = ServiceFactory.get<MamExplorer>("mam-explorer");
        this._demoGridManager = ServiceFactory.get<DemoGridManager>("demo-grid-manager");

        this.state = {
            isSelected: this.props.isSelected
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        this._demoGridManager.subscribeSource(this.props.source.id, (sourceState) => {
            const mamChannel = sourceState && sourceState.sourceManagerState && sourceState.sourceManagerState.channel;

            this.setState({
                mamRoot: mamChannel && mamChannel.initialRoot,
                sideKey: mamChannel && mamChannel.sideKey
            });
        });
    }

    /**
     * The component is going to unmount so tidy up.
     */
    public componentWillUnmount(): void {
        this._demoGridManager.unsubscribeSource(this.props.source.id);
    }

    /**
     * The component received an update.
     * @param prevProps The previous properties.
     */
    public componentDidUpdate(prevProps: GridLiveSourceProps): void {
        if (this.props.isSelected !== prevProps.isSelected) {
            this.setState({
                isSelected: this.props.isSelected
            });
        }

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

                {this.state.mamRoot && (
                    <Button
                        size="extra-small"
                        color="secondary"
                        onClick={() => this._mamExplorer.explore(this.state.mamRoot, "restricted", this.state.sideKey)}
                    >
                        MAM Output
                    </Button>
                )}
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
