import React from 'react';
import { Link } from 'react-router-dom';

class TokenSnippet extends React.Component {

    displayNumber(num) {
        if(parseFloat(num) > 100) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return num;
        }
    }

    render() {
        return (
            <Link to={`/currency/${this.props.token.name.toLowerCase()}/${this.props.token.symbol.toLowerCase()}`} className={parseFloat(this.props.token.percent_change_24h) > 0 ? "token-snippet" : "token-snippet token-snippet--down"}>
                <div className="token-snippet_top">
                    <span className="token-snippet_title">{this.props.token.name}</span>
                    <span className="token-snippet_percent">{this.props.token.percent_change_24h}%<em>24h</em></span>
                    <span className="token-snippet_top_arrow fa fa-caret-up"></span>
                </div>
                <p className="token-snippet_price">${this.displayNumber(this.props.token.price_usd)}</p>
                <div className="token-snippet_details">
                    <span className="token-snippet_details_name">Market Cap:</span>
                    <span className="token-snippet_details_info">${this.displayNumber(this.props.token.market_cap_usd)}</span>
                </div>
                <div className="token-snippet_details">
                    <span className="token-snippet_details_name">Volume 24h:</span>
                    <span className="token-snippet_details_info">${this.displayNumber(this.props.token['24h_volume_usd'])}</span>
                </div>
                <div className="token-snippet_details">
                    <span className="token-snippet_details_name">Supply:</span>
                    <span className="token-snippet_details_info">{this.displayNumber(this.props.token.available_supply)}</span>
                </div>
            </Link>
        )
    }
}

export default TokenSnippet;