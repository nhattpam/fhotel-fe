import React, { useEffect, useState } from 'react'
import userService from '../services/user.service';
import { Link, useNavigate } from 'react-router-dom';
import walletService from '../services/wallet.service';

const Header = () => {

  //get user information
  const userId = sessionStorage.getItem('userId');
  const [user, setUser] = useState({
    email: "",
    name: "",
    image: "",
    role: []
  });
  const [wallet, setWallet] = useState({
    balance: "",
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
      userService
        .getWalletByUser(userId)
        .then((res) => {
          setWallet(res.data);
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

  //WALLET
  const [showModalWallet, setShowModalWallet] = useState(false);
  const [transactionList, setTransactionList] = useState([]);
  const [currentTransactionPage, setCurrentTransactionPage] = useState(0);
  const [transactionsPerPage] = useState(5);
  const [transactionSearchTerm, setTransactionSearchTerm] = useState('');
  const handleTransactionSearch = (event) => {
    setTransactionSearchTerm(event.target.value);
  };


  const filteredTransactions = transactionList
    .filter((transaction) => {
      return (
        transaction.description?.toString().toLowerCase().includes(transactionSearchTerm.toLowerCase())
      );
    });

  const pageTransactionCount = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const handleTransactionPageClick = (data) => {
    setCurrentTransactionPage(data.selected);
  };

  const offsetTransaction = currentTransactionPage * transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(offsetTransaction, offsetTransaction + transactionsPerPage);

  const openWalletModal = (walletId) => {
    setShowModalWallet(true);
    if (walletId) {
      walletService
        .getAllTransactionByWallet(walletId)
        .then((res) => {
          const sortedTransactionList = [...res.data].sort((a, b) => {
            // Assuming requestedDate is a string in ISO 8601 format
            return new Date(b.transactionDate) - new Date(a.transactionDate);
          });
          setTransactionList(sortedTransactionList);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const closeModalWallet = () => {
    setShowModalWallet(false);
    setTransactionList([])
  };

  const formatter = new Intl.NumberFormat('en-US'); 

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
                {
                  user.role?.roleName === "Admin" && (
                    <>
                      <a className="dropdown-item" ><i className="fa fa-user" />Thông Tin</a>
                    </>
                  )
                }
                {
                  user.role?.roleName === "Manager" && (
                    <>
                      <a className="dropdown-item" ><i className="fa fa-user" />Thông Tin</a>
                    </>
                  )
                }
                {
                  user.role?.roleName === "Hotel Manager" && (
                    <>
                      <a className="dropdown-item" ><i className="fa fa-user" />Thông Tin</a>
                    </>
                  )
                }
                {
                  user.role?.roleName === "Receptionist" && (
                    <>
                      <a className="dropdown-item" ><i className="fa fa-user" />Thông Tin</a>
                    </>
                  )
                }
                {
                  user.role?.roleName === "Room Attendant" && (
                    <>
                      <a className="dropdown-item" ><i className="fa fa-user" />Thông Tin</a>
                    </>
                  )
                }

                {
                  user.role?.roleName === "Admin" && (
                    <>
                      <a className="dropdown-item" onClick={() => openWalletModal(wallet.walletId)}>Số dư: {formatter.format(wallet.balance)}₫</a>

                    </>
                  )
                }
                {
                  user.role?.roleName === "Hotel Manager" && (
                    <>
                      <a className="dropdown-item" onClick={() => openWalletModal(wallet.walletId)}>Số dư: {formatter.format(wallet.balance)}₫</a>

                    </>
                  )
                }
                <li className="dropdown-divider" />
                <a className="dropdown-item" onClick={handleLogout}><i className="fa fa-power-off" />Đăng Xuất</a>
              </ul>
            </li>
          </ul>
          {/* END TOP-RIGHT TOOLBAR*/}
        </div>
      </header>
      {/* END HEADER*/}
      {showModalWallet && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content shadow-lg rounded">
              <div className="modal-header bg-dark text-light">
                <h5 className="modal-title">Lịch Sử Giao Dịch</h5>
                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalWallet}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto', textAlign: 'left' }}>
                <div className="table-responsive">
                  <table className="table table-borderless table-hover table-wrap table-centered">
                    <thead>
                      <tr>
                        <th><span>STT</span></th>
                        <th><span>Số tiền (₫)</span></th>
                        <th><span>Mô tả</span></th>
                        <th><span>Ngày giao dịch</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        currentTransactions.length > 0 && currentTransactions.map((item, index) => (
                          <>
                            <tr>
                              <td>{index + 1}</td>
                              <td>{item.amount}</td>
                              <td>{item.description}</td>
                              <td>{new Date(item.transactionDate).toLocaleString('en-US')}</td>

                            </tr>
                          </>
                        ))
                      }


                    </tbody>
                  </table>
                  {
                    currentTransactions.length === 0 && (
                      <>
                        <p className='text-center mt-2' style={{ fontStyle: 'italic', color: 'gray' }}>Không có</p>
                      </>
                    )
                  }
                </div>

              </div>

              <div className="modal-footer">
                {/* <button type="button" className="btn btn-custom">Save</button> */}
                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalWallet} >Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>
        {`
                    .page-item.active .page-link{
                    background-color: #20c997;
                    border-color: #20c997;
                }

                   .room-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.room-box {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}
  
                .custom-modal-xl {
    max-width: 100%;
    width: 100%;
}
    .btn-custom{
    background-color: #3498db;
    color: white
    }

     /* TABLES */
.table {
    border-collapse: separate;
}
.table-hover > tbody > tr:hover > td,
.table-hover > tbody > tr:hover > th {
	background-color: #eee;
}
.table thead > tr > th {
	border-bottom: 1px solid #C2C2C2;
	padding-bottom: 0;
}


.table tbody > tr > td {
	font-size: 0.875em;
	background: #f5f5f5;
	border-top: 10px solid #fff;
	vertical-align: middle;
	padding: 12px 8px;
}
.table tbody > tr > td:first-child,
.table thead > tr > th:first-child {
	padding-left: 20px;
}
.table thead > tr > th span {
	border-bottom: 2px solid #C2C2C2;
	display: inline-block;
	padding: 0 5px;
	padding-bottom: 5px;
	font-weight: normal;
}
.table thead > tr > th > a span {
	color: #344644;
}
.table thead > tr > th > a span:after {
	content: "\f0dc";
	font-family: FontAwesome;
	font-style: normal;
	font-weight: normal;
	text-decoration: inherit;
	margin-left: 5px;
	font-size: 0.75em;
}
.table thead > tr > th > a.asc span:after {
	content: "\f0dd";
}
.table thead > tr > th > a.desc span:after {
	content: "\f0de";
}
.table thead > tr > th > a:hover span {
	text-decoration: none;
	color: #2bb6a3;
	border-color: #2bb6a3;
}
.table.table-hover tbody > tr > td {
	-webkit-transition: background-color 0.15s ease-in-out 0s;
	transition: background-color 0.15s ease-in-out 0s;
}
.table tbody tr td .call-type {
	display: block;
	font-size: 0.75em;
	text-align: center;
}
.table tbody tr td .first-line {
	line-height: 1.5;
	font-weight: 400;
	font-size: 1.125em;
}
.table tbody tr td .first-line span {
	font-size: 0.875em;
	color: #969696;
	font-weight: 300;
}
.table tbody tr td .second-line {
	font-size: 0.875em;
	line-height: 1.2;
}
.table a.table-link {
	margin: 0 5px;
	font-size: 1.125em;
}
.table a.table-link:hover {
	text-decoration: none;
	color: #2aa493;
}
.table a.table-link.danger {
	color: #fe635f;
}
.table a.table-link.danger:hover {
	color: #dd504c;
}

.table-products tbody > tr > td {
	background: none;
	border: none;
	border-bottom: 1px solid #ebebeb;
	-webkit-transition: background-color 0.15s ease-in-out 0s;
	transition: background-color 0.15s ease-in-out 0s;
	position: relative;
}
.table-products tbody > tr:hover > td {
	text-decoration: none;
	background-color: #f6f6f6;
}
.table-products .name {
	display: block;
	font-weight: 600;
	padding-bottom: 7px;
}
.table-products .price {
	display: block;
	text-decoration: none;
	width: 50%;
	float: left;
	font-size: 0.875em;
}
.table-products .price > i {
	color: #8dc859;
}
.table-products .warranty {
	display: block;
	text-decoration: none;
	width: 50%;
	float: left;
	font-size: 0.875em;
}
.table-products .warranty > i {
	color: #f1c40f;
}
.table tbody > tr.table-line-fb > td {
	background-color: #9daccb;
	color: #262525;
}
.table tbody > tr.table-line-twitter > td {
	background-color: #9fccff;
	color: #262525;
}
.table tbody > tr.table-line-plus > td {
	background-color: #eea59c;
	color: #262525;
}
.table-stats .status-social-icon {
	font-size: 1.9em;
	vertical-align: bottom;
}
.table-stats .table-line-fb .status-social-icon {
	color: #556484;
}
.table-stats .table-line-twitter .status-social-icon {
	color: #5885b8;
}
.table-stats .table-line-plus .status-social-icon {
	color: #a75d54;
}
.table tbody > tr > th,
.table thead > tr > th {
    font-weight: bold; /* Removes bold styling */
}
.table tbody > tr > th,
.table thead > tr > th {
    border-bottom: 1px solid #C2C2C2;
    padding-bottom: 0;
}
.table tbody > tr > th,
.table tbody > tr > td {
    padding: 12px 8px; /* Ensure consistent padding */
    vertical-align: middle; /* Align content vertically */
}
.table tbody > tr > th,
.table tbody > tr > td {
    margin: 0;
    border: none; /* Or adjust based on your table's styling */
}

.loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    backdrop-filter: blur(10px); /* Apply blur effect */
                    -webkit-backdrop-filter: blur(10px); /* For Safari */
                    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999; /* Ensure it's on top of other content */
                }
                
                .loading-spinner {
                    border: 8px solid rgba(245, 141, 4, 0.1); /* Transparent border to create the circle */
                    border-top: 8px solid #3498db; /* Blue color */
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite; /* Rotate animation */
                }
                
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                   .search-bar {
    position: relative;
    display: inline-block;
}

.search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
}

.search-bar input {
    padding-left: 30px; /* Adjust padding to make room for the icon */
    width: 150px
}


                                            `}
      </style>
    </>
  )
}

export default Header