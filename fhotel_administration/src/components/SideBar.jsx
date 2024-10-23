import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import userService from '../services/user.service';
import typeService from '../services/type.service';

const SideBar = () => {

    //get user information
    const userId = sessionStorage.getItem('userId');
    const [user, setUser] = useState({
        email: "",
        firstName: "",
        image: ""
    });

    useEffect(() => {
        if (userId) {
            userService
                .getUserById(userId)
                .then((res) => {
                    setUser(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [userId]);


    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Track the state of the User submenu

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen); // Toggle the state between true/false
    };

    const [isPolicyMenuOpen, setIsUPolicyMenuOpen] = useState(false); // Track the state of the User submenu

    const togglePolicyMenu = () => {
        setIsUPolicyMenuOpen(!isPolicyMenuOpen); // Toggle the state between true/false
    };

    const [isPricingMenuOpen, setIsPricingMenuOpen] = useState(false); // Track the state of the User submenu

    const togglePricingMenu = () => {
        setIsPricingMenuOpen(!isPricingMenuOpen); // Toggle the state between true/false
    };

    const [typeList, setTypeList] = useState([]);

    useEffect(() => {
        typeService
            .getAllType()
            .then((res) => {
                setTypeList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    return (
        <>
            {/* START SIDEBAR*/}
            <nav className="page-sidebar" id="sidebar" style={{ textAlign: 'left', display: 'block' }}>
                <div id="sidebar-collapse">
                    <div className="admin-block d-flex">
                        <div>
                            <img src={user.image} width="45px" height="45px" />
                        </div>
                        <div className="admin-info">
                            <div className="font-strong">{user.firstName}</div><small>{user.role?.roleName}</small></div>
                    </div>
                    <ul className="side-menu metismenu">
                        {
                            user.role?.roleName === "Admin" && (
                                <li>
                                    <Link className="active" to={`/admin-home`}><i className="sidebar-item-icon fa fa-th-large" />
                                        <span className="nav-label">Dashboard</span>
                                    </Link>
                                </li>
                            )
                        }
                        {
                            user.role?.roleName === "Manager" && (
                                <li>
                                    <Link className="active" to={`/manager-home`}><i className="sidebar-item-icon fa fa-th-large" />
                                        <span className="nav-label">Dashboard</span>
                                    </Link>
                                </li>
                            )
                        }
                        {
                            user.role?.roleName === "Hotel Manager" && (
                                <li>
                                    <Link className="active" to={`/hotel-manager-home`}><i className="sidebar-item-icon fa fa-th-large" />
                                        <span className="nav-label">Dashboard</span>
                                    </Link>
                                </li>
                            )
                        }
                        {
                            user.role?.roleName === "Receptionist" && (
                                <li>
                                    <Link className="active" to={`/receptionist-home`}><i className="sidebar-item-icon fa fa-th-large" />
                                        <span className="nav-label">Dashboard</span>
                                    </Link>
                                </li>
                            )
                        }
                        {
                            user.role?.roleName === "Room Attendant" && (
                                <li>
                                    <Link className="active" to={`/room-attendant-home`}><i className="sidebar-item-icon fa fa-th-large" />
                                        <span className="nav-label">Dashboard</span>
                                    </Link>
                                </li>
                            )
                        }

                        <li className="heading">FEATURES</li>
                        {
                            user.role?.roleName === "Admin" && (
                                <>

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
                                            <li>
                                                <Link to="/list-manager">Manager</Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <Link to="/list-hotel"><i className="sidebar-item-icon fa fa-building" />
                                            <span className="nav-label">Hotel</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/list-reservation"><i className="sidebar-item-icon fa fa-ship" />
                                            <span className="nav-label">Reservation</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="javascript:;" onClick={togglePolicyMenu}>
                                            <i className="sidebar-item-icon fa fa-balance-scale" />
                                            <span className="nav-label">Policy</span>
                                            <i className={`fa fa-angle-left arrow ${isPolicyMenuOpen ? '' : 'collapsed'}`} />
                                        </a>
                                        {/* Conditionally apply collapse class based on the state */}
                                        <ul className={`nav-2-level collapse ${isPolicyMenuOpen ? 'show' : ''}`}>
                                            <li>
                                                <Link to="/list-refund-policy">Refund Policy</Link>
                                            </li>
                                            <li>
                                                <Link to="/list-late-check-out-policy">Late Checkout Policy</Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a href="javascript:;" onClick={togglePricingMenu}>
                                            <i className="sidebar-item-icon fa fa-usd" />
                                            <span className="nav-label">Pricing</span>
                                            <i className={`fa fa-angle-left arrow ${isPricingMenuOpen ? '' : 'collapsed'}`} />
                                        </a>
                                        {/* Conditionally apply collapse class based on the state */}
                                        <ul className={`nav-2-level collapse ${isPricingMenuOpen ? 'show' : ''}`}>
                                            {
                                                typeList.length > 0 && typeList.map((item, index) => (
                                                    <li>
                                                        <a href={`/list-type-pricing/${item.typeId}`}>{item.typeName}</a>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </li>

                                </>
                            )
                        }
                        {
                            user.role?.roleName === "Hotel Manager" && (
                                <>

                                    <li>
                                        <a href="javascript:;" onClick={toggleUserMenu}>
                                            <i className="sidebar-item-icon fa fa-user" />
                                            <span className="nav-label">User</span>
                                            <i className={`fa fa-angle-left arrow ${isUserMenuOpen ? '' : 'collapsed'}`} />
                                        </a>
                                        {/* Conditionally apply collapse class based on the state */}
                                        <ul className={`nav-2-level collapse ${isUserMenuOpen ? 'show' : ''}`}>
                                            <li>
                                                <Link to="/list-receptionist">Receptionist</Link>
                                            </li>
                                            <li>
                                                <Link to="/list-room-attendant">Room Attendant</Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <Link to="/list-reservation"><i className="sidebar-item-icon fa fa-ship" />
                                            <span className="nav-label">Reservation</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/list-owner-hotel"><i className="sidebar-item-icon fa fa-building" />
                                            <span className="nav-label">Hotel</span>
                                        </Link>
                                    </li>

                                    {/* Billing Section */}
                                    <li>
                                        <Link to="/billing"><i className="sidebar-item-icon fa fa-money" />
                                            <span className="nav-label">Billing</span>
                                        </Link>
                                    </li>

                                </>
                            )
                        }
                        {
                            user.role?.roleName === "Manager" && (
                                <>
                                    <li>
                                        <Link to="/list-reservation"><i className="sidebar-item-icon fa fa-ship" />
                                            <span className="nav-label">Reservation</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/list-service"><i className="sidebar-item-icon fa fa-coffee" />
                                            <span className="nav-label">Service</span>
                                        </Link>
                                    </li>
                                    {/* Billing Section */}
                                    <li>
                                        <Link to="/billing"><i className="sidebar-item-icon fa fa-money" />
                                            <span className="nav-label">Billing</span>
                                        </Link>
                                    </li>

                                </>
                            )
                        }
                        {
                            user.role?.roleName === "Receptionist" && (
                                <>
                                    {/* Reservation Section */}
                                    <li>
                                        <Link to="/list-reservation"><i className="sidebar-item-icon fa fa-ship" />
                                            <span className="nav-label">Reservation</span>
                                        </Link>
                                    </li>

                                    {/* Check-In / Check-Out Section */}
                                    <li>
                                        <Link to="/check-in-out"><i className="sidebar-item-icon fa fa-sign-in" />
                                            <span className="nav-label">Check-In / Check-Out</span>
                                        </Link>
                                    </li>

                                    {/* Room Management Section */}
                                    <li>
                                        <Link to="/room-management"><i className="sidebar-item-icon fa fa-bed" />
                                            <span className="nav-label">Room Management</span>
                                        </Link>
                                    </li>

                                    {/* Customer Management Section */}
                                    <li>
                                        <Link to="/customer-management"><i className="sidebar-item-icon fa fa-user" />
                                            <span className="nav-label">Customer Management</span>
                                        </Link>
                                    </li>

                                    {/* Billing / Payment Management Section */}
                                    <li>
                                        <Link to="/billing"><i className="sidebar-item-icon fa fa-credit-card" />
                                            <span className="nav-label">Billing / Payments</span>
                                        </Link>
                                    </li>

                                    {/* Facilities Management Section */}
                                    <li>
                                        <Link to="/facilities-management"><i className="sidebar-item-icon fa fa-wrench" />
                                            <span className="nav-label">Facilities Management</span>
                                        </Link>
                                    </li>

                                    {/* Reports / Analytics Section */}
                                    <li>
                                        <Link to="/reports"><i className="sidebar-item-icon fa fa-bar-chart" />
                                            <span className="nav-label">Reports / Analytics</span>
                                        </Link>
                                    </li>


                                </>
                            )
                        }
                        {
                            user.role?.roleName === "Room Attendant" && (
                                <>
                                    <li>
                                        <Link to="/room-status"><i className="sidebar-item-icon fa fa-bed" />
                                            <span className="nav-label">Room Status</span>
                                        </Link>
                                    </li>

                                </>
                            )
                        }

                    </ul>
                </div>
            </nav>
            {/* END SIDEBAR*/}

        </>
    )
}

export default SideBar