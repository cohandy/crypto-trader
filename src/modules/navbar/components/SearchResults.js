import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

@inject('navbarStore')
@observer
class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.store = this.props.navbarStore;
    }

    render() {
        let resultsClassNames = ['nav-search_results'];
        if(this.store.searchBar.currentQuery !== "") {
            resultsClassNames.push('is-active');
        }
        if(this.store.searchBar.error) {
            return (
                <ul className={resultsClassNames.join(' ')}>
                    <li className="error error--nav-results">
                        Error requesting tokens, please reload the page or try again later!
                    </li>
                </ul>
            )
        } else if(this.store.searchBar.loading) {
            return (
                <ul className={resultsClassNames.join(' ')}>
                    <li className="loading-nav-results">
                        LOADING...
                    </li>
                </ul>
            )
        } else if(this.store.searchBar.currentResults.length === 0 && this.store.searchBar.currentQuery !== "") {
            return (
                <ul className={resultsClassNames.join(' ')}>
                    <li className="loading-nav-results">
                        NO RESULTS FOUND
                    </li>
                </ul>
            )
        } else {
            let letterMatchRegEx = new RegExp('^' + this.store.searchBar.currentQuery, 'i');
            return (
                <ul className={resultsClassNames.join(' ')}>
                    {
                        this.store.searchBar.currentResults.map((token, index) => {
                            let matchCoinName = token.CoinName.match(letterMatchRegEx),
                                displayCoinName = <span className="search-result_name">{token.CoinName}</span>;
                            if(matchCoinName) {
                                displayCoinName = <span className="search-result_name">
                                                    <em>{matchCoinName[0]}</em>
                                                    {token.CoinName.split(matchCoinName[0])[1]}
                                                  </span>
                            }
                            let matchCoinSymbol = token.Symbol.match(letterMatchRegEx),
                                displayCoinSymbol = <span className="search-result_symbol">{token.Symbol}</span>;
                            if(matchCoinSymbol) {
                                displayCoinSymbol = <span className="search-result_symbol">
                                                        <em>{matchCoinSymbol[0]}</em>
                                                        {token.Symbol.split(matchCoinSymbol[0])[1]}
                                                    </span>
                            }
                            return (
                                <li key={token.FullName + "-" + index} className="search-result-item">
                                    <Link to={`/currency/${token.CoinName.toLowerCase()}/${token.Name.toLowerCase()}`} className="search-result">
                                        <img src={`https://www.cryptocompare.com${token.ImageUrl}`} alt={`${token.FullName} Icon`} className="search-result_icon"/>
                                        {displayCoinName}
                                        {displayCoinSymbol}
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
            )
        }
    }
}

export default SearchResults;