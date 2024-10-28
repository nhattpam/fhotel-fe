import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import orderService from '../../services/order.service';
import userService from '../../services/user.service';

const ListOrder = () => {
    //call list hotel registration

    const loginOrderId = sessionStorage.getItem('userId');


    const [orderList, setOrderList] = useState([]);
    const [orderSearchTerm, setOrderSearchTerm] = useState('');
    const [currentOrderPage, setCurrentOrderPage] = useState(0);
    const [ordersPerPage] = useState(5);


    useEffect(() => {
        userService
            .getAllOrderByStaff(loginOrderId)
            .then((res) => {
                const sortedOrderList = [...res.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setOrderList(sortedOrderList);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    const handleOrderSearch = (event) => {
        setOrderSearchTerm(event.target.value);
    };

    const filteredOrders = orderList
        .filter((order) => {
            return (
                order.orderId.toString().toLowerCase().includes(orderSearchTerm.toLowerCase())
            );
        });

    const pageOrderCount = Math.ceil(filteredOrders.length / ordersPerPage);

    const handleOrderPageClick = (data) => {
        setCurrentOrderPage(data.selected);
    };

    const offsetOrder = currentOrderPage * ordersPerPage;
    const currentOrders = filteredOrders.slice(offsetOrder, offsetOrder + ordersPerPage);



    //detail order modal 
    const [showModalOrder, setShowModalOrder] = useState(false);

    const [order, setOrder] = useState({

    });
    const [orderDetailList, setOrderDetailList] = useState([]);


    const openOrderModal = (orderId) => {
        setShowModalOrder(true);
        if (orderId) {
            orderService
                .getAllOrderDetailByOrder(orderId)
                .then((res) => {
                    setOrderDetailList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const closeModalOrder = () => {
        setShowModalOrder(false);
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
                            <div className="ibox-title">Danh Sách Dịch Vụ Được Yêu Cầu</div>
                            <div className="form-group">
                                <input id="demo-foo-search" type="text" placeholder="Tìm Kiếm" className="form-control form-control-sm"
                                    autoComplete="on" value={orderSearchTerm}
                                    onChange={handleOrderSearch} />
                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table table-borderless table-hover table-wrap table-centered">
                                    <thead>
                                        <tr>
                                            <th>STT.</th>
                                            <th>Khách Hàng</th>
                                            <th>Số Điện Thoại</th>
                                            <th>Thời Gian Yêu Cầu</th>
                                            <th>Trạng Thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentOrders.length > 0 && currentOrders.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.reservation?.customer?.name}</td>
                                                        <td>{item.reservation?.customer?.phoneNumber}</td>
                                                        <td>
                                                            {new Date(item.orderedDate).toLocaleString('en-US')}
                                                        </td>
                                                        <td>
                                                            {item.orderStatus === "Pending" && (
                                                                <span className="badge label-table badge-warning">Đang Chờ</span>
                                                            )}
                                                            {item.orderStatus === "Confirmed" && (
                                                                <span className="badge label-table badge-success">Xác Nhận</span>
                                                            )}
                                                            {item.reservationStatus === "Cancelled" && (
                                                                <span className="badge label-table badge-danger">Đã Hủy</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit"><i className="fa fa-pencil font-14" onClick={() => openOrderModal(item.orderId)} /></button>
                                                            <form
                                                                id="demo-form"
                                                                // onSubmit={(e) => updateOrder(e, item.orderId, order.isActive)} // Use isActive from the local state
                                                                className="d-inline"
                                                            >
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-default btn-xs m-r-5"
                                                                    data-toggle="tooltip"
                                                                    data-original-title="Activate"
                                                                    onClick={() => setOrder({ ...order, isActive: true })} // Activate
                                                                >
                                                                    <i className="fa fa-check font-14 text-success" />
                                                                </button>
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-default btn-xs"
                                                                    data-toggle="tooltip"
                                                                    data-original-title="Deactivate"
                                                                    onClick={() => setOrder({ ...order, isActive: false })} // Deactivate
                                                                >
                                                                    <i className="fa fa-times font-14 text-danger" />
                                                                </button>
                                                            </form>
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
                                pageCount={pageOrderCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handleOrderPageClick}
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

            {showModalOrder && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <form>

                                <div className="modal-header bg-dark text-light">
                                    <h5 className="modal-title">Thông Tin Yêu Cầu</h5>
                                    <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalOrder}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' , textAlign: 'left'}}>
                                        <div className="table-responsive">
                                            <table className="table table-borderless table-hover table-wrap table-centered">
                                                <thead>
                                                    <tr>
                                                        <th>STT.</th>
                                                        <th>Hình Ảnh</th>
                                                        <th>Tên</th>
                                                        <th>Đơn Giá</th>
                                                        <th>Số Lượng</th>
                                                        <th>Loại Dịch Vụ</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        orderDetailList.length > 0 && orderDetailList.map((item, index) => (
                                                            <>
                                                                <tr>
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                        <img src={item.service?.image} alt="avatar" style={{ width: "70px", height: '100px' }} />

                                                                    </td>
                                                                    <td>{item.service?.serviceName}</td>
                                                                    <td>{item.service?.price} Vnd</td>
                                                                    <td>{item.quantity} </td>
                                                                    <td>{item.service?.serviceType?.serviceTypeName}</td>
                                                                </tr>
                                                            </>
                                                        ))
                                                    }


                                                </tbody>
                                            </table>
                                        </div>
                                    </div>


                                <div className="modal-footer">
                                    {/* <button type="button" className="btn btn-custom">Save</button> */}
                                    <button type="button" className="btn btn-dark btn-sm" onClick={closeModalOrder} >Đóng</button>
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

export default ListOrder