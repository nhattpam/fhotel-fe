import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import userService from '../../services/user.service';
import { Link, useParams } from 'react-router-dom';
import billService from '../../services/bill.service';

const ListBill = () => {
  //LOADING
  const [loading, setLoading] = useState(true); // State to track loading

  //LOADING
  //get user information
  const loginUserId = sessionStorage.getItem('userId');

  const [billList, setBillList] = useState([]);
  const [billTransactionImageList, setBillTransactionImageList] = useState([]);
  const [billSearchTerm, setBillSearchTerm] = useState('');
  const [currentBillPage, setCurrentBillPage] = useState(0);
  const [billsPerPage] = useState(10);
  useEffect(() => {
    billService
      .getAllBill()
      .then((res) => {
        const sortedBillList = [...res.data].sort((a, b) => {
          // Assuming requestedDate is a string in ISO 8601 format
          return a.createdDate - b.createdDate; // Sort by billNumber in ascending order
        });
        setBillList(sortedBillList);
        setLoading(false);

      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

  }, []);

  const handleBillSearch = (event) => {
    setBillSearchTerm(event.target.value);
  };

  const filteredBills = billList.filter((bill) => {
    return (
      bill.billId.toString().toLowerCase().includes(billSearchTerm.toLowerCase())
    );
  });


  const pageBillCount = Math.ceil(filteredBills.length / billsPerPage);

  const handleBillPageClick = (data) => {
    setCurrentBillPage(data.selected);
  };

  const offsetBill = currentBillPage * billsPerPage;
  const currentBills = filteredBills.slice(offsetBill, offsetBill + billsPerPage);


  const [bill, setBill] = useState({

  });
  const [showModalBill, setShowModalBill] = useState(false);

  const openBillModal = (billId) => {
    setShowModalBill(true);
    if (billId) {
      billService
        .getBillById(billId)
        .then((res) => {
          setBill(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
      billService
        .getAllBillTransactionImageByBillId(billId)
        .then((res) => {
          setBillTransactionImageList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });

    }
  };
  const closeModalBill = () => {
    setShowModalBill(false);
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
        <div className="page-content fade-in-up">
          <div className="ibox">
            <div className="ibox-head bg-dark text-light">
              <div className="ibox-title">Danh sách hóa đơn</div>
            </div>
            <div className="ibox-body">
              <div className="table-responsive">
                <table className="table table-borderless table-hover table-wrap table-centered">
                  <thead>
                    <tr>
                      <th><span>STT</span></th>
                      <th><span>Mã đặt phòng</span></th>
                      <th><span>Tổng số tiền (₫)</span></th>
                      <th><span>Khách hàng</span></th>
                      <th><span>Ngày tạo</span></th>
                      <th><span>Trạng thái</span></th>
                      <th><span>Hành động</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      currentBills.length > 0 && currentBills.map((item, index) => (
                        <>
                          <tr>
                            <td>{index + 1}</td>
                            <td>{item.reservation?.code}</td>
                            <td>
                              {item.totalAmount}
                            </td>
                            <td>{item.reservation?.customer?.name}</td>
                            <td> {new Date(item.createdDate).toLocaleString('en-US')}</td>
                            <td>
                              {item.billStatus === "Not Paid" && (
                                <span className="badge label-table badge-warning">Chưa thanh toán</span>
                              )}
                              {item.billStatus === "Paid" && (
                                <span className="badge label-table badge-success">Đã thanh toán</span>
                              )}

                            </td>
                            <td>
                              <button className="btn btn-default btn-xs m-r-5"
                                data-toggle="tooltip" data-original-title="Edit">
                                <i className="fa fa-pencil font-14 text-primary"
                                  onClick={() => openBillModal(item.billId)} /></button>
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
        </div>
      </div>
      {showModalBill && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}
        >
          <div className="modal-dialog modal-dialog-scrollable modal-xl" role="document">
            <div className="modal-content">
              <div className="modal-header bg-dark text-light">
                <h5 className="modal-title">Thông Tin Hóa Đơn</h5>
                <button
                  type="button"
                  className="close text-light"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={closeModalBill}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                {/* Bill Information Section */}
                <div className="row" style={{ textAlign: 'left' }}>
                  <div className="col-md-12">
                    <h6 className="text-primary"> Chi tiết</h6>
                    <p><strong>Mã đặt phòng:</strong> {bill.reservation?.code || 'N/A'}</p>
                    <p><strong>Tổng số tiền:</strong> {bill.totalAmount}₫</p>
                    <p><strong>Ngày tạo:</strong> {new Date(bill.createdDate).toLocaleString()}</p>
                    <p><strong>Trạng thái:</strong> {
                      bill.billStatus === "Pending" && (
                        <>
                          <span className="badge label-table badge-warning">Đang chờ</span>
                        </>
                      )
                    }
                      {
                        bill.billStatus === "Paid" && (
                          <>
                            <span className="badge label-table badge-success">Đã thanh toán</span>
                          </>
                        )
                      }
                    </p>
                    <h6 className="text-primary"> Hình ảnh chuyển tiền</h6>
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
                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalBill}>
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
                    border-color: #20c997;
                }
                    .bill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.bill-box {
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

                                            `}
      </style>

    </>
  )
}

export default ListBill