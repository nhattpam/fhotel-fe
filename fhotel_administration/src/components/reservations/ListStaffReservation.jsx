import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import reservationService from '../../services/reservation.service';
import userService from '../../services/user.service';
import { Link } from 'react-router-dom';

const ListStaffReservation = () => {

    //get user information
    const loginUserId = sessionStorage.getItem('userId');


    //call list hotel registration
    const [reservationList, setReservationList] = useState([]);
    const [reservationSearchTerm, setReservationSearchTerm] = useState('');
    const [currentReservationPage, setCurrentReservationPage] = useState(0);
    const [reservationsPerPage] = useState(10);


    useEffect(() => {
        userService
            .getAllReservationByStaff(loginUserId)
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
    }, []);


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



    //detail reservation modal 
    const [showModalReservation, setShowModalReservation] = useState(false);
    const [roomStayHistoryList, setRoomStayHistoryList] = useState([]);
    const [orderDetailList, setOrderDetailList] = useState([]);
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
        }
    };

    const closeModalReservation = () => {
        setShowModalReservation(false);
    };


    return (
        <>
            <Header />
            <SideBar />
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
                            <div className="form-group">
                                <input id="demo-foo-search" type="text" placeholder="Tìm Kiếm" className="form-control form-control-sm"
                                    autoComplete="on" value={reservationSearchTerm}
                                    onChange={handleReservationSearch} />
                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table table-borderless table-hover table-wrap table-centered">
                                    <thead>
                                        <tr>
                                            <th><span>STT</span></th>
                                            <th><span>Mã Đặt Phòng</span></th>
                                            <th><span>Khách Hàng</span></th>
                                            <th><span>Khách Sạn</span></th>
                                            <th><span>Loại Phòng</span></th>
                                            <th><span>Số Lượng Đặt</span></th>
                                            <th><span>Ngày Đặt</span></th>
                                            <th><span>Trạng Thái</span></th>
                                            <th><span>Hành Động</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentReservations.length > 0 && currentReservations.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.code}</td>
                                                        <td>{item.customer?.name}</td>
                                                        <td>
                                                            <Link to={`/edit-hotel/${item.roomType?.hotelId}`}>
                                                                {item.roomType?.hotel?.hotelName}
                                                            </Link>
                                                        </td>
                                                        <td>{item.roomType?.type?.typeName}</td>
                                                        <td>{item.numberOfRooms}</td>
                                                        <td> {new Date(item.createdDate).toLocaleString('en-US')}</td>
                                                        <td>
                                                            {item.reservationStatus === "Pending" && (
                                                                <span className="badge label-table badge-warning">Đang Chờ</span>
                                                            )}
                                                            {item.reservationStatus === "CheckIn" && (
                                                                <span className="badge label-table badge-success">Đã Check In</span>
                                                            )}
                                                            {item.reservationStatus === "CheckOut" && (
                                                                <span className="badge label-table badge-danger">Đã Check Out</span>
                                                            )}
                                                            {item.reservationStatus === "Cancelled" && (
                                                                <span className="badge label-table badge-danger">Đã Hủy</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5"
                                                                data-toggle="tooltip" data-original-title="Edit">
                                                                <i className="fa fa-pencil font-14"
                                                                    onClick={() => openReservationModal(item.reservationId)} /></button>
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
                            <form>
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
                                                <p><strong className='mr-2'>Số căn cước:</strong> {reservation.customer?.identificationNumber}</p>
                                            </div>
                                            <div className="col-md-4" style={{ textAlign: 'left' }}>
                                                <h5>Thông Tin Phòng</h5>
                                                <p className="mb-1"><strong className='mr-2'>Loại phòng:</strong> {reservation.roomType?.type?.typeName}</p>
                                                <p className="mb-1"><strong className='mr-2'>Phòng đã ở:</strong> </p>
                                                <div className="room-list">
                                                    {roomStayHistoryList.map((roomStayHistory) => (
                                                        <div
                                                            key={roomStayHistory.room?.roomNumber}
                                                            className="room-box"
                                                            style={{
                                                                backgroundColor: 'green',
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
                                                    <p>Không tìm thấy.</p>
                                                )}
                                            </div>
                                            <div className="col-md-4" style={{ textAlign: 'left' }}>
                                                <h5>Thanh Toán</h5>
                                                <p className="mb-1"><strong className='mr-2'>Mã đặt chỗ:</strong> {reservation.code}</p>
                                                <p className="mb-1"><strong className='mr-2'>Trạng thái thanh toán:</strong>
                                                    {reservation.paymentStatus === "Paid" && (
                                                        <span className="badge label-table badge-success">Đã thanh toán</span>
                                                    )}
                                                    {reservation.paymentStatus === "Not Paid" && (
                                                        <span className="badge label-table badge-danger">Chưa thanh toán</span>
                                                    )}
                                                </p>
                                                {reservation.paymentStatus === "Paid" && (
                                                    <p className="mb-1"><strong className='mr-2'>Cần thanh toán:</strong> 0 VND</p>
                                                )}
                                                {reservation.paymentStatus === "Not Paid" && (
                                                    <p className="mb-1"><strong className='mr-2'>Cần thanh toán:</strong> {reservation.totalAmount} VND</p>
                                                )}

                                            </div>
                                            {/* Divider */}
                                            <div className="col-md-12">
                                                <hr />
                                            </div>
                                            <div className="col-md-12" style={{ textAlign: 'left' }}>
                                                <h5>Dịch Vụ</h5>
                                                <div className="table-responsive">
                                                    <table className="table table-borderless table-hover table-wrap table-centered">
                                                        <thead>
                                                            <tr>
                                                                <th><span>STT</span></th>
                                                                <th><span>Hình Ảnh</span></th>
                                                                <th><span>Tên Dịch Vụ</span></th>
                                                                <th><span>Số Lượng</span></th>
                                                                <th><span>Loại Dịch Vụ</span></th>
                                                                <th><span>Đơn Giá (VND)</span></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                orderDetailList.length > 0 && orderDetailList.map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>
                                                                            <img src={item.service?.image} alt="avatar" style={{ width: "120px", height: '100px' }} />
                                                                        </td>
                                                                        <td>{item.service?.serviceName}</td>
                                                                        <td>{item.quantity}</td>
                                                                        <td>{item.service?.serviceType?.serviceTypeName}</td>
                                                                        <td>{item.service?.price}</td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                    
                                                </div>
                                                {
                                                    orderDetailList.length === 0 && (
                                                        <>
                                                            <p style={{color: 'grey'}} className='text-center'>Không có</p>
                                                        </>
                                                    )
                                                }
                                                {/* Calculate and display total amount */}
                                                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                                    <h5>
                                                        Tổng cộng: &nbsp;
                                                        {(orderDetailList.reduce((total, item) => total + (item.quantity * item.service?.price || 0), 0))
                                                            + (reservation.paymentStatus === "Not Paid" ? reservation.totalAmount : 0)} VND
                                                    </h5>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    {/* <button type="button" className="btn btn-custom">Save</button> */}
                                    <button type="button" className="btn btn-dark btn-sm" onClick={closeModalReservation} >Đóng</button>
                                </div>
                            </form>
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

                                            `}
            </style>

        </>
    )
}

export default ListStaffReservation