import { observable, action, computed } from 'mobx';
import 'whatwg-fetch';

class NavbarStore {
    @observable marketTickerBar = {
        error: false,
        loading: false,
        tickerCount: 0,
        tickerWidthPercent: 20,
        markets: []
    }

    @observable searchBar = {
        allCCTokens: [],
        currentResults: [],
        currentQuery: "",
        loading: false,
        error: false
    }

    @action fetchCCTokens() {
        this.searchBar.loading = true;
        fetch('https://min-api.cryptocompare.com/data/all/coinlist').then((resp) => {
            return resp.json();
        }).then((tokens) => {
            this.searchBar = { ...this.searchBar, allCCTokens: tokens.Data, loading:false, error:false }
        }).catch((err) => {
            console.log(err);
            this.searchBar.error = true;
        });
    }

    @action searchCCTokens(q) {
        let newCurrentResults = [];
        for(let token in this.searchBar.allCCTokens) {
            let testRegex = new RegExp('^' + q, 'i'),
                thisToken = this.searchBar.allCCTokens[token];
            if(testRegex.test(token) || testRegex.test(thisToken.FullName)) {
                newCurrentResults.push(thisToken);
            }
        }
        this.searchBar.currentResults = newCurrentResults;
        this.searchBar.currentQuery = q;
    }

    @action removeCurrentResults() {
        this.searchBar.currentResults = [];
        this.searchBar.currentQuery = "";
    }

    @action fetchTopMarkets() {
        fetch('https://api.coinmarketcap.com/v1/ticker/?limit=12').then((resp) => {
            return resp.json();
        }).then((markets) => {
            this.resizeMarketTickers();
            this.marketTickerBar = { ...this.marketTickerBar, loading: false, markets: markets }
        }).catch((err) => {
            console.log(err);
            this.marketTickerBar.error = true;
        });
    }

    @action resizeMarketTickers() {
        //235 is min ticker width
        let tickerAmount = Math.floor(window.innerWidth/235);
        this.marketTickerBar.tickerWidthPercent = 100/tickerAmount;
        this.marketTickerBar.tickerCount = tickerAmount;
    }
}

export default new NavbarStore;