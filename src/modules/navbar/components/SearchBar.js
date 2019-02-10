import React from 'react';
import { inject, observer } from 'mobx-react';

import SearchResults from './SearchResults';

@inject('navbarStore')
@observer
class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.store = this.props.navbarStore;
    }

    componentWillMount() {
        this.store.fetchCCTokens();
    }

    fetchTokens() {
        if(this._input.value.length > 0) {
            this.store.searchCCTokens(this._input.value);
        }
    }

    inputFocus() {
        //add window click listener when search results div is active
        window.addEventListener('click', this.closeResultsCheck.bind(this), false);
    }

    removeCurrentResults(remove) {
        //add a setTimeout if user clicked on link so it doesn't stop action
        if(remove) {
            document.querySelector('.nav-search_input').value = "";
            this.store.removeCurrentResults();
        } else {
            setTimeout(() => {
                document.querySelector('.nav-search_input').value = "";
                this.store.removeCurrentResults();
            }, 10);
        }
        window.removeEventListener('click', this.closeResultsCheck.bind(this), false);
    }

    closeResultsCheck(e) {
        if(e.target.parentNode.className === "search-result-item" || e.target.parentNode.className === "search-result") {
            this.removeCurrentResults(false);
        } else {
            this.removeCurrentResults(true);
        }
    }

    render() {
        return (
            <div className="nav-search">
                <div className="nav-search_input-container">
                    <input 
                        type="text" 
                        name="q" 
                        className="nav-search_input" 
                        placeholder="Search" 
                        autoComplete="off"
                        onFocus={() => this.inputFocus()}
                        ref={(el) => this._input = el} 
                        onKeyUp={() => this.fetchTokens()}
                    />
                    <i className="fa fa-search nav-search_submit"></i>
                    <SearchResults/>
                </div>
            </div>
        )
    }
}

export default SearchBar;