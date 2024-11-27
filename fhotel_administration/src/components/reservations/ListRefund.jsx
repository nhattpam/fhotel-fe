import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import userService from '../../services/user.service';
import orderDetailService from '../../services/order-detail.service';
import orderService from '../../services/order.service';

const ListRefund = () => {
    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING

    //call list hotel registration
    const loginUserId = sessionStorage.getItem('userId');


    const [refundList, setRefundList] = useState([]);
    const [refundSearchTerm, setRefundSearchTerm] = useState('');
    const [currentRefundPage, setCurrentRefundPage] = useState(0);
    const [refundsPerPage] = useState(10);


    useEffect(() => {
        orderDetailService
            .getAllRefund()
            .then((res) => {
                const sortedRefundList = [...res.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.order?.orderedDate) - new Date(a.order?.orderedDate);
                });
                setRefundList(sortedRefundList);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [loginUserId]);


    const handleRefundSearch = (event) => {
        setRefundSearchTerm(event.target.value);
    };

    const filteredRefunds = refundList
        .filter((orderDetail) => {
            return (
                orderDetail.order?.reservation?.code.toString().toLowerCase().includes(refundSearchTerm.toLowerCase())
            );
        });

    const pageRefundCount = Math.ceil(filteredRefunds.length / refundsPerPage);

    const handleRefundPageClick = (data) => {
        setCurrentRefundPage(data.selected);
    };

    const offsetRefund = currentRefundPage * refundsPerPage;
    const currentRefunds = filteredRefunds.slice(offsetRefund, offsetRefund + refundsPerPage);



    //detail orderDetail modal 
    const [showModalRefund, setShowModalRefund] = useState(false);

    const [order, setOrder] = useState({

    });


    const openRefundModal = (orderId) => {
        setShowModalRefund(true);
        if (orderId) {
            orderService
                .getOrderById(orderId)
                .then((res) => {
                    setOrder(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const closeModalRefund = () => {
        setShowModalRefund(false);
    };


    //update order
    const [updateOrder, setUpdateOrder] = useState({

    });

    //update hotel status
    const submitUpdateOrder = async (e, orderId, orderStatus) => {
        e.preventDefault();

        try {
            // Fetch the user data
            const res = await orderService.getOrderById(orderId);
            const orderData = res.data;

            // Update the local state with the fetched data and new isActive flag
            setUpdateOrder({ ...orderData, orderStatus });

            // Make the update request
            const updateRes = await orderService.updateOrder(orderId, { ...orderData, orderStatus });
            console.log(updateRes)
            if (updateRes.status === 200) {
                orderDetailService
                    .getAllRefund()
                    .then((res) => {
                        const sortedRefundList = [...res.data].sort((a, b) => {
                            // Assuming requestedDate is a string in ISO 8601 format
                            return new Date(b.orderedDate) - new Date(a.orderedDate);
                        });
                        setRefundList(sortedRefundList);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                handleResponseError(error.response);
            }
        } catch (error) {
            handleResponseError(error.response);
        }
    };

    const handleAcceptRefund = async (orderId) => {

        try {
            const updateRes = await orderService.acceptRefund(orderId);
            console.log(updateRes)
            if (updateRes.status === 201) {
                orderDetailService
                    .getAllRefund()
                    .then((res) => {
                        const sortedRefundList = [...res.data].sort((a, b) => {
                            // Assuming requestedDate is a string in ISO 8601 format
                            return new Date(b.order?.orderedDate) - new Date(a.order?.orderedDate);
                        });
                        setRefundList(sortedRefundList);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                handleResponseError(error.response);
            }
        } catch (error) {
            handleResponseError(error.response);
        }
    };


    /// notification
    const [success, setSuccess] = useState({}); // State to hold error messages
    const [showSuccess, setShowSuccess] = useState(false); // State to manage error visibility
    //notification after creating
    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false); // Hide the error after 2 seconds
                // window.location.reload();
            }, 3000); // Change this value to adjust the duration
            // window.location.reload();
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [showSuccess]); // Only run effect if showError changes


    const [error, setError] = useState({}); // State to hold error messages
    const [showError, setShowError] = useState(false); // State to manage error visibility
    //notification after creating
    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => {
                setShowError(false); // Hide the error after 2 seconds
            }, 3000); // Change this value to adjust the duration
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [showError]); // Only run effect if showError changes


    const handleResponseError = (response) => {
        if (response && response.status === 400) {
            const validationErrors = response.data.errors || [];
            setError({ validation: validationErrors });
        } else {
            setError({ general: "An unexpected error occurred. Please try again." });
        }
        setShowError(true); // Show error modal or message
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
                            <div className="ibox-title">Danh Sách Yêu Cầu Hoàn Tiền</div>
                            <div className="form-group d-flex align-items-center">
                                <div className="search-bar ml-3">
                                    <i className="fa fa-search search-icon" aria-hidden="true"></i>
                                    <input id="demo-foo-search" type="text" placeholder="Tìm kiếm" className="form-control form-control-sm"
                                        autoComplete="on" value={refundSearchTerm}
                                        onChange={handleRefundSearch} />
                                </div>

                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table table-brefundless table-hover table-wrap table-centered">
                                    <thead>
                                        <tr>
                                            <th><span>STT</span></th>
                                            <th><span>Mã đặt phòng</span></th>
                                            <th><span>Khách hàng</span></th>
                                            <th><span>Số điện thoại</span></th>
                                            <th><span>Thời gian yêu cầu</span></th>
                                            <th><span>Trạng thái</span></th>
                                            <th><span>Hành động</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentRefunds.length > 0 && currentRefunds.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.order?.reservation?.code}</td>
                                                        <td>{item.order?.reservation?.customer?.name}</td>
                                                        <td>{item.order?.reservation?.customer?.phoneNumber}</td>
                                                        <td>
                                                            {new Date(item.order?.orderedDate).toLocaleString('en-US')}
                                                        </td>
                                                        <td>
                                                            {item.order?.orderStatus === "Pending" && (
                                                                <span className="badge label-table badge-warning">Đang chờ</span>
                                                            )}
                                                            {item.order?.orderStatus === "Confirmed" && (
                                                                <span className="badge label-table badge-success">Xác nhận</span>
                                                            )}
                                                            {item.order?.orderStatus === "Cancelled" && (
                                                                <span className="badge label-table badge-danger">Đã hủy</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit">
                                                                <i className="fa fa-pencil font-14 text-primary" onClick={() => openRefundModal(item.orderId)} /></button>
                                                            {
                                                                item.order?.orderStatus === "Pending" && (
                                                                    <>
                                                                        <button
                                                                            type="submit"
                                                                            className="btn btn-default btn-xs m-r-5"
                                                                            data-toggle="tooltip"
                                                                            data-original-title="Activate"
                                                                            onClick={() => handleAcceptRefund(item.orderId)} // Activate
                                                                        >
                                                                            <i className="fa fa-check font-14 text-success" />
                                                                        </button>
                                                                        <form
                                                                            id="demo-form"
                                                                            onSubmit={(e) => submitUpdateOrder(e, item.orderId, updateOrder.orderStatus)} // Use isActive from the local state
                                                                            className="d-inline"
                                                                        >

                                                                            <button
                                                                                type="submit"
                                                                                className="btn btn-default btn-xs"
                                                                                data-toggle="tooltip"
                                                                                data-original-title="Deactivate"
                                                                                onClick={() => setUpdateOrder({ ...updateOrder, orderStatus: "Cancelled" })} // Deactivate
                                                                            >
                                                                                <i className="fa fa-times font-14 text-danger" />
                                                                            </button>
                                                                        </form>
                                                                    </>
                                                                )
                                                            }
                                                            {
                                                                item.order?.orderStatus !== "Pending" && (
                                                                    <>
                                                                        <button
                                                                            type="submit"
                                                                            className="btn btn-default btn-xs m-r-5"
                                                                            data-toggle="tooltip"
                                                                            data-original-title="Activate"
                                                                            disabled
                                                                        >
                                                                            <i className="fa fa-check font-14 text-success" />
                                                                        </button>


                                                                        <button
                                                                            type="submit"
                                                                            className="btn btn-default btn-xs"
                                                                            data-toggle="tooltip"
                                                                            data-original-title="Deactivate"
                                                                            disabled
                                                                        >
                                                                            <i className="fa fa-times font-14 text-danger" />
                                                                        </button>
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
                                {
                                    currentRefunds.length === 0 && (
                                        <>
                                            <p className="text-center mt-3" style={{ fontStyle: 'italic', color: 'gray' }}>Không có</p>
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
                                pageCount={pageRefundCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handleRefundPageClick}
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

            {showModalRefund && (
                <div
                    className="modal"
                    tabIndex="-1"
                    role="dialog"
                    style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}
                >
                    <div className="modal-dialog modal-dialog-scrollable modal-xl" role="document">
                        <div className="modal-content">
                            {/* Modal Header */}
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Chi Tiết</h5>
                                <button
                                    type="button"
                                    className="close text-light"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    onClick={closeModalRefund}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                {/* Order Information Section */}
                                <section className="order-info mb-4">
                                    <h5 className="text-primary">Thông Tin Yêu Cầu</h5>
                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                        <strong>Trạng thái:</strong>
                                        {order.orderStatus === "Pending" && (
                                            <span className="badge label-table badge-warning">Đang chờ</span>
                                        )}
                                        {order.orderStatus === "Confirmed" && (
                                            <span className="badge label-table badge-success">Xác nhận</span>
                                        )}
                                        {order.orderStatus === "Cancelled" && (
                                            <span className="badge label-table badge-danger">Đã hủy</span>
                                        )}
                                    </div>
                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                        <strong>Số tiền cần hoàn:</strong>
                                        <span>{formatter.format(order.totalAmount)}₫</span>
                                    </div>
                                    <div className="d-flex justify-content-between py-2">
                                        <strong>Ngày yêu cầu:</strong>
                                        <span>{new Date(order.orderedDate).toLocaleString()}</span>
                                    </div>
                                </section>

                                {/* Divider */}
                                <hr />

                                {/* Reservation Information Section */}
                                <section className="reservation-info">
                                    <h5 className="text-primary">Thông Tin Đặt Phòng</h5>
                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                        <strong>Mã số:</strong>
                                        <span>{order.reservation?.code}</span>
                                    </div>
                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                        <strong>Ngày đặt:</strong>
                                        <span>{new Date(order.reservation?.createdDate).toLocaleString()}</span>
                                    </div>
                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                        <strong>Ngày nhận phòng:</strong>
                                        <span>{new Date(order.reservation?.checkInDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                        <strong>Ngày trả phòng:</strong>
                                        <span>{new Date(order.reservation?.checkOutDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                        <strong>Số lượng đặt:</strong>
                                        <span>{order.reservation?.numberOfRooms} phòng</span>
                                    </div>
                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                        <strong>Tổng số tiền:</strong>
                                        <span>{formatter.format(order.reservation?.totalAmount)}₫</span>
                                    </div>
                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                        <strong>Trạng thái đặt phòng:</strong>
                                        {order.reservation?.reservationStatus === "Pending" && (
                                            <span className="badge label-table badge-warning">Đang chờ</span>
                                        )}
                                        {order.reservation?.reservationStatus === "CheckIn" && (
                                            <span className="badge label-table badge-success">Đã nhận phòng</span>
                                        )}
                                        {order.reservation?.reservationStatus === "CheckOut" && (
                                            <span className="badge label-table badge-success">Đã trả phòng</span>
                                        )}
                                        {order.reservation?.reservationStatus === "Cancelled" && (
                                            <span className="badge label-table badge-danger">Đã hủy</span>
                                        )}
                                        {order.reservation?.reservationStatus === "Refunded" && (
                                            <span className="badge label-table badge-danger">Đã hoàn tiền</span>
                                        )}
                                    </div>
                                    <div className="d-flex justify-content-between py-2">
                                        <strong>Thanh toán:</strong>
                                        <span>{order.reservation?.isPrePaid ? 'Đã trả trước' : 'Chưa thanh toán'}</span>
                                    </div>
                                </section>
                            </div>


                            {/* Modal Footer */}
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalRefund}>
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>
                {`
                    .page-item.active .page-link{
                    background-color: #20c997;
                    brefund-color: #20c997;
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
    brefund-collapse: separate;
}
.table-hover > tbody > tr:hover > td,
.table-hover > tbody > tr:hover > th {
	background-color: #eee;
}
.table thead > tr > th {
	brefund-bottom: 1px solid #C2C2C2;
	padding-bottom: 0;
}


.table tbody > tr > td {
	font-size: 0.875em;
	background: #f5f5f5;
	brefund-top: 10px solid #fff;
	vertical-align: middle;
	padding: 12px 8px;
}
.table tbody > tr > td:first-child,
.table thead > tr > th:first-child {
	padding-left: 20px;
}
.table thead > tr > th span {
	brefund-bottom: 2px solid #C2C2C2;
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
	brefund-color: #2bb6a3;
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
	brefund: none;
	brefund-bottom: 1px solid #ebebeb;
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
    brefund-bottom: 1px solid #C2C2C2;
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
    brefund: none; /* Or adjust based on your table's styling */
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
                    brefund: 8px solid rgba(245, 141, 4, 0.1); /* Transparent brefund to create the circle */
                    brefund-top: 8px solid #3498db; /* Blue color */
                    brefund-radius: 50%;
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

export default ListRefund