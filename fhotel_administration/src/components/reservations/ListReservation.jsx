import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import reservationService from '../../services/reservation.service';

const ListReservation = () => {
    //call list hotel registration
    const [reservationList, setReservationList] = useState([]);
    const [reservationSearchTerm, setReservationSearchTerm] = useState('');
    const [currentReservationPage, setCurrentReservationPage] = useState(0);
    const [reservationsPerPage] = useState(5);


    useEffect(() => {
        reservationService
            .getAllReservation()
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
                        <div className="ibox-head">
                            <div className="ibox-title">Danh Sách Đặt Chỗ</div>
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
                                            <th>STT.</th>
                                            <th>Khách Hàng</th>
                                            <th>Loại Phòng</th>
                                            <th>Số Lượng</th>
                                            <th>Ngày Đặt</th>
                                            <th>Trạng Thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentReservations.length > 0 && currentReservations.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.customer?.name}</td>
                                                        <td>{item.roomType?.type?.typeName}</td>
                                                        <td>{item.numberOfRooms}</td>
                                                        <td> {new Date(item.createdDate).toLocaleString('en-US')}</td>
                                                        <td>
                                                            {item.reservationStatus === "Pending" && (
                                                                <span className="badge label-table badge-warning">Đang Chờ</span>
                                                            )}
                                                            {item.reservationStatus === "CheckIn" && (
                                                                <span className="badge label-table badge-success">Xác Nhận</span>
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
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content shadow-lg rounded">
                            <form>
                                <div className="modal-header bg-dark text-light">
                                    <h5 className="modal-title">Chi Tiết Đặt Chỗ</h5>
                                    <button type="button" className="close text-white" data-dismiss="modal" aria-label="Close" onClick={closeModalReservation}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>

                                <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto', textAlign: 'left' }}>
                                    {/* Section: Customer Information */}
                                    <div className="border-bottom pb-3 mb-2">
                                        <h6 className="text-uppercase text-secondary font-weight-bold">Thông Tin Khách Hàng</h6>
                                        <p className="mb-1" ><strong className='mr-2'>Họ Và Tên:</strong> {reservation.customer?.name}</p>
                                        <p className="mb-1"><strong className='mr-2'>Email:</strong> {reservation.customer?.email}</p>
                                        <p className="mb-1"><strong className='mr-2'>Số Điện Thoại:</strong> {reservation.customer?.phoneNumber}</p>
                                        <p><strong className='mr-2'>Số Căn Cước:</strong> {reservation.customer?.identificationNumber}</p>
                                    </div>

                                    {/* Section: Reservation Information */}
                                    <div className="border-bottom pb-3 mb-2">
                                        <h6 className="text-uppercase text-secondary font-weight-bold">Thông Tin Đặt Chỗ</h6>
                                        <p className="mb-1"><strong className='mr-2'>Ngày Dự Kiến Check-In:</strong>
                                            {new Date(reservation.checkInDate).toLocaleDateString('en-US')}
                                        </p>
                                        <p className="mb-1"><strong className='mr-2'>Ngày Dự Kiến Check-Out:</strong>
                                            {new Date(reservation.checkOutDate).toLocaleDateString('en-US')}
                                        </p>
                                        <p className="mb-1"><strong className='mr-2'>Số Lượng Phòng Muốn Đặt:</strong> {reservation.numberOfRooms}</p>
                                        <p className="mb-1"><strong className='mr-2'>Trạng Thái:</strong> {reservation.reservationStatus}</p>
                                        <p><strong className='mr-2'>Tổng Số Tiền:</strong > {reservation.totalAmount} VND</p>
                                    </div>

                                    {/* Section: Room Information */}
                                    <div className="border-bottom pb-3 mb-2">
                                        <h6 className="text-uppercase text-secondary font-weight-bold">Thông Tin Phòng</h6>
                                        <p className="mb-1"><strong className='mr-2'>Loại Phòng:</strong> {reservation.roomType?.type?.typeName}</p>
                                        <p className="mb-1"><strong className='mr-2 '>Tổng Số Phòng:</strong> {reservation.roomType?.totalRooms}</p>
                                        <p><strong className='mr-2'>Số Phòng Hiện Có:</strong> {reservation.roomType?.availableRooms}</p>
                                    </div>

                                    {/* Section: Payment Details */}
                                    <div className="border-bottom pb-3 mb-2">
                                        <h6 className="text-uppercase text-secondary font-weight-bold">Thông Tin Thanh Toán</h6>
                                        <p className="mb-1"><strong className='mr-2'>Phương Thức Thanh Toán:</strong> {reservation.paymentMethod?.paymentMethodName ?? "Chưa Có"}</p>
                                        <p className="mb-1"><strong className='mr-2'>Trạng Thái:</strong> {reservation.paymentStatus}</p>
                                        <p className="mb-1"><strong className='mr-2'>Số Tiền Đã Trả:</strong> {reservation.totalAmount ?? 0} VND</p>
                                        <p><strong className='mr-2'>Số Tiền Cần Trả:</strong> {reservation.remainingBalance ?? 0} VND</p>
                                    </div>

                                    {/* Section: Feedback */}
                                    <div className="pb-3">
                                        <h6 className="text-uppercase text-secondary font-weight-bold">Đánh Giá Của Khách Hàng</h6>
                                        {/* Feedback information can be displayed here */}
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

                .custom-modal-xl {
    max-width: 90%;
    width: 90%;
}
    .btn-custom{
    background-color: #3498db;
    color: white
    }
                                            `}
            </style>

        </>
    )
}

export default ListReservation