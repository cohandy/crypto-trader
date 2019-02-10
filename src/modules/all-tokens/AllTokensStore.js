import { observable, action, computed } from 'mobx';
import 'whatwg-fetch';

class AllTokensStore {
    @observable tokenDropdowns = {
        dataType: {
            activeOption: { title: "Market Cap", option: "market_cap_usd" },
            dropdownActive: false,
            options: [
                { title: "Market Cap", option: "market_cap_usd", active: true },
                { title: "Volume 24h", option: "24h_volume_usd", active: false },
                { title: "Circulating Supply", option: "available_supply", active: false },
                { title: "Percent Change 24h", option: "percent_change_24h", active: false }
            ]
        },
        sortType: {
            activeOption: { title: "Descending", option: 0 },
            dropdownActive: false,
            options: [
                { title: "Ascending", option: 1, active: false },
                { title: "Descending", option: 0, active: true }
            ]
        }
    }

    @observable allTokens = {
        tokens: [],
        error: false,
        loading: false,
        fetchAmount: 100,
        fetchAmounts: [100, 200, 300]
    }

    @action toggleDropdowns(dropdownTitle) {
        for(let dropdown in this.tokenDropdowns) {
            if(dropdown !== dropdownTitle) {
                this.tokenDropdowns[dropdown].dropdownActive = false;
            } else {
                this.tokenDropdowns[dropdown].dropdownActive = true;
            }
        }
    }

    @action changeFetchAmount(amount) {
        this.allTokens.fetchAmount = amount;
        this.fetchAllTokens();
    }

    @action changeSortOptions(dropdownTitle, option) {
        //change active sort options
        this.tokenDropdowns[dropdownTitle].activeOption = option;
        this.toggleDropdowns();
        //sort
        this.sortAllTokens();
    }

    @action sortAllTokens(tokens=this.allTokens.tokens) {
        let sortTokens = tokens.slice(0);
        //find active options
        let activeDataChoice = this.tokenDropdowns.dataType.activeOption.option,
            activeSortChoice = this.tokenDropdowns.sortType.activeOption.option;

        //sort tokens arr
        sortTokens.sort((a, b) => {
            if(activeSortChoice) {
                return a[activeDataChoice] - b[activeDataChoice];
            } else {
                return b[activeDataChoice] - a[activeDataChoice];
            }
        });
        this.allTokens = { ...this.allTokens, tokens: sortTokens, loading: false, error: false };
    }

    @action fetchAllTokens() {
        this.allTokens.loading = true;
        this.allTokens.tokens = [];
        fetch(`https://api.coinmarketcap.com/v1/ticker/?limit=${this.allTokens.fetchAmount}`).then((resp) => {
            return resp.json();
        }).then((tokens) => {
            this.sortAllTokens(tokens);
            if(tokens.length < 100) {
                allTokens.foundAll = true;
            }
        }).catch((err) => {
            console.log(err);
            this.allTokens = { ...this.allTokens, loading: false, error: "Error retrieving currencies, reload the page or come back later!" }
        });
    }
}

export default new AllTokensStore;