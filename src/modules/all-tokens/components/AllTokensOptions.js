import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('allTokensStore')
@observer
class AllTokensOptions extends React.Component {
    constructor(props) {
        super(props);
        this.store = this.props.allTokensStore;
    }

    componentWillMount() {
        window.addEventListener('click', () => {
            this.store.toggleDropdowns();
        }, false);
    }

    componentWillUnmount() {
        window.removeEventListener('click', () => {
            this.store.toggleDropdowns();
        }, false);
    }

    changeSortOptions(e, title, option) {
        e.stopPropagation();
        this.store.changeSortOptions(title, option);
    }

    changeFetchAmount(amount) {
        if(amount !== this.store.allTokens.fetchAmount) {
            this.store.changeFetchAmount(amount);
        }
    }

    toggleDropdown(e, dropdownTitle) {
        e.stopPropagation();
        this.store.toggleDropdowns(dropdownTitle);
    }

    render() {
        let dropdowns = [];
        for(let dropdown in this.store.tokenDropdowns) {
            dropdowns.push(
                <div 
                    className={this.store.tokenDropdowns[dropdown].dropdownActive ? "t-dropdown is-active" : "t-dropdown"} 
                    key={`dropdown-${dropdown}`} 
                    onClick={(e) => this.toggleDropdown(e, dropdown)}
                >
                    <div className="t-dropdown_active-choice">
                        {this.store.tokenDropdowns[dropdown].activeOption.title}
                        <i className="fa fa-caret-down t-dropdown_active-choice_arrow"></i>
                    </div>
                    <ul className="t-dropdown_list">
                        {
                            this.store.tokenDropdowns[dropdown].options.map((option, index) => {
                                return (
                                    <li
                                        onClick={(e) => this.changeSortOptions(e, dropdown, option)}
                                        className={this.store.tokenDropdowns[dropdown].activeOption.title === option.title ? "t-dropdown_list_item is-active" : "t-dropdown_list_item"}
                                        key={`${dropdown}-item-${index}`}
                                    >
                                        {option.title}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            );
        }
        return (
            <div className="l-page-header">
                <div className="l-container">
                    <div className="all-tokens_title">
                        <span className="all-tokens_title-option">TOP </span>
                        {
                            this.store.allTokens.fetchAmounts.map((amount, index) => {
                                let amountOptionClasses = ['all-tokens_title-option all-tokens_title-option--amount'],
                                    divider = "";
                                if(amount === this.store.allTokens.fetchAmount) {
                                    amountOptionClasses.push('is-active');
                                }
                                return (
                                    <span 
                                        className={amountOptionClasses.join(' ')}
                                        onClick={() => this.changeFetchAmount(amount)}
                                        key={`fetch-amount-${index}`}
                                    >
                                        {amount}
                                    </span>
                                )
                            })
                        }
                        <span className="all-tokens_title-option"> CRYPTOCURRENCIES</span>
                    </div>
                    <div className="all-tokens_dropdowns">
                        <div className="all-tokens_dropdowns_container">
                            {dropdowns}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AllTokensOptions;