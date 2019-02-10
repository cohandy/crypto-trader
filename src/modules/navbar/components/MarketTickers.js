import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('navbarStore')
@observer
class MarketTickers extends React.Component {
    constructor(props) {
        super(props);
        this.store = this.props.navbarStore;
    }

    componentWillMount() {
        this.store.fetchTopMarkets();
        this.refreshMarkets();
        window.addEventListener('resize', () => {
            window.requestAnimationFrame(() => this.store.resizeMarketTickers());
        }, false);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', () => {
            window.requestAnimationFrame(this.store.resizeMarketTickers);
        });
    }

    refreshMarkets() {
        setTimeout(() => {
            this.store.fetchTopMarkets();
            this.refreshMarkets();
        }, 30000);
    }

    render() {
        //get amount of tickers that will fit in screen width for dynamic bar
        let marketTickers = this.store.marketTickerBar.markets.slice(0, this.store.marketTickerBar.tickerCount);
        return (
            <section className="l-nav-tickers">
                {
                    marketTickers.map((market, index) => {
                        let tickerClasses = ['nav-ticker'],
                            tickerStyle = {
                                width: this.store.marketTickerBar.tickerWidthPercent + "%"
                            }
                        return (
                            <div className={tickerClasses.join(' ')} key={"ticker-" + index} style={tickerStyle}>
                                <div className="nav-ticker_top">
                                    <span className="nav-ticker_info">{market.name}/USD</span>
                                    <span className="nav-ticker_info nav-ticker_info--float-right">{market.price_usd}</span>
                                </div>
                                <div className={parseFloat(market.percent_change_24h) > 0 ? "nav-ticker_bottom" : "nav-ticker_bottom nav-ticker_bottom--red"}>
                                    <span className="fa fa-angle-up nav-ticker_arrow"></span>
                                    <span className="nav-ticker_percent">{market.percent_change_24h}%</span>
                                    <span className="nav-ticker_price-btc"><em>Ƀ</em>{market.price_btc}</span>
                                </div>
                            </div>
                        )
                    })
                }
            </section>
        )
    }
}

export default MarketTickers;