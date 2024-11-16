import { React, useState, useEffect, useRef } from "react";
import Header from '../Header'
import SideBar from '../SideBar'
import Footer from '../Footer'
import { Chart, PieController, ArcElement, registerables } from "chart.js";
import userService from "../../services/user.service";
import reservationService from "../../services/reservation.service";
import { Link } from "react-router-dom";
import orderService from "../../services/order.service";
import billService from "../../services/bill.service";
import roomService from "../../services/room.service";


const ReceptionistHome = () => {
  const loginUserId = sessionStorage.getItem('userId');

  Chart.register(PieController, ArcElement);
  Chart.register(...registerables);


  //count reservation by owner
  const [reservationList, setReservationList] = useState([]);
  const [billList, setBillList] = useState([]);
  const [reservationSearchTerm, setReservationSearchTerm] = useState('');
  const [currentReservationPage, setCurrentReservationPage] = useState(0);
  const [reservationsPerPage] = useState(5);
  const [reservationCount, setReservationCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [roomList, setRoomList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [currentOrderPage, setCurrentOrderPage] = useState(0);
  const [ordersPerPage] = useState(5);

  useEffect(() => {
    userService
      .getAllReservationByStaff(loginUserId)
      .then((res) => {
        const sortedReservationList = [...res.data].sort((a, b) => {
          // Assuming requestedDate is a string in ISO 8601 format
          return new Date(b.createdDate) - new Date(a.createdDate);
        });
        setReservationList(sortedReservationList);
        setReservationCount(sortedReservationList.length);
      })
      .catch((error) => {
        console.log(error);
      });
    userService
      .getAllCustomerByStaff(loginUserId)
      .then((res) => {
        setCustomerCount(res.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
    userService
      .getAllRoomByStaff(loginUserId)
      .then((res) => {
        const sortedRoomList = [...res.data].sort((a, b) => {
          // Assuming requestedDate is a string in ISO 8601 format
          return a.roomNumber - b.roomNumber; // Sort by roomNumber in ascending order
        });
        setRoomList(sortedRoomList);

      })
      .catch((error) => {
        console.log(error);
      });
    userService
      .getAllOrderByStaff(loginUserId)
      .then((res) => {
        const sortedOrderList = [...res.data].sort((a, b) => {
          // Assuming requestedDate is a string in ISO 8601 format
          return new Date(b.orderedDate) - new Date(a.orderedDate);
        });
        setOrderList(sortedOrderList);
      })
      .catch((error) => {
        console.log(error);
      });



  }, [loginUserId]);
  const filteredOrders = orderList
    .filter((order) => {
      return (
        order.reservation?.customer?.name.toString().toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        order.reservation?.customer?.email.toString().toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        order.reservation?.customer?.phoneNumber.toString().toLowerCase().includes(orderSearchTerm.toLowerCase())
      );
    });

  const pageOrderCount = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleOrderPageClick = (data) => {
    setCurrentOrderPage(data.selected);
  };

  const offsetOrder = currentOrderPage * ordersPerPage;
  const currentOrders = filteredOrders.slice(offsetOrder, offsetOrder + ordersPerPage);

  const filteredReservations = reservationList
    .filter((reservation) => {
      return (
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


  //end count reservation by owner
  const [showModalOrder, setShowModalOrder] = useState(false);
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

  //transaction detail
  //detail room modal 
  const [showModalRoom, setShowModalRoom] = useState(false);
  const [room, setRoom] = useState({

  });


  const openRoomModal = (roomId) => {
    setShowModalRoom(true);
    if (roomId) {
      roomService
        .getRoomById(roomId)
        .then((res) => {
          setRoom(res.data);
        })
        .catch((error) => {
          console.log(error);
        });

    }
  };

  const closeModalRoom = () => {
    setShowModalRoom(false);
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


  //color room
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const availableCount = roomList.filter(room => room.status === 'Available').length;
  const occupiedCount = roomList.filter(room => room.status === 'Occupied').length;
  const maintenanceCount = roomList.filter(room => room.status === 'Maintenance').length;

  useEffect(() => {
    if (!canvasRef.current) {
      console.log("Canvas element not available.");
      return;
    }

    // Destroy existing chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    try {
      const ctx = canvasRef.current.getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Available', 'Occupied', 'Maintenance'],
          datasets: [
            {
              data: [availableCount, occupiedCount, maintenanceCount],
              backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
      console.log("Chart created successfully.");
    } catch (error) {
      console.error("Error creating chart:", error);
    }
  }, [availableCount, occupiedCount, maintenanceCount]);
  return (
    <>
      <Header />
      <SideBar />
      <div className="content-wrapper" style={{ textAlign: 'left', display: 'block' }}>
        {/* START PAGE CONTENT*/}
        <div className="page-content fade-in-up">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="ibox bg-success color-white widget-stat">
                <div className="ibox-body">
                  <h2 className="m-b-5 font-strong">{reservationCount}</h2>
                  <div className="m-b-5">TỔNG SỐ ĐẶT PHÒNG</div><i className="ti-shopping-cart widget-stat-icon" />
                  {/* <div><i className="fa fa-level-up m-r-5" /><small>25% higher</small></div> */}
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="ibox bg-danger color-white widget-stat">
                <div className="ibox-body">
                  <h2 className="m-b-5 font-strong">{customerCount}</h2>
                  <div className="m-b-5">TỔNG SỐ KHÁCH HÀNG</div><i className="ti-user widget-stat-icon" />
                  {/* <div><i className="fa fa-level-down m-r-5" /><small>-12% Lower</small></div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8">
              <div className="ibox">
                <div className="ibox-body">
                  <div className="flexbox mb-4">
                    <div>
                      <h3 className="m-0">Danh sách phòng</h3>
                      {/* <div>Your shop sales analytics</div> */}
                    </div>
                    <div className="d-inline-flex">
                    </div>
                  </div>
                  <div>
                    {/* <canvas id="bar_chart" style={{ height: 260 }} /> */}
                    <div className="chart-area">
                      <div className="room-list">
                        {roomList.map((room) => (
                          <div
                            key={room.roomNumber}
                            className="room-box"

                            style={{
                              backgroundColor: room.status === 'Available' ? 'green' :
                                room.status === 'Occupied' ? 'red' :
                                  '#E4A11B',
                              position: 'relative',
                              textAlign: 'center',
                              flex: '0 1 auto',
                              margin: '5px'
                            }}
                          >
                            <p onClick={() => openRoomModal(room.roomId)}>{room.roomNumber}</p>


                          </div>
                        ))}
                      </div>
                      {roomList.length === 0 && (
                        <>
                          <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
      <div className="ibox">
        <div className="ibox-head">
          <div className="ibox-title">Chi tiết</div>
        </div>
        <div className="ibox-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <canvas ref={canvasRef} id="doughnut_chart" style={{ height: 160, width: '100%' }} />
            </div>
            <div className="col-md-6">
              <div className="m-b-20 text-success">
                <i className="fa fa-circle-o m-r-10" style={{ color: '#28a745' }} />
                Còn trống: {availableCount}
              </div>
              <div className="m-b-20 text-danger">
                <i className="fa fa-circle-o m-r-10" style={{ color: '#dc3545' }} />
                Không có sẵn: {occupiedCount}
              </div>
              <div className="m-b-20 text-warning">
                <i className="fa fa-circle-o m-r-10" style={{ color: '#ffc107' }} />
                Bảo trì: {maintenanceCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
          </div>

          <div className="row">
            <div className="col-lg-8">
              <div className="ibox">
                <div className="ibox-head">
                  <div className="ibox-title">Danh sách đặt phòng</div>
                  <div className="ibox-tools">
                    <a className="ibox-collapse"><i className="fa fa-minus" /></a>
                    <a className="dropdown-toggle" data-toggle="dropdown"><i className="fa fa-ellipsis-v" /></a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a className="dropdown-item">option 1</a>
                      <a className="dropdown-item">option 2</a>
                    </div>
                  </div>
                </div>
                <div className="ibox-body">
                  <table className="table table-striped table-hover">
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
                        {/* <th width="91px">Date</th> */}
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
                                <Link to={`/edit-hotel/${item.roomType?.hotelId}`}>
                                  {item.roomType?.hotel?.hotelName}
                                </Link>
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
                  {
                    currentReservations.length === 0 && (
                      <>
                        <p className="text-center mt-3" style={{ fontStyle: 'italic', color: 'gray' }}>Không có</p>
                      </>
                    )
                  }
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="ibox">
                <div className="ibox-head">
                  <div className="ibox-title">Dịch vụ yêu cầu</div>
                </div>
                <div className="ibox-body">
                  {
                    currentOrders.length > 0 && currentOrders.map((item, index) => (
                      <>
                        <ul className="media-list media-list-divider m-0">
                          <li className="media">
                            <a className="media-img" href="javascript:;">
                              {/* <img src="./assets/img/image.jpg" width="50px;" /> */}
                            </a>
                            <div className="media-body">
                              <div className="media-heading">
                                Mã đặt phòng: <a href="javascript:;" onClick={() => openReservationModal(item.reservationId)}>{item.reservation?.code}</a>
                                <span className="font-16 float-right"><button className="btn btn-default btn-xs m-r-5"
                                  data-toggle="tooltip" data-original-title="Edit">
                                  <i className="fa fa-pencil font-14" onClick={() => openOrderModal(item.orderId)} /></button></span>
                              </div>
                              <div className="font-13">Khách hàng: {item.reservation?.customer?.name}</div>
                            </div>
                          </li>
                        </ul>
                      </>
                    )
                    )
                  }
                  {
                    currentOrders.length === 0 && (
                      <>
                        <p className="text-center mt-3" style={{ fontStyle: 'italic', color: 'gray' }}>Không có</p>
                      </>
                    )
                  }
                </div>
                <div className="ibox-footer text-center">
                  <Link to={`/list-order`}>Xem tất cả</Link>
                </div>
              </div>
            </div>
          </div>

        </div>
        <Footer />
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
                          <p className="mb-1"><strong className='mr-2'>Cần thanh toán:</strong> 0 VND</p>
                        )}
                        {reservation.isPrePaid === false && (
                          <p className="mb-1"><strong className='mr-2'>Cần thanh toán:</strong> {reservation.totalAmount} VND</p>
                        )}

                      </div>
                      {/* Divider */}
                      <div className="col-md-12">
                        <hr />
                      </div>
                      <div className="col-md-12" style={{ textAlign: 'left' }}>
                        <h5><i className="fa fa-clock-o text-primary" aria-hidden="true"></i> Tiền phòng: <span style={{ fontWeight: 'bold' }}>{reservation.totalAmount}</span></h5>
                      </div>
                      {/* Divider */}
                      <div className="col-md-12">
                        <hr />
                      </div>
                      <div className="col-md-12" style={{ textAlign: 'left' }}>
                        <h5><i className="fa fa-life-ring text-danger" aria-hidden="true"></i> Tiền dịch vụ: <span style={{ fontWeight: 'bold' }}>{orderDetailList.reduce((total, item) => total + (item.order?.totalAmount || 0), 0)
                        }</span></h5>
                        <div className="table-responsive">
                          <table className="table table-borderless table-hover table-wrap table-centered">
                            <thead>
                              <tr>
                                <th><span>STT</span></th>
                                <th><span>Hình ảnh</span></th>
                                <th><span>Tên dịch vụ</span></th>
                                <th><span>Số lượng</span></th>
                                <th><span>Loại dịch vụ</span></th>
                                <th><span>Giá (VND)</span></th>
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
                                          <td>{item.order?.totalAmount}</td>
                                        </>
                                      )
                                    }
                                    {
                                      item.service?.serviceType?.serviceTypeName !== "Trả phòng muộn" && (
                                        <>
                                          <td>{item.order?.totalAmount}</td>
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
                            <span style={{ fontWeight: 'bold' }}>Tổng cộng: &nbsp;</span>
                            {orderDetailList.reduce((total, item) => total + (item.order?.totalAmount || 0), 0)
                              + (reservation.isPrePaid === false ? reservation.totalAmount : 0)} VND
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
                                <th><span>Tổng số tiền</span></th>
                                <th><span>Trạng thái</span></th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                billByReservation && (
                                  <tr>
                                    <td>1</td>
                                    <td>{new Date(billByReservation.createdDate).toLocaleString('en-US')}</td>
                                    <td>{billByReservation.totalAmount}</td>
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
                                <p className='text-center' style={{ fontStyle: 'italic', color: 'gray' }}>Không có</p>
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
              </form>
            </div>
          </div>
        </div>
      )}
      {
        showModalOrder && (
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
            <div className="modal-dialog modal-dialog-scrollable modal-xl" role="document">
              <div className="modal-content">
                <form>

                  <div className="modal-header bg-dark text-light">
                    <h5 className="modal-title">Thông Tin Yêu Cầu</h5>
                    <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalOrder}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', textAlign: 'left' }}>
                    <div className="table-responsive">
                      <table className="table table-borderless table-hover table-wrap table-centered">
                        <thead>
                          <tr>
                            <th><span>STT</span></th>
                            <th><span>Hình ảnh</span></th>
                            <th><span>Tên dịch vụ</span></th>
                            <th><span>Số lượng</span></th>
                            <th><span>Loại dịch vụ</span></th>
                            <th><span>Giá (VND)</span></th>
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
                                      <td>{item.order?.totalAmount}</td>
                                    </>
                                  )
                                }
                                {
                                  item.service?.serviceType?.serviceTypeName !== "Trả phòng muộn" && (
                                    <>
                                      <td>{item.order?.totalAmount}</td>
                                    </>
                                  )
                                }
                              </tr>
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
        )
      }
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
                        <p className="mb-1"><strong className='mr-2'>Lịch sử phòng:</strong> </p>
                        <div className="room-list">
                          {roomStayHistoryList.map((roomStayHistory) => (
                            <div
                              key={roomStayHistory.room?.roomNumber}
                              onClick={() => openRoomModal(roomStayHistory.roomId)}
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
                          <p className="mb-1"><strong className='mr-2'>Cần thanh toán:</strong> 0 VND</p>
                        )}
                        {reservation.isPrePaid === false && (
                          <p className="mb-1"><strong className='mr-2'>Cần thanh toán:</strong> {reservation.totalAmount} VND</p>
                        )}

                      </div>
                      {/* Divider */}
                      <div className="col-md-12">
                        <hr />
                      </div>
                      <div className="col-md-12" style={{ textAlign: 'left' }}>
                        <h5><i className="fa fa-clock-o text-primary" aria-hidden="true"></i> Tiền phòng: <span style={{ fontWeight: 'bold' }}>{reservation.totalAmount}</span></h5>
                      </div>
                      <div className="col-md-12">
                        <hr />
                      </div>
                      <div className="col-md-12" style={{ textAlign: 'left' }}>
                        <h5><i className="fa fa-life-ring text-danger" aria-hidden="true"></i> Tiền dịch vụ: <span style={{ fontWeight: 'bold' }}>{orderDetailList.reduce((total, item) => total + (item.order?.totalAmount || 0), 0)
                        }</span></h5>
                        <div className="table-responsive">
                          <table className="table table-borderless table-hover table-wrap table-centered">
                            <thead>
                              <tr>
                                <th><span>STT</span></th>
                                <th><span>Hình ảnh</span></th>
                                <th><span>Tên dịch vụ</span></th>
                                <th><span>Số lượng</span></th>
                                <th><span>Loại dịch vụ</span></th>
                                <th><span>Giá (VND)</span></th>
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
                                          <td>{item.order?.totalAmount}</td>
                                        </>
                                      )
                                    }
                                    {
                                      item.service?.serviceType?.serviceTypeName !== "Trả phòng muộn" && (
                                        <>
                                          <td>{item.order?.totalAmount}</td>
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
                            <span style={{ fontWeight: 'bold' }}>Tổng cộng: &nbsp;</span>
                            {orderDetailList.reduce((total, item) => total + (item.order?.totalAmount || 0), 0)
                              + (reservation.isPrePaid === false ? reservation.totalAmount : 0)} VND
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
                                <th><span>Tổng số tiền</span></th>
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
                                    <td>{billByReservation.totalAmount}</td>
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
                                <p className='text-center' style={{ fontStyle: 'italic', color: 'gray' }}>Không có</p>
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
              </form>
            </div>
          </div>
        </div>
      )}

      {showModalRoom && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
            <div className="modal-content shadow-lg rounded">
              <div className="modal-header bg-dark text-light">
                <h5 className="modal-title">Chi Tiết Phòng</h5>
                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalRoom}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto', textAlign: 'left' }}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      <h5 className="mb-3">
                        <span style={{ color: '#00796b', fontWeight: 'bold', fontSize: '1.25rem' }}>Phòng số:</span>
                        <span style={{ fontWeight: 'bold', color: '#388e3c', marginLeft: '10px' }}>{room.roomNumber}</span>
                      </h5>

                      <h5 className="mb-3">
                        <span style={{ color: '#00796b', fontWeight: 'bold', fontSize: '1.25rem' }}>Loại phòng:</span>
                        <span style={{ fontWeight: 'bold', color: '#388e3c', marginLeft: '10px' }}>{room.roomType?.type?.typeName}</span>
                      </h5>

                      <h5 className="mb-3">
                        <span style={{ color: '#00796b', fontWeight: 'bold', fontSize: '1.25rem' }}>Trạng thái:</span>
                        <span style={{ marginLeft: '10px' }}>
                          {room.status === "Available" && (
                            <span style={{ backgroundColor: '#4caf50', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>Có sẵn</span>
                          )}
                          {room.status === "Occupied" && (
                            <span style={{ backgroundColor: '#f44336', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>Không có sẵn</span>
                          )}
                          {room.status === "Maintenance" && (
                            <span style={{ backgroundColor: '#ff9800', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>Bảo trì</span>
                          )}
                        </span>
                      </h5>

                      <h5 className="mb-3">
                        <span style={{ color: '#00796b', fontWeight: 'bold', fontSize: '1.25rem' }}>Ghi chú:</span>
                        <div style={{ marginTop: '8px', paddingLeft: '20px', fontStyle: 'italic', color: 'gray' }}
                          dangerouslySetInnerHTML={{ __html: room.note ?? 'Không có' }}
                        ></div>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalRoom} >Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModalCreateBillTransactionImage && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
          <div className="modal-dialog modal-dialog-scrollable modal-xl" role="document">
            <div className="modal-content">
              <form>

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
              </form>

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
  width: 70px;
  height: 70px;
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

export default ReceptionistHome