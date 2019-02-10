import React from 'react';

import Navbar from '../modules/navbar/Navbar.js';
import Trades from '../modules/trades/Trades.js';

class Portfolio extends React.Component {
    render() {
        return (
            <section>
                <Navbar/>
                <Trades portfolioPage={true}/>
            </section>
        )
    }
}

export default Portfolio;