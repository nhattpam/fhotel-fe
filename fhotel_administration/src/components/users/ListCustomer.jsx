import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import userService from '../../services/user.service';
import reservationService from '../../services/reservation.service';
import billService from '../../services/bill.service';

const ListCustomer = () => {
    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING
    //call list hotel registration
    const [userList, setUserList] = useState([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [currentUserPage, setCurrentUserPage] = useState(0);
    const [usersPerPage] = useState(10);

    const loginUserId = sessionStorage.getItem('userId');
    const [loginUser, setLoginUser] = useState({
        email: "",
        name: "",
        image: ""
    });

    useEffect(() => {
        if (loginUserId) {
            userService
                .getUserById(loginUserId)
                .then((res) => {
                    setLoginUser(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [loginUserId]);

    useEffect(() => {
        userService
            .getAllUser()
            .then((res) => {
                const hotelManagers = res.data.filter(user => user.role?.roleName === "Customer");

                const sortedUserList = [...hotelManagers].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setUserList(sortedUserList);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);


    const handleUserSearch = (event) => {
        setUserSearchTerm(event.target.value);
    };

    const filteredUsers = userList
        .filter((user) => {
            return (
                user.code.toString().toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                user.name.toString().toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                user.createdDate.toString().toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                user.email.toString().toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                user.address.toString().toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                user.phoneNumber.toString().toLowerCase().includes(userSearchTerm.toLowerCase())
            );
        });

    const pageUserCount = Math.ceil(filteredUsers.length / usersPerPage);

    const handleUserPageClick = (data) => {
        setCurrentUserPage(data.selected);
    };

    const offsetUser = currentUserPage * usersPerPage;
    const currentUsers = filteredUsers.slice(offsetUser, offsetUser + usersPerPage);



    //detail user modal 
    const [showModalUser, setShowModalUser] = useState(false);

    const [user, setUser] = useState({

    });

    const [reservationList, setReservationList] = useState([]);
    const [currentReservationPage, setCurrentReservationPage] = useState(0);
    const [reservationsPerPage] = useState(5);
    const [reservationSearchTerm, setReservationSearchTerm] = useState('');
    const handleReservationSearch = (event) => {
        setReservationSearchTerm(event.target.value);
    };


    const filteredReservations = reservationList
        .filter((reservation) => {
            return (
                reservation.user?.name.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.roomType?.type?.typeName.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.createdDate.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.numberOfRooms?.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase())
            );
        });

    const pageReservationCount = Math.ceil(filteredReservations.length / reservationsPerPage);

    const handleReservationPageClick = (data) => {
        setCurrentReservationPage(data.selected);
    };

    const offsetReservation = currentReservationPage * reservationsPerPage;
    const currentReservations = filteredReservations.slice(offsetReservation, offsetReservation + reservationsPerPage);

    const openUserModal = (userId) => {
        setShowModalUser(true);
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
                .getAllReservationByCustomer(userId)
                .then((res) => {
                    const sortedReservationList = [...res.data].sort((a, b) => {
                        // Assuming requestedDate is a string in ISO 8601 format
                        return new Date(b.createdDate) - new Date(a.createdDate);
                    });
                    setReservationList(sortedReservationList);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const closeModalUser = () => {
        setShowModalUser(false);
        setReservationList([])
    };

    // Update user status dynamically
    const updateUser = async (e, userId, isActive) => {
        e.preventDefault();

        try {
            // Fetch the user data
            const res = await userService.getUserById(userId);
            const userData = res.data;

            // Update the local state with the fetched data and new isActive flag
            setUser({ ...userData, isActive });

            // Make the update request
            const updateRes = await userService.updateUser(userId, { ...userData, isActive });

            if (updateRes.status === 200) {
                // window.alert("Update successful!");
                // Refresh the list after update
                const updatedUsers = await userService.getAllUser();
                const customers = updatedUsers.data.filter(user => user.role?.roleName === "Customer");

                const sortedUserList = [...customers].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setUserList(sortedUserList);
            } else {
                window.alert("Cập Nhật Lỗi!");
            }
        } catch (error) {
            console.log(error);
            window.alert("An error occurred during the update.");
        }
    };

    //detail reservation modal 
    const [showModalReservation, setShowModalReservation] = useState(false);
    const [roomStayHistoryList, setRoomStayHistoryList] = useState([]);
    const [orderDetailList, setOrderDetailList] = useState([]);
    const [billByReservation, setBillByReservation] = useState(null);
    const [reservation, setReservation] = useState({

    });


    const openReservationModal = (reservationId) => {
        setShowModalReservation(true);
        setShowModalUser(false);
        if (reservationId) {
            reservationService
                .getReservationById(reservationId)
                .then((res) => {
                    setReservation(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
            reservationService
                .getAllRoomStayHistoryByReservationId(reservationId)
                .then((res) => {
                    setRoomStayHistoryList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
            reservationService
                .getAllOrderDetailByReservationId(reservationId)
                .then((res) => {
                    setOrderDetailList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
            reservationService
                .getBillByReservation(reservationId)
                .then((res) => {
                    setBillByReservation(res.data);
                    console.log(res.data)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const closeModalReservation = () => {
        setShowModalReservation(false);
        setShowModalUser(true);
    };

    const [userDocumentList, setUserDocumentList] = useState([]);

    const [showModalUserDocument, setShowModalUserDocument] = useState(false);
    const closeModalUserDocument = () => {
        setShowModalUserDocument(false);
        setUserDocumentList([]);
    };


    const openUserDocumentModal = (reservationId) => {
        setShowModalUserDocument(true);
        reservationService
            .getAllUserDocumentByReservation(reservationId)
            .then((res) => {
                setUserDocumentList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });

    };
    const [billTransactionImageList, setBillTransactionImageList] = useState([]);
    const [selectedBillId, setSelectedBillId] = useState(null);

    const [showModalCreateBillTransactionImage, setShowModalCreateBillTransactionImage] = useState(false);
    const closeModalCreateBillTransactionImage = () => {
        setShowModalCreateBillTransactionImage(false);
    };


    const openCreateBillTransactionImageModal = (billId) => {
        setShowModalCreateBillTransactionImage(true);
        setSelectedBillId(billId);
        billService
            .getAllBillTransactionImageByBillId(billId)
            .then((res) => {
                setBillTransactionImageList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });

    };

    const formatter = new Intl.NumberFormat('en-US'); 

    return (
        <>
            <Header />
            <SideBar />
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner" />
                </div>
            )}
            <div className="content-wrapper" style={{ textAlign: 'left', display: 'block' }}>
                {/* START PAGE CONTENT*/}
                <div className="page-heading">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="index.html"><i className="la la-home font-20" /></a>
                        </li>
                        {/* <li className="breadcrumb-item">Basic Tables</li> */}
                    </ol>
                </div>
                <div className="page-content fade-in-up">
                    {/* start ibox */}
                    <div className="ibox">
                        <div className="ibox-head bg-dark text-light">
                            <div className="ibox-title">Danh Sách Khách Hàng</div>
                            <div className="form-group">
                                <div className="search-bar ml-3">
                                    <i className="fa fa-search search-icon" aria-hidden="true"></i>
                                    <input id="demo-foo-search" type="text" placeholder="Tìm kiếm" className="form-control form-control-sm"
                                        autoComplete="on" value={userSearchTerm}
                                        onChange={handleUserSearch} />
                                </div>

                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table table-borderless table-hover table-wrap table-centered">
                                    <thead>
                                        <tr>
                                            <th><span>STT</span></th>
                                            <th><span>Mã số</span></th>
                                            <th><span>Họ và tên</span></th>
                                            <th><span>Email</span></th>
                                            <th><span>Số điện thoại</span></th>
                                            <th><span>Chức vụ</span></th>
                                            <th><span>Trạng thái</span></th>
                                            <th><span>Hành động</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentUsers.length > 0 && currentUsers.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.code}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.email}</td>
                                                        <td>{item.phoneNumber}</td>
                                                        <td>
                                                            {
                                                                item.role?.roleName === "Customer" && (
                                                                    "Khách hàng"
                                                                )
                                                            }
                                                        </td>
                                                        <td>
                                                            {item.isActive ? (
                                                                <span className="badge label-table badge-success">Đang hoạt động</span>
                                                            ) : (
                                                                <span className="badge label-table badge-danger">Chưa kích hoạt</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit"><i className="fa fa-pencil font-14 text-primary" onClick={() => openUserModal(item.userId)} /></button>
                                                            {
                                                                loginUser.role?.roleName === "Admin" && (
                                                                    <>
                                                                        <form
                                                                            id="demo-form"
                                                                            onSubmit={(e) => updateUser(e, item.userId, user.isActive)} // Use isActive from the local state
                                                                            className="d-inline"
                                                                        >
                                                                            <button
                                                                                type="submit"
                                                                                className="btn btn-default btn-xs m-r-5"
                                                                                data-toggle="tooltip"
                                                                                data-original-title="Activate"
                                                                                onClick={() => setUser({ ...user, isActive: true })} // Activate
                                                                            >
                                                                                <i className="fa fa-check font-14 text-success" />
                                                                            </button>
                                                                            <button
                                                                                type="submit"
                                                                                className="btn btn-default btn-xs"
                                                                                data-toggle="tooltip"
                                                                                data-original-title="Deactivate"
                                                                                onClick={() => setUser({ ...user, isActive: false })} // Deactivate
                                                                            >
                                                                                <i className="fa fa-times font-14 text-danger" />
                                                                            </button>
                                                                        </form>
                                                                    </>
                                                                )
                                                            }

                                                        </td>
                                                    </tr>
                                                </>
                                            ))
                                        }


                                    </tbody>
                                </table>

                            </div>

                        </div>

                    </div>
                    {/* end ibox */}
                    {/* Pagination */}
                    <div className='container-fluid'>
                        {/* Pagination */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <ReactPaginate
                                previousLabel={
                                    <IconContext.Provider value={{ color: "#000", size: "14px" }}>
                                        <AiFillCaretLeft />
                                    </IconContext.Provider>
                                }
                                nextLabel={
                                    <IconContext.Provider value={{ color: "#000", size: "14px" }}>
                                        <AiFillCaretRight />
                                    </IconContext.Provider>
                                } breakLabel={'...'}
                                breakClassName={'page-item'}
                                breakLinkClassName={'page-link'}
                                pageCount={pageUserCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handleUserPageClick}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                                previousClassName={'page-item'}
                                nextClassName={'page-item'}
                                pageClassName={'page-item'}
                                previousLinkClassName={'page-link'}
                                nextLinkClassName={'page-link'}
                                pageLinkClassName={'page-link'}
                            />
                        </div>

                    </div>
                </div>
            </div>

            {showModalUser && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header  bg-dark text-light">
                                <h5 className="modal-title">Thông Tin Tài Khoản</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalUser}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                <div className="row">
                                    <div className="col-md-4 d-flex align-items-center flex-column">
                                        <img src={user.image} alt="avatar" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} className="mt-3" />
                                    </div>
                                    <div className="col-md-8">
                                        <table className="table table-borderless table-hover table-centered mt-3" style={{ width: '100%' }}>
                                            <tbody>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Họ và tên:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{user.name}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Email:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{user.email}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Số điện thoại:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{user && user.phoneNumber ? user.phoneNumber : 'Không tìm thấy Số Điện Thoại'}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Địa chỉ:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{user && user.address ? user.address : 'Không tìm thấy Địa Chỉ'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='col-md-12' style={{ textAlign: 'left' }}>
                                        <h4 style={{ fontWeight: 'bold' }}>Đặt Phòng Gần Đây</h4>
                                        <div className="table-responsive">
                                            <table className="table table-borderless table-hover table-wrap table-centered">
                                                <thead>
                                                    <tr>
                                                        <th><span>STT</span></th>
                                                        <th><span>Khách hàng</span></th>
                                                        <th><span>Khách sạn</span></th>
                                                        <th><span>Loại phòng</span></th>
                                                        <th><span>Số lượng</span></th>
                                                        <th><span>Ngày đặt</span></th>
                                                        <th><span>Trạng thái</span></th>
                                                        <th><span>Hành động</span></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentReservations.length > 0 && currentReservations.map((item, index) => (
                                                            <>
                                                                <tr>
                                                                    <td>{index + 1}</td>
                                                                    <td>{item.customer?.name}</td>
                                                                    <td>{item.roomType?.hotel?.hotelName}</td>
                                                                    <td>{item.roomType?.type?.typeName}</td>
                                                                    <td>{item.numberOfRooms}</td>
                                                                    <td> {new Date(item.createdDate).toLocaleString('en-US')}</td>
                                                                    <td>
                                                                        {item.reservationStatus === "Pending" && (
                                                                            <span className="badge label-table badge-warning">Đang chờ</span>
                                                                        )}
                                                                        {item.reservationStatus === "CheckIn" && (
                                                                            <span className="badge label-table badge-success">Đã nhận phòng</span>
                                                                        )}
                                                                        {item.reservationStatus === "CheckOut" && (
                                                                            <span className="badge label-table badge-danger">Đã trả phòng</span>
                                                                        )}
                                                                        {item.reservationStatus === "Cancelled" && (
                                                                            <span className="badge label-table badge-danger">Đã hủy</span>
                                                                        )}
                                                                         {item.reservationStatus === "Refunded" && (
                                                                            <span className="badge label-table badge-danger">Đã hoàn tiền</span>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <button className="btn btn-default btn-xs m-r-5"
                                                                            data-toggle="tooltip" data-original-title="Edit">
                                                                            <i className="fa fa-pencil font-14 text-primary"
                                                                                onClick={() => openReservationModal(item.reservationId)} /></button>
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        ))
                                                    }


                                                </tbody>
                                            </table>

                                        </div>
                                        {
                                            currentReservations.length === 0 && (
                                                <p className='text-center' style={{ color: 'gray' }}>Không tìm thấy</p>
                                            )
                                        }
                                    </div>
                                </div>


                            </div>
                            <div className="modal-footer">
                                {/* <button type="button" className="btn btn-custom">Save</button> */}
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalUser} >Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModalReservation && (
                <div
                    className="modal fade show"
                    tabIndex="-1"
                    role="dialog"
                    style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}
                >
                    <div className="modal-dialog modal-dialog-centered custom-modal-xl" role="document">
                        <div className="modal-content shadow-lg rounded">
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Chi Tiết Đặt Phòng</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalReservation}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto', textAlign: 'left' }}>
                                {/* Section: Customer Information */}
                                <div className="container-fluid">
                                    {/* Reservation Information */}
                                    <div className='row'>
                                        <div className="col-md-4" style={{ textAlign: 'left' }}>
                                            <h5>Thông Tin Khách Hàng</h5>
                                            <p className="mb-1" ><strong className='mr-2'>Họ và tên:</strong> {reservation.customer?.name}</p>
                                            <p className="mb-1"><strong className='mr-2'>Email:</strong> {reservation.customer?.email}</p>
                                            <p className="mb-1"><strong className='mr-2'>Số điện thoại:</strong> {reservation.customer?.phoneNumber}</p>
                                            <p><strong className='mr-2'>Số căn cước:</strong> {reservation.customer?.identificationNumber}&nbsp;<button
                                                type="button"
                                                className="btn btn-default btn-xs"
                                                data-toggle="tooltip"
                                                data-original-title="Activate"
                                                onClick={() => openUserDocumentModal(reservation.reservationId)}
                                            >
                                                <i class="fa fa-file-image-o text-warning" aria-hidden="true"></i>

                                            </button></p>
                                        </div>
                                        <div className="col-md-4" style={{ textAlign: 'left' }}>
                                            <h5>Thông Tin Phòng</h5>
                                            <p className="mb-1"><strong className='mr-2'> Ngày nhận phòng:</strong> {new Date(reservation.checkInDate).toLocaleDateString('en-US')}</p>
                                            <p className="mb-1"><strong className='mr-2'> Ngày trả phòng:</strong> {new Date(reservation.checkOutDate).toLocaleDateString('en-US')}</p>
                                            <p className="mb-1"><strong className='mr-2'>Loại phòng:</strong> {reservation.roomType?.type?.typeName}</p>
                                            <p className="mb-1"><strong className='mr-2'>Lịch sử phòng:</strong> </p>
                                            <div className="room-list">
                                                {roomStayHistoryList.map((roomStayHistory) => (
                                                    <div
                                                        key={roomStayHistory.room?.roomNumber}
                                                        className="room-box"
                                                        style={{
                                                            backgroundColor: 'grey',
                                                            position: 'relative',
                                                            textAlign: 'center',
                                                            flex: '0 1 auto',
                                                            margin: '5px'
                                                        }}
                                                    >
                                                        <p>{roomStayHistory.room?.roomNumber}</p>

                                                    </div>
                                                ))}
                                            </div>
                                            {roomStayHistoryList.length === 0 && (
                                                <>
                                                    <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                </>
                                            )}
                                        </div>
                                        <div className="col-md-4" style={{ textAlign: 'left' }}>
                                            <h5>Thanh Toán</h5>
                                            <p className="mb-1"><strong className='mr-2'>Mã số:</strong> {reservation.code}</p>
                                            <p className="mb-1"><strong className='mr-2'>Trạng thái đặt phòng:</strong>
                                                {reservation.reservationStatus === "Pending" && (
                                                    <span className="badge label-table badge-warning">Đang chờ</span>
                                                )}
                                                {reservation.reservationStatus === "CheckIn" && (
                                                    <span className="badge label-table badge-success">Đã nhận phòng</span>
                                                )}
                                                {reservation.reservationStatus === "CheckOut" && (
                                                    <span className="badge label-table badge-danger">Đã trả phòng</span>
                                                )}
                                                {reservation.reservationStatus === "Cancelled" && (
                                                    <span className="badge label-table badge-danger">Đã hủy</span>
                                                )}
                                                  {reservation.reservationStatus === "Refunded" && (
                                                    <span className="badge label-table badge-danger">Đã hoàn tiền</span>
                                                )}
                                            </p>
                                            <p className="mb-1"><strong className='mr-2'>Trạng thái thanh toán:</strong>
                                                {
                                                    reservation.isPrePaid && reservation.paymentStatus === "Paid" && (
                                                        <span className="badge label-table badge-success">
                                                            <i className="fa fa-check-circle" aria-hidden="true"></i> Đã thanh toán
                                                        </span>
                                                    )
                                                }

                                                {
                                                    reservation.isPrePaid && reservation.paymentStatus === "Not Paid" && (
                                                        <span className="badge label-table badge-warning">
                                                            <i className="fa fa-clock" aria-hidden="true"></i> Đã thanh toán trước
                                                        </span>
                                                    )
                                                }

                                                {
                                                    !reservation.isPrePaid && reservation.paymentStatus === "Paid" && (
                                                        <span className="badge label-table badge-success">
                                                            <i className="fa fa-credit-card" aria-hidden="true"></i> Đã thanh toán
                                                        </span>
                                                    )
                                                }

                                                {
                                                    !reservation.isPrePaid && reservation.paymentStatus === "Not Paid" && (
                                                        <span className="badge label-table badge-danger">
                                                            <i className="fa fa-times-circle" aria-hidden="true"></i> Chưa thanh toán
                                                        </span>
                                                    )
                                                }

                                            </p>
                                            {reservation.isPrePaid === true && (
                                                <p className="mb-1"><strong className='mr-2'>Cần thanh toán:</strong>0₫</p>
                                            )}
                                            {reservation.isPrePaid === false && (
                                                <p className="mb-1"><strong className='mr-2'>Cần thanh toán:</strong>{formatter.format(reservation.totalAmount)}₫</p>
                                            )}

                                        </div>
                                        {/* Divider */}
                                        <div className="col-md-12">
                                            <hr />
                                        </div>
                                        <div className="col-md-12" style={{ textAlign: 'left' }}>
                                            <h5>
                                                <i className="fa fa-clock-o text-primary" aria-hidden="true"></i> Tiền phòng:&nbsp;
                                                <span style={{ fontWeight: 'bold' }}>{formatter.format(reservation.totalAmount)}₫
                                                </span> {
                                                    reservation.isPrePaid === true && (

                                                        <span style={{ fontStyle: 'italic' }}>(Đã thanh toán trước)</span>
                                                    )
                                                }
                                            </h5>
                                        </div>
                                        {/* Divider */}
                                        <div className="col-md-12">
                                            <hr />
                                        </div>
                                        <div className="col-md-12" style={{ textAlign: 'left' }}>
                                            <h5><i className="fa fa-life-ring text-danger" aria-hidden="true"></i> Tiền dịch vụ: <span style={{ fontWeight: 'bold' }}>{formatter.format(orderDetailList.reduce((total, item) => total + (item.order?.totalAmount || 0), 0))
                                            }₫</span></h5>
                                            <div className="table-responsive">
                                                <table className="table table-borderless table-hover table-wrap table-centered">
                                                    <thead>
                                                        <tr>
                                                            <th><span>STT</span></th>
                                                            <th><span>Hình ảnh</span></th>
                                                            <th><span>Tên dịch vụ</span></th>
                                                            <th><span>Số lượng</span></th>
                                                            <th><span>Loại dịch vụ</span></th>
                                                            <th><span>Giá (₫)</span></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            orderDetailList.length > 0 && orderDetailList.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    {
                                                                        item.service?.serviceType?.serviceTypeName === "Trả phòng muộn" && (
                                                                            <>
                                                                                <td>
                                                                                    <i className="fa fa-calendar-times-o fa-4x" aria-hidden="true"></i>
                                                                                </td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        item.service?.serviceType?.serviceTypeName !== "Trả phòng muộn" && (
                                                                            <>
                                                                                <td>
                                                                                    <img src={item.service?.image} alt="avatar" style={{ width: "120px", height: '100px' }} />
                                                                                </td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        item.service?.serviceType?.serviceTypeName === "Trả phòng muộn" && (
                                                                            <>
                                                                                <td>Muộn {item.service?.serviceName} ngày</td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        item.service?.serviceType?.serviceTypeName !== "Trả phòng muộn" && (
                                                                            <>
                                                                                <td>{item.service?.serviceName}</td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    <td>{item.quantity}</td>
                                                                    <td>{item.service?.serviceType?.serviceTypeName}</td>
                                                                    {
                                                                        item.service?.serviceType?.serviceTypeName === "Trả phòng muộn" && (
                                                                            <>
                                                                                <td>{formatter.format(item.order?.totalAmount)}</td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        item.service?.serviceType?.serviceTypeName !== "Trả phòng muộn" && (
                                                                            <>
                                                                                <td>{formatter.format(item.order?.totalAmount)}</td>
                                                                            </>
                                                                        )
                                                                    }
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                                {
                                                    orderDetailList.length === 0 && (
                                                        <>
                                                            <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                        </>
                                                    )
                                                }
                                            </div>

                                            {/* Calculate and display total amount */}
                                            <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                                <h5>
                                                    <span style={{ fontWeight: 'bold' }}>Số tiền cần thanh toán: &nbsp;</span>
                                                    {formatter.format(orderDetailList.reduce((total, item) => total + (item.order?.totalAmount || 0), 0)
                                                        + (reservation.isPrePaid === false ? reservation.totalAmount : 0))}₫
                                                </h5>
                                            </div>
                                        </div>
                                        {/* Divider */}
                                        <div className="col-md-12">
                                            <hr />
                                        </div>
                                        <div className="col-md-12" style={{ textAlign: 'left' }}>
                                            <h5>
                                                <i className="fa fa-file-text text-success"></i>  Hóa đơn:
                                            </h5>
                                            <div className="table-responsive">
                                                <table className="table table-borderless table-hover table-wrap table-centered">
                                                    <thead>
                                                        <tr>
                                                            <th><span>STT</span></th>
                                                            <th><span>Ngày tạo</span></th>
                                                            <th><span>Tổng số tiền (₫)</span></th>
                                                            <th><span>Trạng thái</span></th>
                                                            {
                                                                billByReservation && (
                                                                    billByReservation.billStatus === "Paid" && (
                                                                        <>
                                                                            <th><span>Hành động</span></th>

                                                                        </>
                                                                    )
                                                                )

                                                            }
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            billByReservation && (
                                                                <tr>
                                                                    <td>1</td>
                                                                    <td>{new Date(billByReservation.createdDate).toLocaleString('en-US')}</td>
                                                                    <td>{formatter.format(billByReservation.totalAmount)}</td>
                                                                    {
                                                                        billByReservation.billStatus === "Pending" && (
                                                                            <>
                                                                                <td><span className="badge label-table badge-warning">Đang chờ</span></td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        billByReservation.billStatus === "Paid" && (
                                                                            <>
                                                                                <td><span className="badge label-table badge-success">Đã thanh toán</span></td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        billByReservation.billStatus === "Paid" && (
                                                                            <>
                                                                                <td>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-default btn-xs m-r-5"
                                                                                        data-toggle="tooltip"
                                                                                        data-original-title="Activate"
                                                                                        onClick={() => openCreateBillTransactionImageModal(billByReservation.billId)}                                                                            >
                                                                                        <i class="fa fa-file-image-o text-warning" aria-hidden="true"></i>

                                                                                    </button>
                                                                                </td>

                                                                            </>
                                                                        )
                                                                    }

                                                                </tr>
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                                {
                                                    !billByReservation && (
                                                        <>
                                                            <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                {/* <button type="button" className="btn btn-custom">Save</button> */}
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalReservation} >Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModalCreateBillTransactionImage && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Hình Ảnh Chuyển Tiền</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalCreateBillTransactionImage}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                <div className="row">
                                    <div className="col-md-12" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {
                                            billTransactionImageList.length > 0 ? (
                                                billTransactionImageList.map((item, index) => (
                                                    <div key={index} style={{ flex: '1 0 50%', textAlign: 'center', margin: '10px 0', position: 'relative' }}>
                                                        <img src={item.image} alt="Room" style={{ width: "250px", height: "200px" }} />
                                                    </div>
                                                ))
                                            ) : (
                                                <>
                                                    <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                </>
                                            )
                                        }

                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalCreateBillTransactionImage} >Đóng</button>
                            </div>

                        </div>
                    </div>
                </div>
            )
            }
            {showModalUserDocument && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Hình Ảnh Giấy Tờ Của Khách Hàng</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalUserDocument}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                <div className="row">
                                    <div className="col-md-12" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {
                                            userDocumentList.length > 0 ? (
                                                userDocumentList.map((item, index) => (
                                                    <div key={index} style={{ flex: '1 0 50%', textAlign: 'center', margin: '10px 0', position: 'relative' }}>
                                                        <img src={item.image} alt="Room" style={{ width: "500px", height: "500px" }} />
                                                    </div>
                                                ))
                                            ) : (
                                                <>
                                                    <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                </>
                                            )
                                        }

                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalUserDocument} >Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
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
    max-width: 90%;
    width: 90%;
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

export default ListCustomer