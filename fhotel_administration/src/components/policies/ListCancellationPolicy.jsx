import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import roleService from '../../services/role.service';
import { Link } from 'react-router-dom';
import cancellationPolicyService from '../../services/cancellation-policy.service';
import hotelService from '../../services/hotel.service';

const ListCancellationPolicy = () => {
  //LOADING
  const [loading, setLoading] = useState(true); // State to track loading

  //LOADING
  //call list cancellationPolicy registration
  const [cancellationPolicyList, setCancellationPolicyList] = useState([]);
  const [hotelList, setHotelList] = useState([]);
  const [cancellationPolicySearchTerm, setCancellationPolicySearchTerm] = useState('');
  const [currentCancellationPolicyPage, setCurrentCancellationPolicyPage] = useState(0);
  const [cancellationPolicysPerPage] = useState(10);


  useEffect(() => {
    cancellationPolicyService
      .getAllCancellationPolicy()
      .then((res) => {

        const sortedCancellationPolicyList = [...res.data].sort((a, b) => {
          // Assuming requestedDate is a string in ISO 8601 format
          return new Date(b.createdDate) - new Date(a.createdDate);
        });
        setCancellationPolicyList(sortedCancellationPolicyList);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
    hotelService
      .getAllHotel()
      .then((res) => {
        const sortedHotelList = [...res.data].sort((a, b) => {
          // Assuming requestedDate is a string in ISO 8601 format
          return new Date(b.createdDate) - new Date(a.createdDate);
        });
        setHotelList(sortedHotelList);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [selectedHotelId, setSelectedHotelId] = useState('');
  const uniqueHotels = [...new Set(cancellationPolicyList.map((revenue) => revenue.hotel?.hotelName))]
    .filter(Boolean);

  const handleCancellationPolicySearch = (event) => {
    setCancellationPolicySearchTerm(event.target.value);
  };

  const filteredCancellationPolicys = cancellationPolicyList
    .filter((cancellationPolicy) => {
      const matchesHotel = selectedHotelId ? cancellationPolicy.hotel?.hotelName === selectedHotelId : true;
      const matchesSearchTerm = (
        cancellationPolicy.refundPercentage.toString().toLowerCase().includes(cancellationPolicySearchTerm.toLowerCase()) ||
        cancellationPolicy.cancellationDays.toString().toLowerCase().includes(cancellationPolicySearchTerm.toLowerCase()) ||
        cancellationPolicy.hotel?.code.toString().toLowerCase().includes(cancellationPolicySearchTerm.toLowerCase()) ||
        cancellationPolicy.hotel?.name.toString().toLowerCase().includes(cancellationPolicySearchTerm.toLowerCase()) ||
        cancellationPolicy.cancellationTime.toString().toLowerCase().includes(cancellationPolicySearchTerm.toLowerCase())
      );
      return matchesHotel && matchesSearchTerm;
    });

  const pageCancellationPolicyCount = Math.ceil(filteredCancellationPolicys.length / cancellationPolicysPerPage);

  const handleCancellationPolicyPageClick = (data) => {
    setCurrentCancellationPolicyPage(data.selected);
  };

  const offsetCancellationPolicy = currentCancellationPolicyPage * cancellationPolicysPerPage;
  const currentCancellationPolicys = filteredCancellationPolicys.slice(offsetCancellationPolicy, offsetCancellationPolicy + cancellationPolicysPerPage);



  //create cancellationPolicy cancellationPolicy modal
  const [createCancellationPolicy, setCreateCancellationPolicy] = useState({
    hotelId: "",
    refundPercentage: "",
    cancellationDays: "",
    cancellationTime: "",

  });
  const [showModalCreateCancellationPolicy, setShowModalCreateCancellationPolicy] = useState(false);

  const openCreateCancellationPolicyModal = () => {
    setShowModalCreateCancellationPolicy(true);

  };

  const closeModalCreateCancellationPolicy = () => {
    setShowModalCreateCancellationPolicy(false);
  };


  const [error, setError] = useState({}); // State to hold error messages
  const [showError, setShowError] = useState(false); // State to manage error visibility
  const [showSuccess, setShowSuccess] = useState(false);
  const [success, setSuccess] = useState({});


  const handleChange = (e) => {
    const value = e.target.value;
    setCreateCancellationPolicy({ ...createCancellationPolicy, [e.target.name]: value });
  };

  const validateForm = () => {
    let isValid = true;
    const newError = {}; // Create a new error object

    // Validate Last Name
    if (createCancellationPolicy.hotelId.trim() === "") {
      newError.hotelId = "Hotel là bắt buộc";
      isValid = false;
    }

    // Validate Address
    if (createCancellationPolicy.refundPercentage.trim() === "") {
      newError.refundPercentage = "Phần trăm hoàn tiền là bắt buộc";
      isValid = false;
    }
    // Validate Phone
    if (createCancellationPolicy.cancellationDays.trim() === "") {
      newError.cancellationDays = "Số ngày trước khi hủy là bắt buộc";
      isValid = false;
    }

    if (createCancellationPolicy.cancellationTime.trim() === "") {
      newError.cancellationTime = "Thời gian hủy tối đa trong ngày là bắt buộc";
      isValid = false;
    }



    setError(newError); // Set the new error object
    setShowError(Object.keys(newError).length > 0); // Show error if there are any
    return isValid;
  };

  const handleInputChangeHotel = (e) => {
    const value = e.target.value;
    setCreateCancellationPolicy({ ...createCancellationPolicy, [e.target.name]: value });
  };

  const convertToTimeSpan = (timeString) => {
    if (!timeString) return null;

    // Ensure the input is in "HH:mm" format
    const [hours, minutes] = timeString.split(":").map(Number);

    // Convert to a C# TimeSpan-compatible string
    return `PT${hours}H${minutes}M`;
  };


  const submitCancellationPolicy = async (e) => {
    e.preventDefault();
    setError({}); // Reset any previous errors
    setShowError(false); // Hide error before validation


    if (validateForm()) {
      try {
        console.log(JSON.stringify(createCancellationPolicy))
        const cancellationPolicyResponse = await cancellationPolicyService.saveCancellationPolicy(createCancellationPolicy);

        if (cancellationPolicyResponse.status === 201) {
          setSuccess({ general: "Tạo thành công!." });
          setShowSuccess(true); // Show error
          cancellationPolicyService
            .getAllCancellationPolicy()
            .then((res) => {

              const sortedCancellationPolicyList = [...res.data].sort((a, b) => {
                // Assuming requestedDate is a string in ISO 8601 format
                return new Date(b.createdDate) - new Date(a.createdDate);
              });
              setCancellationPolicyList(sortedCancellationPolicyList);
              setLoading(false);
            })
            .catch((error) => {
              console.log(error);
              setLoading(false);
            });
        } else {
          handleResponseError(error.response);
          return;
        }

      } catch (error) {
        console.log(error);
        handleResponseError(error.response);
      }
    }


  };
  // Effect to handle error message visibility
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false); // Hide the error after 2 seconds
      }, 2000); // Change this value to adjust the duration
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [showError]); // Only run effect if showError changes

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false); // Hide the error after 2 seconds
      }, 3000); // Change this value to adjust the duration
      // window.location.reload();
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [showSuccess]); // Only run effect if showError changes

  const handleResponseError = (response) => {
    if (response && response.status === 400) {
      const validationErrors = response.data.errors || [];
      setError({ validation: validationErrors });
    } else {
      setError({ general: "An unexpected error occurred. Please try again." });
    }
    setShowError(true); // Show error modal or message
  };

  //DELETE POLICY
  const deleteCancellationPolicy = (cancellationPolicyId) => {
    if (cancellationPolicyId) {
      cancellationPolicyService
        .deleteCancellationPolicy(cancellationPolicyId)
        .then((res) => {
          if (res.status === 200) {
            cancellationPolicyService
              .getAllCancellationPolicy()
              .then((res) => {

                const sortedCancellationPolicyList = [...res.data].sort((a, b) => {
                  // Assuming requestedDate is a string in ISO 8601 format
                  return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setCancellationPolicyList(sortedCancellationPolicyList);
                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
                setLoading(false);
              });
          }
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
              <div className="ibox-title">Danh Sách Chính sách Hoàn tiền</div>
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
                  <input
                    id="demo-foo-search"
                    type="text"
                    placeholder="Tìm kiếm"
                    className="form-control form-control-sm"
                    autoComplete="on"
                    value={cancellationPolicySearchTerm}
                    onChange={handleCancellationPolicySearch}
                  />
                </div>

                <button
                  className="btn btn-primary ml-3 btn-sm"
                  onClick={openCreateCancellationPolicyModal} // This will trigger the modal for creating a new cancellationPolicy
                >
                  <i class="fa fa-plus-square" aria-hidden="true"></i> Tạo chính sách
                </button>
              </div>
            </div>
            <div className="ibox-body">
              <div className="table-responsive">
                <table className="table table-borderless table-hover table-wrap table-centered">
                  <thead>
                    <tr>
                      <th><span>STT</span></th>
                      <th><span>Mã số khách sạn</span></th>
                      <th><span>Tên khách sạn</span></th>
                      <th><span>Phần trăm hoàn tiền (%)</span></th>
                      <th><span>Số ngày trước khi hủy</span></th>
                      <th><span>Thời gian hủy tối đa trong ngày</span></th>
                      <th><span>Ngày tạo</span></th>
                      <th><span>Hành động</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      currentCancellationPolicys.length > 0 && currentCancellationPolicys.map((item, index) => (
                        <>
                          <tr>
                            <td>{index + 1}</td>
                            <td>{item.hotel?.code}</td>
                            <td>{item.hotel?.hotelName}</td>
                            <td>{item.refundPercentage}</td>
                            <td>{item.cancellationDays}</td>
                            <td>{item.cancellationTime}</td>
                            <td>{new Date(item.createdDate).toLocaleString('en-US')}</td>

                            <td>
                              <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit">
                                <i className="fa fa-trash font-14 text-danger" onClick={() => deleteCancellationPolicy(item.cancellationPolicyId)} />
                              </button>

                            </td>
                          </tr>
                        </>
                      ))
                    }


                  </tbody>

                </table>
                {
                  currentCancellationPolicys.length === 0 && (
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
                pageCount={pageCancellationPolicyCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handleCancellationPolicyPageClick}
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




      {
        showModalCreateCancellationPolicy && (
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
            <div className="modal-dialog modal-dialog-scrollable modal-xl" role="document">

              <div className="modal-content">
                <form
                  method="post"
                  id="myAwesomeDropzone"
                  data-plugin="dropzone"
                  data-previews-container="#file-previews"
                  data-upload-preview-template="#uploadPreviewTemplate"
                  data-parsley-validate
                  onSubmit={(e) => submitCancellationPolicy(e)}
                  style={{ textAlign: "left" }}
                >
                  <div className="modal-header  bg-dark text-light">
                    <h5 className="modal-title">Tạo chính sách</h5>

                    <button
                      type="button"
                      className="close text-light"
                      data-dismiss="modal"
                      aria-label="Close"
                      onClick={closeModalCreateCancellationPolicy}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  {/* Display error message */}
                  {showError && Object.entries(error).length > 0 && (
                    <div className="error-messages" style={{ position: 'absolute', top: '10px', right: '10px', background: 'red', color: 'white', padding: '10px', borderRadius: '5px' }}>
                      {Object.entries(error).map(([key, message]) => (
                        <p key={key} style={{ margin: '0' }}>{message}</p>
                      ))}
                    </div>
                  )}
                  {showSuccess && Object.entries(success).length > 0 && (
                    <div className="success-messages" style={{ position: 'absolute', top: '10px', right: '10px', background: 'green', color: 'white', padding: '10px', borderRadius: '5px' }}>
                      {Object.entries(success).map(([key, message]) => (
                        <p key={key} style={{ margin: '0' }}>{message}</p>
                      ))}
                    </div>
                  )}

                  {/* Modal Body with scrollable content */}
                  <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>

                    {/* Form Fields */}
                    <h4 className="header-title ">Thông Tin</h4>
                    <div className="form-row">
                      <div className="form-group  col-md-12">
                        <label htmlFor="cancellationName">Khách sạn <span className='text-danger'>*</span> :</label>
                        <select
                          name="hotelId"
                          className="form-control"
                          value={createCancellationPolicy.hotelId}
                          onChange={(e) => handleInputChangeHotel(e)}
                          required
                        >
                          <option value="">Chọn khách sạn</option>
                          {hotelList.map((hotel) => (
                            <option key={hotel.hotelId} value={hotel.hotelId}>
                              {hotel.hotelName}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label htmlFor="password">Phần trăm hoàn tiền (%) <span className='text-danger'>*</span> :</label>
                        <input
                          type="number"
                          className="form-control"
                          name="refundPercentage"
                          id="refundPercentage"
                          value={createCancellationPolicy.refundPercentage}
                          onChange={(e) => handleChange(e)}
                          min={0}
                          max={100}
                          required
                        />
                      </div>

                      <div className="form-group col-md-6">
                        <label htmlFor="star">Số ngày trước khi hủy <span className='text-danger'>*</span> :</label>
                        <div className="input-group">
                          <select
                            className="form-control"
                            name="cancellationDays"
                            id="cancellationDays"
                            value={createCancellationPolicy.cancellationDays}
                            onChange={(e) => handleChange(e)}
                            required
                          >
                            <option value="" disabled>Chọn số ngày</option>
                            {Array.from({ length: 10 }, (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>

                        </div>
                      </div>

                      <div className="form-group col-md-6">
                        <label htmlFor="address">Thời gian hủy tối đa trong ngày <span className='text-danger'>*</span> :</label>
                        <div className="input-group">
                          <input
                            type="time"
                            className="form-control"
                            name="cancellationTime"
                            value={createCancellationPolicy.cancellationTime || ''}
                            onChange={(e) => handleChange(e)}
                            required
                          />
                        </div>
                      </div>


                    </div>



                  </div>

                  {/* Modal Footer */}
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-custom btn-sm"><i class="fa fa-floppy-o" aria-hidden="true"></i>                                         Lưu</button>
                    <button type="button" className="btn btn-dark btn-sm" onClick={closeModalCreateCancellationPolicy}>Đóng</button>
                  </div>
                </form>

              </div>
            </div>
          </div >

        )
      }


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

    .d-inline {
  display: inline-block;
  margin-right: 5px;
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

export default ListCancellationPolicy