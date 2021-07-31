import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';//using context with functional component
import './MainNavigation.css';


/*
const mainNavigation = props => {
    return (
        <h1>the navbar</h1>
    );
};
*/

const mainNavigation = props => (
    <AuthContext.Consumer>
        {(context) => {
            return (
                <header className="main-navigation">
                    <div className="main-navigation__logo">
                        <h1>EasyEvent</h1>
                    </div>
                    <nav className="main-navigation__items">
                        <ul>
                            {!context.token &&
                                <li>
                                    <NavLink to="/auth">
                                        Authenticate (check if token exists)
                                    </NavLink>
                                </li>
                            }
                            <li>
                                <NavLink to="/events">
                                    Events
                                </NavLink>
                            </li>
                            {context.token && 
                                <li>
                                    <NavLink to="/bookings">
                                        Bookings
                                    </NavLink>
                                </li>
                            }
                        </ul>
                    </nav>
                </header>
            );
        }}


    </AuthContext.Consumer>
);

export default mainNavigation;