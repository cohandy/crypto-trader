import React from 'react';
import { inject, observer } from 'mobx-react';

import './single-token.css';

import Trades from '../trades/Trades.js';

@inject('singleTokenStore')
@observer
class SingleToken extends React.Component {
    constructor(props) {
        super(props);
        this.store = this.props.singleTokenStore;
    }

    componentWillMount() {
        this.store.fetchTokenDetails(this.props.tokenSymbol);
    }

    render() {
        if(this.store.currentToken.loading) {
            return (
                <div>
                    <div className="l-page-header">
                        <div className="l-container">
                            <h1 className="currency-header_name">{this.props.tokenName} ({this.props.tokenSymbol})</h1>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <div className="l-page-header">
                        <div className="l-container">
                            <div className="currency-header_top">
                                <h1 className="currency-header_name">{this.props.tokenName} ({this.props.tokenSymbol})</h1>
                                <div className="currency-header_top_prices">
                                    <div className={this.store.currentToken.displayDetails.USD.CHANGEPCT24HOUR < 0 ? "current-header_top_price_container current-header_top_price_container--red" : "current-header_top_price_container"}>
                                        <span className="currency-header_top_percent">{this.store.currentToken.displayDetails.USD.CHANGEPCT24HOUR}%</span>
                                        <span className="currency-header_top_price">{this.store.currentToken.displayDetails.USD.PRICE.replace(/\s/g, '')}</span>
                                        <span className="currency-header_top_time">24h</span>
                                    </div>
                                    <div className={this.store.currentToken.displayDetails.BTC.CHANGEPCT24HOUR < 0 ? "current-header_top_price_container current-header_top_price_container--red current-header_top_price_container--btc" : "current-header_top_price_container current-header_top_price_container--btc"}>
                                        <span className="currency-header_top_percent">{this.store.currentToken.displayDetails.BTC.CHANGEPCT24HOUR}%</span>
                                        <span className="currency-header_top_price">{this.store.currentToken.displayDetails.BTC.PRICE.replace(/\s/g, '')}</span>
                                        <span className="currency-header_top_time">24h</span>
                                    </div>
                                </div>
                            </div>
                            <div className="currency-header_info">
                                <div className="currency-header_info_container">
                                    <p className="currency-header_info_title">Market Cap:</p>
                                    <span className="currenct-header_info_data">{this.store.currentToken.displayDetails.USD.MKTCAP}</span>
                                </div>
                                <div className="currency-header_info_container">
                                    <p className="currency-header_info_title">Volume 24h:</p>
                                    <span className="currenct-header_info_data">{this.store.currentToken.displayDetails.USD.VOLUME24HOURTO} / </span>
                                    <span className="currenct-header_info_data">{this.store.currentToken.displayDetails.BTC.VOLUME24HOURTO}</span>
                                </div>
                                <div className="currency-header_info_container">
                                    <p className="currency-header_info_title">High 24h:</p>
                                    <span className="currenct-header_info_data">{this.store.currentToken.displayDetails.USD.HIGH24HOUR} / </span>
                                    <span className="currenct-header_info_data">{this.store.currentToken.displayDetails.BTC.HIGH24HOUR}</span>
                                </div>
                                <div className="currency-header_info_container">
                                    <p className="currency-header_info_title">Low 24h:</p>
                                    <span className="currenct-header_info_data">{this.store.currentToken.displayDetails.USD.LOW24HOUR} / </span>
                                    <span className="currenct-header_info_data">{this.store.currentToken.displayDetails.BTC.LOW24HOUR}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Trades symbol={this.props.tokenSymbol}/>
                </div>
            )
        }
    }
}

export default SingleToken;