import React from 'react';
import { inject, observer } from 'mobx-react';

import './trades.css';

@inject('tradesStore')
@inject('singleTokenStore')
@inject('navbarStore')
@observer
class Trades extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formActive: false,
            activeTradeEdit: null
        }
        this.tableHeaders = [
            "Date",
            "Symbol",
            "Amount",
            "Profit BTC",
            "Profit USD",
            "Worth BTC",
            "Worth USD"
        ];
        this.tableFormHeaders = [
            "Date",
            "Symbol",
            "Amount",
            "Price BTC",
            "Price USD",
            "",
            ""
        ];
    }

    componentWillMount() {
        if(this.props.portfolioPage) {
            //will need to fetch current prices for all coins in trades
            this.props.tradesStore.fetchAllTrades();
        } else {
            this.props.tradesStore.fetchSingleTokenTrades(this.props.symbol, this.props.singleTokenStore.currentToken.rawDetails.BTC.PRICE, this.props.singleTokenStore.currentToken.rawDetails.USD.PRICE);
        }
    }

    activateSubmitForm() {
        if(this.state.formActive) {
            //submit form
            let symbol = "",
                currentPriceBTC = 0,
                currentPriceUSD = 0,
                tradeIndex = null;
            if(this.state.activeTradeEdit) {
                symbol = this.state.activeTradeEdit.symbol;
                tradeIndex = this.state.activeTradeEdit.index;
                currentPriceBTC = this.state.activeTradeEdit.currentPriceBTC;
                currentPriceUSD = this.state.activeTradeEdit.currentPriceUSD;
            } else {
                symbol = this.props.symbol;
                currentPriceBTC = this.props.singleTokenStore.currentToken.rawDetails.BTC.PRICE;
                currentPriceUSD = this.props.singleTokenStore.currentToken.rawDetails.USD.PRICE;
            }
            this.props.tradesStore.updateAddTrade(symbol, this._amountInput.value, this._btcPriceInput.value, this._usdPriceInput.value, currentPriceBTC, currentPriceUSD, this.props.portfolioPage, tradeIndex);
            this.setState({
                formActive: false,
                activeTradeEdit: null
            });
        } else {
            this.setState({
                formActive: true
            });
        }
    }

    editTrade(trade, index) {
        trade.index = index;
        this.setState({
            activeTradeEdit: trade,
            formActive: true
        });
    }

    deleteTrade(trade, index) {
        let confirm = window.confirm("Are you sure you want to delete this trade?");
        if(confirm) {
            if(this.props.portfolioPage) {
                this.props.tradesStore.deleteTrade(trade, index, this.props.portfolioPage, trade.currentPriceBTC, trade.currentPriceUSD);
            } else {
                this.props.tradesStore.deleteTrade(trade, index, this.props.portfolioPage, this.props.singleTokenStore.currentToken.rawDetails.BTC.PRICE, this.props.singleTokenStore.currentToken.rawDetails.USD.PRICE);
            }
        }
    }

    determineUsdFromBtc() {
        let btcPrice = this.props.navbarStore.marketTickerBar.markets[0].price_usd,
            formBtcPrice = this._btcPriceInput.value;
        this._usdPriceInput.value = (Number(btcPrice) * Number(formBtcPrice)).toFixed(2);
    }

    getProfitPercent(btc, token) {
        let currentPrice = 0,
            priceBought = token.priceBTC;
        if(!btc) priceBought = token.priceUSD;
        if(this.props.portfolioPage) {
            currentPrice = token.currentPriceBTC;
            if(!btc) currentPrice = token.currentPriceUSD;
        } else {
            currentPrice = this.props.singleTokenStore.currentToken.rawDetails.USD.PRICE;
            if(btc) currentPrice = this.props.singleTokenStore.currentToken.rawDetails.BTC.PRICE;
        }
        return parseFloat(((currentPrice / priceBought) * 100) - 100).toFixed(2);
    }

    displayNumber(num) {
        if(parseFloat(num) > 100) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return num;
        }
    }

    render() {
        let tableHeaderNames = this.tableHeaders,
            tableHeader = null,
            tableRowForm = null,
            date = new Date;
        if(this.state.formActive) {
            tableHeaderNames = this.tableFormHeaders;
            tableRowForm = <tr className="token-trades_form">
                <td className="token-trades-form_no-input">{date.toLocaleDateString("en-US")}</td>
                {
                    this.state.activeTradeEdit
                    ?
                    <td className="token-trades-form_no-input">{this.state.activeTradeEdit.symbol}</td>
                    :
                    <td className="token-trades-form_no-input">{this.props.symbol}</td>
                }
                <td>
                    {
                        this.state.activeTradeEdit
                        ?
                        <input type="text" className="token-trades_form_input" placeholder="Amount" ref={(el) => this._amountInput = el} defaultValue={this.state.activeTradeEdit.amount}/>
                        :
                        <input type="text" className="token-trades_form_input" placeholder="Amount" ref={(el) => this._amountInput = el} />
                    }
                </td>
                <td>
                    {
                        this.state.activeTradeEdit
                        ?
                        <input type="text" className="token-trades_form_input" placeholder="Price BTC" ref={(el) => this._btcPriceInput = el} onKeyUp={this.determineUsdFromBtc.bind(this)} defaultValue={this.state.activeTradeEdit.priceBTC}/>
                        :
                        <input type="text" className="token-trades_form_input" placeholder="Price BTC" ref={(el) => this._btcPriceInput = el} onKeyUp={this.determineUsdFromBtc.bind(this)} />
                    }
                </td>
                <td>
                    {
                        this.state.activeTradeEdit
                        ?
                        <input type="text" className="token-trades_form_input" placeholder="Price USD" ref={(el) => this._usdPriceInput = el} defaultValue={this.state.activeTradeEdit.priceUSD}/>
                        :
                        <input type="text" className="token-trades_form_input" placeholder="Price USD" ref={(el) => this._usdPriceInput = el} />
                    }
                </td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        }
        if(this.props.tradesStore.trades.length > 0 || this.state.formActive) {
            tableHeader = <thead>
                            <tr className="token-trades_titles">
                                {
                                    tableHeaderNames.map((header, index) => {
                                        return (
                                            <th key={`table-header-${index}`}>{header}</th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>
        }
        let plusStyle = {}
        if(this.props.portfolioPage) plusStyle.display = "none";
        let loading = "";
        if(this.props.portfolioPage && this.props.tradesStore.portfolioPage.loading) loading = <div className="loading loading--portfolio">LOADING...</div>;
        if(this.props.portfolioPage && !this.props.tradesStore.portfolioPage.loading && !this.props.tradesStore.trades.length) loading = <div className="loading loading--portfolio">NO TRADES</div>;
        return (
            <div className="l-container">
                <div className="single-token-trades">
                    <h5 className="token-trades_title">YOUR TRADES</h5>
                    <table className="token-trades_table">
                        {tableHeader}
                        <tbody>
                            {tableRowForm}
                            {
                                this.props.tradesStore.trades.map((token, index) => {
                                    let profitBTC = this.getProfitPercent(true, token),
                                        profitUSD = this.getProfitPercent(false, token);
                                    return (
                                        <tr className={this.state.formActive ? "token-trade token-trade--form-active" : "token-trade"} key={`trade-token-${index}`}>
                                            <td>
                                                {token.date}
                                                {
                                                    this.props.portfolioPage
                                                    ?
                                                    <i className="fa fa-edit token-trade_icon" onClick={() => this.editTrade(token, token.symbolIndex)}></i>
                                                    :
                                                    <i className="fa fa-edit token-trade_icon" onClick={() => this.editTrade(token, index)}></i>
                                                }
                                                {
                                                    this.props.portfolioPage
                                                    ?
                                                    <i className="fa fa-times-circle token-trade_icon" onClick={() => this.deleteTrade(token, token.symbolIndex)}></i>
                                                    :
                                                    <i className="fa fa-times-circle token-trade_icon" onClick={() => this.deleteTrade(token, index)}></i>
                                                }
                                            </td>
                                            <td>{token.symbol}</td>
                                            <td>{token.amount}</td>
                                            <td className={profitBTC > 0 ? "token-trade_percent" : "token-trade_percent token-trade_percent--red"}>{profitBTC}%</td>
                                            <td className={profitUSD > 0 ? "token-trade_percent" : "token-trade_percent token-trade_percent--red"}>{profitUSD}%</td>
                                            <td>Ƀ{(token.currentPriceBTC * token.amount).toFixed(2)}</td>
                                            <td>${this.displayNumber((token.currentPriceUSD * token.amount).toFixed(2))}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    {
                        this.state.formActive
                        ?
                        <span className="trade-button fa fa-check-circle" onClick={() => this.activateSubmitForm()}></span>
                        :
                        <span className="trade-button fa fa-plus-circle" onClick={() => this.activateSubmitForm()} style={plusStyle}></span>
                    }
                    {loading}
                </div>
            </div>
        )
    }
}

export default Trades;