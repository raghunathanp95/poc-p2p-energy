import classnames from "classnames";
import { Button } from "iota-react-components";
import { ServiceFactory } from "p2p-energy-common/dist/factories/serviceFactory";
import React, { Component, ReactNode } from "react";
import consumer1 from "../../../assets/consumers/consumer1.svg";
import consumer2 from "../../../assets/consumers/consumer2.svg";
import { DemoGridManager } from "../../../services/demoGridManager";
import { MamExplorer } from "../../../services/mamExplorer";
import "./GridLiveConsumer.scss";
import { GridLiveConsumerProps } from "./GridLiveConsumerProps";
import { GridLiveConsumerState } from "./GridLiveConsumerState";

/**
 * Component which allows the grid to be viewed live.
 */
class GridLiveConsumer extends Component<GridLiveConsumerProps, GridLiveConsumerState> {
    /**
     * The consumer images.
     */
    private readonly _consumerImages: any[];

    /**
     * The demo grid manager.
     */
    private readonly _demoGridManager: DemoGridManager;

    /**
     * Mam explorer service.
     */
    private readonly _mamExplorer: MamExplorer;

    /**
     * Create a new instance of GridLiveConsumer.
     * @param props The props for the component.
     */
    constructor(props: GridLiveConsumerProps) {
        super(props);

        this._consumerImages = [
            consumer1,
            consumer2
        ];

        this._mamExplorer = ServiceFactory.get<MamExplorer>("mam-explorer");
        this._demoGridManager = ServiceFactory.get<DemoGridManager>("demo-grid-manager");

        this.state = {
            isExpanded: false,
            paidBalance: "-----",
            owedBalance: "-----"
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        this._demoGridManager.subscribeConsumer(this.props.consumer.id, (consumerState) => {
            const mamChannel = consumerState && consumerState.consumerManagerState && consumerState.consumerManagerState.channel;
            const mamChannelReturn = consumerState && consumerState.consumerManagerState && consumerState.consumerManagerState.returnChannel;

            this.setState({
                paidBalance: consumerState && consumerState.consumerManagerState && consumerState.consumerManagerState.paidBalance !== undefined ?
                    `${consumerState.consumerManagerState.paidBalance}i` : "-----",
                owedBalance: consumerState && consumerState.consumerManagerState && consumerState.consumerManagerState.owedBalance !== undefined ?
                    `${consumerState.consumerManagerState.owedBalance}i` : "-----",
                mamRoot: mamChannel && mamChannel.initialRoot,
                sideKey: mamChannel && mamChannel.sideKey,
                mamRootReturn: mamChannelReturn && mamChannelReturn.initialRoot,
                sideKeyReturn: mamChannelReturn && mamChannelReturn.sideKey
            });
        });
    }

    /**
     * The component is going to unmount so tidy up.
     */
    public componentWillUnmount(): void {
        this._demoGridManager.unsubscribeConsumer(this.props.consumer.id);
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <div className="grid-live-consumer">
                <div className="grid-live-consumer-info-wrapper">
                    <button
                        className={
                            classnames(
                                "grid-live-consumer-btn",
                                { "grid-live-consumer-btn--expanded": this.state.isExpanded }
                            )
                        }
                        onClick={() => this.setState({ isExpanded: !this.state.isExpanded })}
                    >
                        <div className="grid-live-consumer-btn-top">
                            <img src={this._consumerImages[this.props.idx % 2]} alt={this.props.consumer.name} />
                        </div>
                        <div className="grid-live-consumer-btn-bottom">
                            {this.props.consumer.name}
                            <span className={this.state.isExpanded ? "icon-chevron-up" : "icon-chevron-down"} />
                        </div>
                    </button>
                    <div className="grid-live-consumer-info">
                        <div className="grid-live-consumer-info-id">ID: {this.props.consumer.id}</div>
                        <div className="grid-live-consumer-sub-title">Balance</div>
                        <div className="grid-live-producer-info-data">Paid: {this.state.paidBalance}</div>
                        <div className="grid-live-producer-info-data">Owed: {this.state.owedBalance}</div>
                    </div>
                </div>
                {this.state.isExpanded && (
                    <div
                        className={
                            classnames(
                                "grid-live-consumer-detail",
                                { "grid-live-consumer-detail--expanded": this.state.isExpanded }
                            )}
                    >
                        <br />
                        {this.state.mamRoot && (
                            <Button
                                size="extra-small"
                                color="secondary"
                                onClick={() => this._mamExplorer.explore(this.state.mamRoot, "restricted", this.state.sideKey)}
                            >
                                MAM Usage
                            </Button>
                        )}
                        {this.state.mamRootReturn && (
                            <Button
                                size="extra-small"
                                color="secondary"
                                onClick={() => this._mamExplorer.explore(this.state.mamRootReturn, "restricted", this.state.sideKeyReturn)}
                            >
                                MAM Billing
                            </Button>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default GridLiveConsumer;
