import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';

import App from './App.js';

import 'normalize.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/module.css';

import navbarStore from './modules/navbar/NavbarStore.js';
import allTokensStore from './modules/all-tokens/AllTokensStore.js';
import singleTokenStore from './modules/single-token/SingleTokenStore.js';
import tradesStore from './modules/trades/TradesStore.js';

const stores = {
    navbarStore,
    allTokensStore,
    singleTokenStore,
    tradesStore
}

window.appState = stores;

ReactDOM.render((
    <Provider {...stores}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
), document.getElementById('root'));


if(module.hot) {
    module.hot.accept('./App.js', () => {
        const NextApp = require('./App').default;
        ReactDOM.render((
            <AppContainer>
                <Provider {...stores}>
                    <BrowserRouter>
                        <NextApp />
                    </BrowserRouter>
                </Provider>
            </AppContainer>
        ), document.getElementById('root'));
    });
}
