import React from 'react';
import { inject, observer } from 'mobx-react';

import TokenSnippet from './components/TokenSnippet.js';
import AllTokensOptions from './components/AllTokensOptions.js';

import './all-token.css';

@inject('allTokensStore')
@observer
class AllTokens extends React.Component {
    constructor(props) {
        super(props);
        this.store = this.props.allTokensStore;
    }

    componentWillMount() {
        if(!this.store.allTokens.tokens.length) {
            this.store.fetchAllTokens()
        }
    }

    render() {
        if(this.store.allTokens.error) {
            return (
                <div className="l-container">
                    <h5 className="error error--page">{this.store.allTokens.error}</h5>
                </div>
            )
        } else {
            let loading = "";
            if(this.store.allTokens.loading) {
                loading = <div className="loading">LOADING...</div>
            }
            return (
                <div>
                    <AllTokensOptions />
                    <div className="l-container">
                        {loading}
                        <div className="l-row l-row--all-tokens">
                            {
                                this.store.allTokens.tokens.map((token, index) => {
                                    let tokenStyles = ['l-tri-col'];
                                    return (
                                        <div className={tokenStyles.join(' ')} key={`${token.name}-${index}`}>
                                            <TokenSnippet token={token} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default AllTokens;