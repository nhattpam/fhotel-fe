import React, { useState } from 'react';
import { Link } from 'react-router-dom'

const SideBar = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Track the state of the User submenu

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen); // Toggle the state between true/false
    };

    return (
        <>
            {/* START SIDEBAR*/}
            <nav className="page-sidebar" id="sidebar" style={{ textAlign: 'left', display: 'block' }}>
                <div id="sidebar-collapse">
                    <div className="admin-block d-flex">
                        <div>
                            <img src="https://i.pinimg.com/736x/f1/df/7a/f1df7ae4db2763c822af58bf66b69e9d.jpg" width="45px" />
                        </div>
                        <div className="admin-info">
                            <div className="font-strong">James Brown</div><small>Administrator</small></div>
                    </div>
                    <ul className="side-menu metismenu">
                        <li>
                            <Link className="active" to={`/home`}><i className="sidebar-item-icon fa fa-th-large" />
                                <span className="nav-label">Dashboard</span>
                            </Link>
                        </li>
                        <li className="heading">FEATURES</li>
                        <li>
                            <a href="javascript:;" onClick={toggleUserMenu}>
                                <i className="sidebar-item-icon fa fa-user" />
                                <span className="nav-label">User</span>
                                <i className={`fa fa-angle-left arrow ${isUserMenuOpen ? '' : 'collapsed'}`} />
                            </a>
                            {/* Conditionally apply collapse class based on the state */}
                            <ul className={`nav-2-level collapse ${isUserMenuOpen ? 'show' : ''}`}>
                                <li>
                                    <Link to="/list-hotel-manager">Hotel Manager</Link>
                                </li>
                                <li>
                                    <Link to="/list-customer">Customer</Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link to="/list-hotel"><i className="sidebar-item-icon fa fa-building" />
                                <span className="nav-label">Hotel</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
            {/* END SIDEBAR*/}

        </>
    )
}

export default SideBar