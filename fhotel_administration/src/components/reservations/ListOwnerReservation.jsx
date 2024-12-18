import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import reservationService from '../../services/reservation.service';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../../services/user.service';

const ListOwnerReservation = () => {

    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING

    //get user information
    const loginUserId = sessionStorage.getItem('userId');

    //call list hotel registration
    const [reservationList, setReservationList] = useState([]);
    const [reservationSearchTerm, setReservationSearchTerm] = useState('');
    const [currentReservationPage, setCurrentReservationPage] = useState(0);
    const [reservationsPerPage] = useState(10);


    useEffect(() => {
        userService
            .getAllReservationByOwner(loginUserId)
            .then((res) => {
                const sortedReservationList = [...res.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setReservationList(sortedReservationList);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [loginUserId]);


    const [selectedHotelId, setSelectedHotelId] = useState('');
    const uniqueHotels = [...new Set(reservationList.map((reservation) => reservation.roomType?.hotel?.hotelName))]
        .filter(Boolean);

    const handleReservationSearch = (event) => {
        setReservationSearchTerm(event.target.value);
    };

    const filteredReservations = reservationList
        .filter((reservation) => {
            const matchesType = selectedHotelId ? reservation.roomType?.hotel?.hotelName === selectedHotelId : true;
            const matchesSearchTerm = (
                reservation.code.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.customer?.name.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.customer?.code.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.customer?.email.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.customer?.phoneNumber.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.roomType?.type?.typeName.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.roomType?.hotel?.code.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.roomType?.hotel?.hotelName.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.createdDate.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.numberOfRooms?.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase())
            );
            return matchesType && matchesSearchTerm;
        });

    const pageReservationCount = Math.ceil(filteredReservations.length / reservationsPerPage);

    const handleReservationPageClick = (data) => {
        setCurrentReservationPage(data.selected);
    };

    const offsetReservation = currentReservationPage * reservationsPerPage;
    const currentReservations = filteredReservations.slice(offsetReservation, offsetReservation + reservationsPerPage);



    //detail reservation modal 
    const [showModalReservation, setShowModalReservation] = useState(false);
    const [roomStayHistoryList, setRoomStayHistoryList] = useState([]);
    const [orderDetailList, setOrderDetailList] = useState([]);
    const [billByReservation, setBillByReservation] = useState(null);

    const [reservation, setReservation] = useState({

    });


    const openReservationModal = (reservationId) => {
        setShowModalReservation(true);
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


    const formatter = new Intl.NumberFormat('en-US');

    //FIX LINK
    const navigate = useNavigate();

    const goToEditHotel = (hotelId) => {
        navigate("/edit-hotel", { state: { hotelId } });
    };

    //sort reservation
    const [filterFrom, setFilterFrom] = useState(""); // Initial 'from' date
    const [filterTo, setFilterTo] = useState("");     // Initial 'to' date

    const handleFilter = () => {
        const filteredData = reservationList.filter((item) => {
            const itemFrom = new Date(item.checkInDate);
            const itemTo = new Date(item.checkOutDate);
            const filterFromDate = new Date(filterFrom);
            const filterToDate = new Date(filterTo);

            // Check if the item's range overlaps with the filter range
            return itemFrom <= filterToDate && itemTo >= filterFromDate;
        });

        setReservationList(filteredData);
    };

    const resetFilter = () => {
        setFilterFrom(""); // Clear the from date
        setFilterTo("");   // Clear the to date

        // Reload the full data
        if (loginUserId) {
            userService
                .getAllReservationByOwner(loginUserId)
                .then((res) => {
                    const sortedReservationList = [...res.data].sort((a, b) => {
                        // Sort by createdDate (descending)
                        const createdDateA = new Date(a.createdDate);
                        const createdDateB = new Date(b.createdDate);
                        if (createdDateA < createdDateB) return 1;
                        if (createdDateA > createdDateB) return -1;


                        // If all else is the same, maintain the original order
                        return 0;
                    });

                    // Set the sorted list to the state
                    setReservationList(sortedReservationList);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };
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
                            <div className="ibox-title">Danh Sách Đặt Phòng</div>
                            <div className="form-group d-flex align-items-center">
                                <select
                                    value={selectedHotelId}
                                    onChange={(e) => setSelectedHotelId(e.target.value)}
                                    className="form-control form-control-sm"
                                >
                                    <option value="">Tất cả khách sạn</option>
                                    {uniqueHotels.map((hotelName, index) => (
                                        <option key={index} value={hotelName}>{hotelName}</option>
                                    ))}
                                </select>
                                <div className="search-bar ml-3">
                                    <i className="fa fa-search search-icon" aria-hidden="true"></i>
                                    <input id="demo-foo-search" type="text" placeholder="Tìm kiếm" className="form-control form-control-sm"
                                        autoComplete="on" value={reservationSearchTerm}
                                        onChange={handleReservationSearch} />
                                </div>
                                {/* Date Filters */}
                                <div className="ml-3 d-flex align-items-center">
                                    <label className="mr-2 mb-0">Từ:</label>
                                    <input
                                        type="date"
                                        value={filterFrom}
                                        onChange={(e) => setFilterFrom(e.target.value)}
                                        className="form-control form-control-sm"
                                    />
                                    <label className="ml-3 mr-2 mb-0">Đến:</label>
                                    <input
                                        type="date"
                                        value={filterTo}
                                        onChange={(e) => setFilterTo(e.target.value)}
                                        className="form-control form-control-sm"
                                    />
                                    <button
                                        className="btn btn-primary ml-3 btn-sm"
                                        onClick={handleFilter}
                                    >
                                        Lọc
                                    </button>
                                    <button
                                        className="btn btn-secondary ml-2 btn-sm"
                                        onClick={() => resetFilter()}
                                    >
                                        Đặt lại
                                    </button>

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
                                                        <td>{item.code}</td>
                                                        <td>
                                                            {item.customer?.name}
                                                        </td>
                                                        <td>
                                                            <a className='text-primary' onClick={() => goToEditHotel(item.roomType?.hotelId)}>
                                                                {item.roomType?.hotel?.hotelName}
                                                            </a>
                                                        </td>
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
                                {
                                    currentReservations.length === 0 && (
                                        <>
                                            <p className='text-center mt-3' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                        </>
                                    )
                                }
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
                                pageCount={pageReservationCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handleReservationPageClick}
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
                                                            <p className='text-center mt-3' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
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

                                                                </tr>
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                                {
                                                    !billByReservation && (
                                                        <>
                                                            <p className='text-center mt-3' style={{ fontStyle: 'italic', color: 'gray' }}>Không có</p>
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

export default ListOwnerReservation