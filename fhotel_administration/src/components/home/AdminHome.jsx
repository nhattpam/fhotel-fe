import { React, useState, useEffect, useRef } from "react";
import Header from '../Header'
import SideBar from '../SideBar'
import Footer from '../Footer'
import { Chart, PieController, ArcElement, registerables } from "chart.js";
import userService from "../../services/user.service";
import reservationService from "../../services/reservation.service";
import { Link } from "react-router-dom";
import hotelService from "../../services/hotel.service";
import walletService from "../../services/wallet.service";

const AdminHome = () => {
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
  const [userCount, setUserCount] = useState(0);
  const [hotelCount, setHotelCount] = useState(0);
  const [transactionList, setTransactionList] = useState([]);

  useEffect(() => {
    reservationService
      .getAllReservation()
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


    hotelService
      .getAllHotel()
      .then((res) => {
        setHotelCount(res.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
    userService
      .getAllUser()
      .then((res) => {
        setUserCount(res.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
    userService
      .getWalletByUser(loginUserId)
      .then((res) => {
        setWallet(res.data);
        walletService
          .getAllTransactionByWallet(res.data.walletId)
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
      })
      .catch((error) => {
        console.log(error);
      });

  }, [loginUserId]);

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
  const [wallet, setWallet] = useState({

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

  const pieChartRef = useRef(null);
  const areaChartRef = useRef(null);

  const [monthlyData, setMonthlyData] = useState([]);
  //area chart
  const fetchMonthlyData = async () => {
    try {
      const currentYear = new Date().getFullYear();

      // Initialize an array to store monthly data
      const monthlyData = Array(12).fill(0);

      // Iterate over each paid bill
      transactionList.forEach((transaction) => {
        const transactionDate = new Date(transaction.transactionDate);
        const transactionYear = transactionDate.getFullYear();
        const transactionMonth = transactionDate.getMonth();

        // Check if the bill belongs to the current year
        if (transactionYear === currentYear) {
          // Add 80% of the bill's total amount to the corresponding month's data
          monthlyData[transactionMonth] += transaction.amount;
        }
      });

      setMonthlyData(monthlyData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const createAreaChart = () => {
    const areaChartCanvas = areaChartRef.current.getContext("2d");

    if (areaChartRef.current.chart) {
      areaChartRef.current.chart.destroy();
    }

    const data = {
      labels: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      datasets: [
        {
          label: "Thu nhập",
          data: monthlyData,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(54, 162, 235, 1)",
          pointBorderColor: "#fff",
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };

    const options = {
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            borderDash: [2],
            borderDashOffset: [2],
            drawBorder: false,
            color: "rgba(0, 0, 0, 0.05)",
            zeroLineColor: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            callback: (value) => {
              if (value >= 1000000) {
                return `${value}₫`;
              } else if (value >= 1000) {
                return `${value}₫`;
              }
              return `${value}₫`;
            },
          },
        },
      },
      plugins: {
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => {
              const label = context.dataset.label;
              const value = context.formattedValue;
              return `${label}: ${value}₫`;
            },
          },
        },
      },
    };

    areaChartRef.current.chart = new Chart(areaChartCanvas, {
      type: "line",
      data: data,
      options: options,
    });
  };


  useEffect(() => {
    if (monthlyData.length > 0) {
      createAreaChart();
    }
  }, [monthlyData]);

  useEffect(() => {
    if (transactionList.length > 0) {
      fetchMonthlyData();
      const sumForCurrentMonth = calculateSumByMonth(transactionList);
      setSumForCurrentMonth(sumForCurrentMonth);
      const sumForPreviousMonth = calculateSumByPreviousMonth(transactionList);
      setSumForPreviousMonth(sumForPreviousMonth);
    }
  }, [transactionList]);
 


  //end count reservation by admin

  //pie chart
  const [sumForCurrentMonth, setSumForCurrentMonth] = useState(0);
  const [sumForPreviousMonth, setSumForPreviousMonth] = useState(0);

  const calculateSumByPreviousMonth = (transactions) => {
    // Get the current date
    const currentDate = new Date();

    // Calculate the previous month
    let previousMonth = currentDate.getMonth() - 1;

    // Adjust the month if the previous month was in the previous year
    if (previousMonth < 0) {
      previousMonth = 11;
    }

    // Initialize the sum for the previous month
    let sumForPreviousMonth = 0;

    // Iterate over each transaction
    transactions.forEach((transaction) => {
      // Extract the month from the transaction date
      const transactionMonth = new Date(transaction.transactionDate).getMonth();

      // Check if the transaction belongs to the previous month
      if (transactionMonth === previousMonth) {
        sumForPreviousMonth += (transaction.amount);
      }
    });

    return sumForPreviousMonth;
  };

  const calculateSumByMonth = (transactions) => {
    // Get the current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    // Initialize the sum for the current month
    let sumForCurrentMonth = 0;

    // Iterate over each transaction
    transactions.forEach((transaction) => {
      // Extract the month from the transaction date
      const transactionDate = new Date(transaction.transactionDate);
      const transactionMonth = transactionDate.getMonth() + 1; // Add 1 to match the format of transaction month

      // Check if the transaction belongs to the current month
      if (transactionMonth === currentMonth + 1) { // Add 1 to match the format of current month
        sumForCurrentMonth += (transaction.amount); // Use the correct property name
      }
    });

    return sumForCurrentMonth;
  };

 

  const createPieChart = () => {
    const pieChartCanvas = pieChartRef.current.getContext("2d");

    if (pieChartRef.current.chart) {
      pieChartRef.current.chart.destroy();
    }

    const data = {
      labels: ["Tháng trước", "Tháng hiện tại"],
      datasets: [
        {
          data: [sumForPreviousMonth, sumForCurrentMonth],
          backgroundColor: ["#088F8F", "#7CFC00"],
          hoverBackgroundColor: ["#0047AB", "#008000"],
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => {
              const label = context.label;
              const value = context.formattedValue;
              return `${label}: ${value}₫`;
            },
          },
        },
      },
    };

    pieChartRef.current.chart = new Chart(pieChartCanvas, {
      type: "pie",
      data: data,
      options: options,
    });
  };

  useEffect(() => {
    if (sumForCurrentMonth !== 0 && sumForPreviousMonth !== 0) {
      createPieChart();
    }
  }, [sumForCurrentMonth, sumForPreviousMonth]);

  //END PIE CHART

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
                  <div className="m-b-5">TỔNG SỐ ĐẶT PHÒNG</div><i className="ti-bookmark-alt widget-stat-icon" />
                  {/* <div><i className="fa fa-level-up m-r-5" /><small>25% higher</small></div> */}
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="ibox bg-info color-white widget-stat">
                <div className="ibox-body">
                  <h2 className="m-b-5 font-strong">{hotelCount}</h2>
                  <div className="m-b-5">TỐNG SỐ KHÁCH SẠN</div><i className="ti-bar-chart widget-stat-icon" />
                  {/* <div><i className="fa fa-level-up m-r-5" /><small>17% higher</small></div> */}
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="ibox bg-warning color-white widget-stat">
                <div className="ibox-body">
                  <h2 className="m-b-5 font-strong">{wallet.balance}₫</h2>
                  <div className="m-b-5">THU NHẬP</div><i className="fa fa-money widget-stat-icon" />
                  {/* <div><i className="fa fa-level-up m-r-5" /><small>22% higher</small></div> */}
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="ibox bg-danger color-white widget-stat">
                <div className="ibox-body">
                  <h2 className="m-b-5 font-strong">{userCount}</h2>
                  <div className="m-b-5">TỐNG SỐ TÀI KHOẢN</div><i className="ti-user widget-stat-icon" />
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
                      <h3 className="m-0">Thống kê</h3>
                      {/* <div>Your shop sales analytics</div> */}
                    </div>
                    <div className="d-inline-flex">
                      {/* <div className="px-3" style={{ borderRight: '1px solid rgba(0,0,0,.1)' }}>
                        <div className="text-muted">WEEKLY INCOME</div>
                        <div>
                          <span className="h2 m-0">$850</span>
                          <span className="text-success ml-2"><i className="fa fa-level-up" /> +25%</span>
                        </div>
                      </div>
                      <div className="px-3">
                        <div className="text-muted">WEEKLY SALES</div>
                        <div>
                          <span className="h2 m-0">240</span>
                          <span className="text-warning ml-2"><i className="fa fa-level-down" /> -12%</span>
                        </div>
                      </div> */}
                    </div>
                  </div>
                  <div>
                    {/* <canvas id="bar_chart" style={{ height: 260 }} /> */}
                    <div className="chart-area">
                      <canvas ref={areaChartRef} id="myAreaChart2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="ibox">
                <div className="ibox-head">
                  <div className="ibox-title">So sánh</div>
                </div>
                <div className="ibox-body">
                  <div className="row align-items-center">
                      <canvas ref={pieChartRef} id="myPieChart3"></canvas>
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
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="ibox">
                <div className="ibox-head">
                  <div className="ibox-title">Best Sellers</div>
                </div>
                <div className="ibox-body">
                  <ul className="media-list media-list-divider m-0">
                    <li className="media">
                      <a className="media-img" href="javascript:;">
                        <img src="./assets/img/image.jpg" width="50px;" />
                      </a>
                      <div className="media-body">
                        <div className="media-heading">
                          <a href="javascript:;">Samsung</a>
                          <span className="font-16 float-right">1200</span>
                        </div>
                        <div className="font-13">Lorem Ipsum is simply dummy text.</div>
                      </div>
                    </li>
                    <li className="media">
                      <a className="media-img" href="javascript:;">
                        <img src="./assets/img/image.jpg" width="50px;" />
                      </a>
                      <div className="media-body">
                        <div className="media-heading">
                          <a href="javascript:;">iPhone</a>
                          <span className="font-16 float-right">1150</span>
                        </div>
                        <div className="font-13">Lorem Ipsum is simply dummy text.</div>
                      </div>
                    </li>
                    <li className="media">
                      <a className="media-img" href="javascript:;">
                        <img src="./assets/img/image.jpg" width="50px;" />
                      </a>
                      <div className="media-body">
                        <div className="media-heading">
                          <a href="javascript:;">iMac</a>
                          <span className="font-16 float-right">800</span>
                        </div>
                        <div className="font-13">Lorem Ipsum is simply dummy text.</div>
                      </div>
                    </li>
                    <li className="media">
                      <a className="media-img" href="javascript:;">
                        <img src="./assets/img/image.jpg" width="50px;" />
                      </a>
                      <div className="media-body">
                        <div className="media-heading">
                          <a href="javascript:;">apple Watch</a>
                          <span className="font-16 float-right">705</span>
                        </div>
                        <div className="font-13">Lorem Ipsum is simply dummy text.</div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="ibox-footer text-center">
                  <a href="javascript:;">View All Products</a>
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
                              + (reservation.paymentStatus === "Not Paid" ? reservation.totalAmount : 0)} VND
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

export default AdminHome