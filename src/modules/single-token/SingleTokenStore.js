import { observable, action, computed } from 'mobx';
import 'whatwg-fetch';

class SingleTokenStore {

    @observable currentToken = {
        loading: false,
        error: false,
        rawDetails: null,
        displayDetails: null
    }

    @action fetchTokenDetails(symbol) {
        this.currentToken.loading = true;
        fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=BTC,USD`).then((resp) => {
            return resp.json();            
        }).then((token) => {
            this.currentToken = { ...this.currentToken, rawDetails: token.RAW[symbol], displayDetails: token.DISPLAY[symbol], error:false, loading:false }
        }).catch((err) => {
            console.log(err);
            this.currentToken.error = true;
        });
    }
}

export default new SingleTokenStore;