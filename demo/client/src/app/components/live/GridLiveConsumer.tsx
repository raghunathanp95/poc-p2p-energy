import classnames from "classnames";
import React, { Component, ReactNode } from "react";
import consumer1 from "../../../assets/consumers/consumer1.svg";
import consumer2 from "../../../assets/consumers/consumer2.svg";
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
     * Create a new instance of GridLiveConsumer.
     * @param props The props for the component.
     */
    constructor(props: GridLiveConsumerProps) {
        super(props);

        this._consumerImages = [
            consumer1,
            consumer2
        ];

        this.state = {
            isExpanded: false,
            // tslint:disable:insecure-random
            paidBalance: Math.floor(Math.random() * 1000),
            owedBalance: Math.floor(Math.random() * 1000)
        };
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
                        </div>
                    </button>
                    <div className="grid-live-consumer-info">
                        <div className="grid-live-consumer-info-id">ID: {this.props.consumer.id}</div>
                        <div className="grid-live-consumer-sub-title">Balance</div>
                        <div className="grid-live-consumer-info-data">Paid: {this.state.paidBalance}i</div>
                        <div className="grid-live-consumer-info-data">Owed: {this.state.owedBalance}i</div>
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
                    <br/>
                    Here will be the expanded details for the consumer.
                    </div>
                )}
            </div>
        );
    }
}

export default GridLiveConsumer;
