import React from 'react';

import './footer.css';
import icon from '../../assets/icon.svg';

class Footer extends React.Component {

    render() {
        let date = new Date();
        return (
            <footer className="l-footer">
                <div className="l-container">
                    <div className="footer-divider">
                        <div className="footer_icon_container">
                            <img src={icon} className="footer_icon"/>
                        </div>
                    </div>
                    <div className="footer-info">
                        <span className="footer-info_text">&copy; Connor Handy, {date.getFullYear()}</span>
                        <a href="http://connorhandy.com" rel="noopener noreferrer" target="_blank" className="footer-info_text footer-info_text--float-right">Contact</a>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Footer;