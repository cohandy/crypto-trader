import React from 'react';

import Navbar from '../modules/navbar/Navbar.js';
import SingleToken from '../modules/single-token/SingleToken.js';

class Currency extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section>
                <Navbar/>
                <SingleToken tokenSymbol={this.props.match.params.symbol.toUpperCase()} tokenName={this.props.match.params.name.toUpperCase()}/>
            </section>
        )
    }
}

export default Currency;