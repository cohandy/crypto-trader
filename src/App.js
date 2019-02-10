import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Footer from './modules/footer/Footer.js';
import Home from './pages/Home.js';
import Currency from './pages/Currency.js';
import Portfolio from './pages/Portfolio.js';

class App extends React.Component {
    render() {
        return (
            <main>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/currency/:name/:symbol" component={Currency}/>
                    <Route path="/portfolio" component={Portfolio}/>
                    <Route exact path="/" component={Home}/>
                </Switch>
                <Footer/>
            </main>
        )
    }
}

export default App;