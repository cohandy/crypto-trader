import { observable, action, computed } from 'mobx';
import 'whatwg-fetch';

class TradesStore {
    /*
        localStorage schema looks like this:
        {
            "symbol": [
                {
                    "date": "12/12/12",
                    "priceBTC": "0.0003444",
                    "priceUSD": "4.00",
                    "amount": "300"
                }
            ]
        }
    */
    @observable trades = [];
    @observable portfolioPage = {
        loading: false,
        error: false,
        tradeTokens: null
    }

    @action fetchAllTrades() {
        this.trades = [];
        this.portfolioPage.loading = true;
        this.portfolioPage.tradeTokens = null;
        let localStorageTrades = localStorage.getItem('trades');
        if(!localStorageTrades) return;
        let jsonTrades = JSON.parse(localStorageTrades),
            tradeSymbols = "";
        for(let key in jsonTrades) {
            tradeSymbols += `${key},`;
        }
        tradeSymbols = tradeSymbols.substring(0, tradeSymbols.length - 1);
        //fetch current prices of all trade tokens
        fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${tradeSymbols}&tsyms=BTC,USD`).then((resp) => {
            return resp.json();
        }).then((tokens) => {
            this.portfolioPage = { ...this.portfolioPage, loading:false, error:false, tradeTokens: tokens.RAW }
            for(let key in tokens.RAW) {
                let tokenTrades = jsonTrades[key];
                for(let i=0;i<tokenTrades.length;i++) {
                    tokenTrades[i].currentPriceBTC = tokens.RAW[key].BTC.PRICE;
                    tokenTrades[i].currentPriceUSD = tokens.RAW[key].USD.PRICE;
                    tokenTrades[i].symbolIndex = i;
                }
            }
            let nextTrades = [];
            for(let key in jsonTrades) {
                nextTrades = nextTrades.concat(jsonTrades[key]);
            }
            this.trades = nextTrades;
        }).catch((err) => {
            console.log(err);
            this.portfolioPage.error = true;
        });
    }

    @action fetchSingleTokenTrades(symbol, btcPrice, usdPrice) {
        this.trades = [];
        let localStorageTrades = localStorage.getItem('trades');
        if(localStorageTrades) {
            let jsonTrades = JSON.parse(localStorageTrades);
            if(jsonTrades.hasOwnProperty(symbol)) {
                jsonTrades[symbol].map((trade) => {
                    trade.currentPriceBTC = btcPrice;
                    trade.currentPriceUSD = usdPrice;
                    return trade;
                });
                this.trades = jsonTrades[symbol];
            }
        }
    }

    @action updateAddTrade(symbol, amount, priceBTC, priceUSD, currentPriceBTC, currentPriceUSD, portfolioPage=null, tradeIndex=null) {
        if(!amount) return;
        let localStorageTrades = localStorage.getItem('trades'),
            nextTrades = {};
        if(localStorageTrades) {
            nextTrades = JSON.parse(localStorageTrades);
        }
        if(!nextTrades.hasOwnProperty(symbol)) {
            nextTrades[symbol] = [];
        }
        let date = new Date;
        if(tradeIndex === null) {
            tradeIndex = nextTrades[symbol].length;
        } 
        nextTrades[symbol][tradeIndex] = {
            "date": date.toLocaleDateString("en-US"),
            "amount": amount,
            "priceBTC": priceBTC,
            "priceUSD": priceUSD,
            "symbol": symbol
        }
        localStorage.setItem('trades', JSON.stringify(nextTrades));
        if(portfolioPage) {
            for(let key in this.portfolioPage.tradeTokens) {
                let tokenTrades = nextTrades[key];
                for(let i = 0; i < tokenTrades.length; i++) {
                    tokenTrades[i].currentPriceBTC = this.portfolioPage.tradeTokens[key].BTC.PRICE;
                    tokenTrades[i].currentPriceUSD = this.portfolioPage.tradeTokens[key].USD.PRICE;
                    tokenTrades[i].symbolIndex = i;
                }
            }
            let refreshTrades = [];
            for(let key in nextTrades) {
                refreshTrades = refreshTrades.concat(nextTrades[key]);
            }
            this.trades = refreshTrades;
        } else {
            //add current prices back in, don't store in localStorage as data will get outdated
            let nextTradesSymbol = nextTrades[symbol].map((trade) => {
                trade.currentPriceBTC = currentPriceBTC;
                trade.currentPriceUSD = currentPriceUSD;
                return trade;
            });
            this.trades = nextTradesSymbol;
        }
    }

    @action deleteTrade(trade, tradeIndex, portfolioPage=null, currentPriceBTC, currentPriceUSD) {
        let localStorageTrades = JSON.parse(localStorage.getItem('trades'));
        let nextTradesSymbol = localStorageTrades[trade.symbol].filter((thisTrade, index) => {
            if(index !== tradeIndex) {
                return thisTrade;
            }
        });
        localStorageTrades[trade.symbol] = nextTradesSymbol;
        localStorage.setItem('trades', JSON.stringify(localStorageTrades));
        if(portfolioPage) {
            for(let key in this.portfolioPage.tradeTokens) {
                let tokenTrades = localStorageTrades[key];
                for(let i = 0; i < tokenTrades.length; i++) {
                    tokenTrades[i].currentPriceBTC = this.portfolioPage.tradeTokens[key].BTC.PRICE;
                    tokenTrades[i].currentPriceUSD = this.portfolioPage.tradeTokens[key].USD.PRICE;
                    tokenTrades[i].symbolIndex = i;
                }
            }
            let nextTrades = [];
            for(let key in localStorageTrades) {
                nextTrades = nextTrades.concat(localStorageTrades[key]);
            }
            this.trades = nextTrades;
        } else {
            this.trades = nextTradesSymbol.map((trade) => {
                trade.currentPriceBTC = currentPriceBTC;
                trade.currentPriceUSD = currentPriceUSD;
                return trade;
            });
        }
    }
}

export default new TradesStore;