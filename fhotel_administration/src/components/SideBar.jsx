import React from 'react'

const SideBar = () => {
    return (
        <>
            {/* START SIDEBAR*/}
            <nav className="page-sidebar" id="sidebar" style={{ textAlign: 'left', display: 'block' }}>
                <div id="sidebar-collapse">
                    <div className="admin-block d-flex">
                        <div>
                            <img src="./assets/img/admin-avatar.png" width="45px" />
                        </div>
                        <div className="admin-info">
                            <div className="font-strong">James Brown</div><small>Administrator</small></div>
                    </div>
                    <ul className="side-menu metismenu">
                        <li>
                            <a className="active" href="index.html"><i className="sidebar-item-icon fa fa-th-large" />
                                <span className="nav-label">Dashboard</span>
                            </a>
                        </li>
                        <li className="heading">FEATURES</li>
                        <li>
                            <a href="javascript:;"><i className="sidebar-item-icon fa fa-bookmark" />
                                <span className="nav-label">Basic UI</span><i className="fa fa-angle-left arrow" /></a>
                            <ul className="nav-2-level collapse">
                                <li>
                                    <a href="colors.html">Colors</a>
                                </li>
                                <li>
                                    <a href="typography.html">Typography</a>
                                </li>
                                <li>
                                    <a href="panels.html">Panels</a>
                                </li>
                                <li>
                                    <a href="buttons.html">Buttons</a>
                                </li>
                                <li>
                                    <a href="tabs.html">Tabs</a>
                                </li>
                                <li>
                                    <a href="alerts_tooltips.html">Alerts &amp; Tooltips</a>
                                </li>
                                <li>
                                    <a href="badges_progress.html">Badges &amp; Progress</a>
                                </li>
                                <li>
                                    <a href="lists.html">List</a>
                                </li>
                                <li>
                                    <a href="cards.html">Card</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="javascript:;"><i className="sidebar-item-icon fa fa-edit" />
                                <span className="nav-label">Forms</span><i className="fa fa-angle-left arrow" /></a>
                            <ul className="nav-2-level collapse">
                                <li>
                                    <a href="form_basic.html">Basic Forms</a>
                                </li>
                                <li>
                                    <a href="form_advanced.html">Advanced Plugins</a>
                                </li>
                                <li>
                                    <a href="form_masks.html">Form input masks</a>
                                </li>
                                <li>
                                    <a href="form_validation.html">Form Validation</a>
                                </li>
                                <li>
                                    <a href="text_editors.html">Text Editors</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="javascript:;"><i className="sidebar-item-icon fa fa-table" />
                                <span className="nav-label">Tables</span><i className="fa fa-angle-left arrow" /></a>
                            <ul className="nav-2-level collapse">
                                <li>
                                    <a href="table_basic.html">Basic Tables</a>
                                </li>
                                <li>
                                    <a href="datatables.html">Datatables</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="javascript:;"><i className="sidebar-item-icon fa fa-bar-chart" />
                                <span className="nav-label">Charts</span><i className="fa fa-angle-left arrow" /></a>
                            <ul className="nav-2-level collapse">
                                <li>
                                    <a href="charts_flot.html">Flot Charts</a>
                                </li>
                                <li>
                                    <a href="charts_morris.html">Morris Charts</a>
                                </li>
                                <li>
                                    <a href="chartjs.html">Chart.js</a>
                                </li>
                                <li>
                                    <a href="charts_sparkline.html">Sparkline Charts</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="javascript:;"><i className="sidebar-item-icon fa fa-map" />
                                <span className="nav-label">Maps</span><i className="fa fa-angle-left arrow" /></a>
                            <ul className="nav-2-level collapse">
                                <li>
                                    <a href="maps_vector.html">Vector maps</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="icons.html"><i className="sidebar-item-icon fa fa-smile-o" />
                                <span className="nav-label">Icons</span>
                            </a>
                        </li>
                        <li className="heading">PAGES</li>
                        <li>
                            <a href="javascript:;"><i className="sidebar-item-icon fa fa-envelope" />
                                <span className="nav-label">Mailbox</span><i className="fa fa-angle-left arrow" /></a>
                            <ul className="nav-2-level collapse">
                                <li>
                                    <a href="mailbox.html">Inbox</a>
                                </li>
                                <li>
                                    <a href="mail_view.html">Mail view</a>
                                </li>
                                <li>
                                    <a href="mail_compose.html">Compose mail</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="calendar.html"><i className="sidebar-item-icon fa fa-calendar" />
                                <span className="nav-label">Calendar</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:;"><i className="sidebar-item-icon fa fa-file-text" />
                                <span className="nav-label">Pages</span><i className="fa fa-angle-left arrow" /></a>
                            <ul className="nav-2-level collapse">
                                <li>
                                    <a href="invoice.html">Invoice</a>
                                </li>
                                <li>
                                    <a href="profile.html">Profile</a>
                                </li>
                                <li>
                                    <a href="login.html">Login</a>
                                </li>
                                <li>
                                    <a href="register.html">Register</a>
                                </li>
                                <li>
                                    <a href="lockscreen.html">Lockscreen</a>
                                </li>
                                <li>
                                    <a href="forgot_password.html">Forgot password</a>
                                </li>
                                <li>
                                    <a href="error_404.html">404 error</a>
                                </li>
                                <li>
                                    <a href="error_500.html">500 error</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="javascript:;"><i className="sidebar-item-icon fa fa-sitemap" />
                                <span className="nav-label">Menu Levels</span><i className="fa fa-angle-left arrow" /></a>
                            <ul className="nav-2-level collapse">
                                <li>
                                    <a href="javascript:;">Level 2</a>
                                </li>
                                <li>
                                    <a href="javascript:;">
                                        <span className="nav-label">Level 2</span><i className="fa fa-angle-left arrow" /></a>
                                    <ul className="nav-3-level collapse">
                                        <li>
                                            <a href="javascript:;">Level 3</a>
                                        </li>
                                        <li>
                                            <a href="javascript:;">Level 3</a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
            {/* END SIDEBAR*/}

        </>
    )
}

export default SideBar