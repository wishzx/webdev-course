import React from 'react';
import './Header.css';
import logo from "../../images/rip.jpg";


class Header extends React.Component {
    constructor(props) {
        super(props); // Must run the constructor of React.Component first
    }


    render() {
        return (
            <div className="container header">

                <a className="logo">Learning react</a>
                <img src={logo} alt="" />
                <div className="header-right">
                    <p className="cs142-header-p">programming with style</p>
                </div>
            </div>

        )
    }


}

export default Header;
