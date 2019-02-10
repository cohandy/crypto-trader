import React from 'react';

import Navbar from '../modules/navbar/Navbar.js';
import AllTokens from '../modules/all-tokens/AllTokens.js';

class Home extends React.Component {
    render() {
        return (
            <section>
                <Navbar/>
                <AllTokens/>
            </section>
        )
    }
}

export default Home;