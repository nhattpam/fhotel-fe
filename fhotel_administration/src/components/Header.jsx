import React, { useEffect, useState } from 'react'
import userService from '../services/user.service';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {

  //get user information
  const userId = sessionStorage.getItem('userId');
  const [user, setUser] = useState({
    email: "",
    name: "",
    image: "",
    role: []
  });

  useEffect(() => {
    if (userId) {
      userService
        .getUserById(userId)
        .then((res) => {
          setUser(res.data);
          console.log(JSON.stringify(user))
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userId]);

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('authToken'); // Assuming you store authentication token in localStorage
    sessionStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <>
      {/* START HEADER*/}
      <header className="header" >
        <div className="page-brand">
          {user?.role?.roleName === "Admin" && (
            <Link className="link" to={`/admin-home`}>
              <span className="brand">F
                <span className="brand-tip">Hotel</span>
              </span>
              <span className="brand-mini">FHotel</span>
            </Link>
          )}

          {
            user.role?.roleName === "Hotel Manager" && (
              <>
                <Link className="link" to={`/hotel-manager-home`}>
                  <span className="brand">F
                    <span className="brand-tip">Hotel</span>
                  </span>
                  <span className="brand-mini">FHotel</span>
                </Link>
              </>
            )
          }
          {
            user.role?.roleName === "Manager" && (
              <>
                <Link className="link" to={`/manager-home`}>
                  <span className="brand">F
                    <span className="brand-tip">Hotel</span>
                  </span>
                  <span className="brand-mini">FHotel</span>
                </Link>
              </>
            )
          }
          {
            user.role?.roleName === "Receptionist" && (
              <>
                <Link className="link" to={`/receptionist-home`}>
                  <span className="brand">F
                    <span className="brand-tip">Hotel</span>
                  </span>
                  <span className="brand-mini">FHotel</span>
                </Link>
              </>
            )
          }
          {
            user.role?.roleName === "Room Attendant" && (
              <>
                <Link className="link" to={`/room-attendant-home`}>
                  <span className="brand">F
                    <span className="brand-tip">Hotel</span>
                  </span>
                  <span className="brand-mini">FHotel</span>
                </Link>
              </>
            )
          }

        </div>
        <div className="flexbox flex-1">
          {/* START TOP-LEFT TOOLBAR*/}
          <ul className="nav navbar-toolbar">
            <li>
              <a className="nav-link sidebar-toggler js-sidebar-toggler"><i className="ti-menu" /></a>
            </li>
            
          </ul>
          {/* END TOP-LEFT TOOLBAR*/}
          {/* START TOP-RIGHT TOOLBAR*/}
          <ul className="nav navbar-toolbar">
            <li className="dropdown dropdown-inbox">
              
              <ul className="dropdown-menu dropdown-menu-right dropdown-menu-media">
              </ul>
            </li>
            
            <li className="dropdown dropdown-user">
              <a className="nav-link dropdown-toggle link" data-toggle="dropdown">
                <img src={user.image} style={{ width: "30px", height: "30px" }} />
                <span />{user.name}<i className="fa fa-angle-down m-l-5" /></a>
              <ul className="dropdown-menu dropdown-menu-right">
                <a className="dropdown-item" href="profile.html"><i className="fa fa-user" />Thông Tin</a>
                {/* <a className="dropdown-item" href="profile.html"><i className="fa fa-cog" />Settings</a>
                <a className="dropdown-item" href="javascript:;"><i className="fa fa-support" />Support</a> */}
                <li className="dropdown-divider" />
                <a className="dropdown-item" onClick={handleLogout}><i className="fa fa-power-off" />Đăng Xuất</a>
              </ul>
            </li>
          </ul>
          {/* END TOP-RIGHT TOOLBAR*/}
        </div>
      </header>
      {/* END HEADER*/}

    </>
  )
}

export default Header