import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import MarketTickers from './components/MarketTickers.js';
import SearchBar from './components/SearchBar.js';

import icon from '../../assets/icon-alt.svg';

import './navbar.css';

@inject('navbarStore')
@observer
class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.store = this.props.navbarStore;
    }

    render() {
        let date = new Date,
            dayArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return (
            <nav className="l-navbar">
                {!this.store.marketTickerBar.error ? <MarketTickers/> : <section></section>}
                <div className="navbar-middle">
                    <div className="l-container">
                        <Link to="/" className="navbar-logo">
                            <img src={icon} className="navbar-logo_image" alt="Crypto Trader Icon"/>
                            <div className="navbar-logo_text-container">
                                <div className="navbar-logo_text">{dayArr[date.getDay()]}</div>
                                <div className="navbar-logo_text">{monthArr[date.getMonth()]}, {date.getDate()}</div>
                            </div>
                        </Link>
                        <SearchBar/>
                    </div>
                </div>
                <div className="navbar-bottom">
                    <div className="l-container">
                        <NavLink exact to="/" className="navbar-bottom_link" activeClassName="is-active">Currencies</NavLink>
                        <NavLink to="/portfolio" className="navbar-bottom_link" activeClassName="is-active">Portfolio</NavLink>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Navbar;