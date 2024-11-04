import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import holidayPricingService from '../../services/holiday-pricing.service';
import holidayService from '../../services/holiday.service';
import districtService from '../../services/district.service';

const ListHoliday = () => {
    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING
    //call list hotel registration
    const [holidayList, setHolidayList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [holidaySearchTerm, setHolidaySearchTerm] = useState('');
    const [currentHolidayPage, setCurrentHolidayPage] = useState(0);
    const [holidaysPerPage] = useState(10);


    useEffect(() => {
        holidayService
            .getAllHoliday()
            .then((res) => {
                setHolidayList(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
        districtService
            .getAllDistrict()
            .then((res) => {
                setDistrictList(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });

    }, []);


    const handleHolidaySearch = (event) => {
        setHolidaySearchTerm(event.target.value);
    };

    const filteredHolidays = holidayList
        .filter((holiday) => {
            return (
                holiday.holidayDate.toString().toLowerCase().includes(holidaySearchTerm.toLowerCase())
            );
        });

    const pageHolidayCount = Math.ceil(filteredHolidays.length / holidaysPerPage);

    const handleHolidayPageClick = (data) => {
        setCurrentHolidayPage(data.selected);
    };

    const offsetHoliday = currentHolidayPage * holidaysPerPage;
    const currentHolidays = filteredHolidays.slice(offsetHoliday, offsetHoliday + holidaysPerPage);



    // State for current month and year
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0 for January, 11 for December
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // Calculate the start date and day of week for the current month
    const startDateOfMonth = new Date(currentYear, currentMonth, 1);
    const startDayOfWeek = startDateOfMonth.getDay(); // Day of the week for the 1st day of the month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Total days in the current month

    // Filter holidays for the current month and year
    const holidaysInMonth = currentHolidays.filter(holiday => {
        const holidayDate = new Date(holiday.holidayDate);
        return holidayDate.getMonth() === currentMonth && holidayDate.getFullYear() === currentYear;
    });

    // Navigation functions for changing months
    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const [showModalHoliday, setShowModalHoliday] = useState(false);
    const [holidayPricingRuleList, setHolidayPricingRuleList] = useState(false);


    const openHolidayModal = (holidayId) => {
        if (!holidayId) {
            alert("Holiday ID is required.");
            return; // Exit the function early if holidayId is null or undefined
        }

        setShowModalHoliday(true);

        holidayService
            .getAllHolidayPricingRuleById(holidayId)
            .then((res) => {
                setHolidayPricingRuleList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };


    const closeModalHoliday = () => {
        setShowModalHoliday(false);
        setHolidayPricingRuleList([]);
    };

    //CREATE HOLIDAY
    const [showModalCreateHolidayPricing, setShowModalCreateHolidayPricing] = useState(false);

    const openCreateHolidayPricingModal = () => {
        setShowModalCreateHolidayPricing(true);

    };

    const closeModalCreateHolidayPricing = () => {
        setShowModalCreateHolidayPricing(false);
    };

    const [createHolidayPricing, setCreateHolidayPricing] = useState({
        districtId: '',
        holidayId: '',
        percentageIncrease: 0,
    });


    const handleChange2 = (e) => {
        const value = e.target.value;

        setCreateHolidayPricing({ ...createHolidayPricing, [e.target.name]: value });
    };
    const validateForm2 = () => {
        let isValid = true;
        const newError = {};


        setError(newError); // Set the validation errors
        setShowError(Object.keys(newError).length > 0); // Toggle error visibility based on errors
        return isValid;
    };

    const submitCreateHolidayPricing = async (e) => {
        e.preventDefault();

        // Run validation before submitting
        if (!validateForm2()) {
            return; // Stop the function if validation fails
        }


        try {

            console.log(JSON.stringify(createHolidayPricing))
            const holidayPricingResponse = await holidayPricingService.saveHolidayPricingRule(createHolidayPricing);
            if (holidayPricingResponse.status === 201) {
                setSuccess({ general: 'Tạo thành công!' });
                setShowSuccess(true);
            }else{
                handleResponseError(holidayPricingResponse);

            }
        } catch (error) {
            handleResponseError(error.response);
            // You can show a user-friendly message here
        }
    };


    const [error, setError] = useState({}); // State to hold error messages
    const [showError, setShowError] = useState(false); // State to manage error visibility
    const [showSuccess, setShowSuccess] = useState(false);
    const [success, setSuccess] = useState({});
    // Effect to handle error message visibility
    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => {
                setShowError(false); // Hide the error after 2 seconds
            }, 2000); // Change this value to adjust the duration
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [showError]); // Only run effect if showError changes

    //notification after creating
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
                <div className="page-heading">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="index.html"><i className="la la-home font-20" /></a>
                        </li>
                    </ol>
                </div>
                <div className="page-content fade-in-up">
                    <div className="ibox">
                        <div className="ibox-head bg-dark text-light">
                            <div className="ibox-title">Danh Sách Ngày Lễ - {startDateOfMonth.toLocaleString('default', { month: 'long' })} {currentYear}</div>
                            <div className="form-group">

                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                <button
                                    className="btn btn-primary mr-3 btn-sm"
                                    onClick={openCreateHolidayPricingModal}
                                >
                                    Thêm ngày lễ
                                </button>
                                <button onClick={goToPreviousMonth} >
                                    <i className="fa fa-chevron-left" aria-hidden="true"></i>
                                </button>
                                <button onClick={goToNextMonth}>
                                    <i className="fa fa-chevron-right" aria-hidden="true"></i>
                                </button>

                            </div>

                        </div>
                        <div className="ibox-body">
                            <div className="calendar-container" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, 1fr)',
                                gap: '0.5rem',
                                textAlign: 'center'
                            }}>
                                {['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'].map(day => (
                                    <div key={day} style={{ fontWeight: 'bold', padding: '0.5rem' }}>{day}</div>
                                ))}

                                {/* Empty cells for days before the 1st */}
                                {Array.from({ length: startDayOfWeek }).map((_, index) => (
                                    <div key={`empty-${index}`} style={{ visibility: 'hidden' }} />
                                ))}

                                {/* Calendar cells for each day in the current month */}
                                {Array.from({ length: daysInMonth }, (_, index) => {
                                    const dayInMonth = new Date(currentYear, currentMonth, index + 1);

                                    const holiday = holidaysInMonth.find(h =>
                                        new Date(h.holidayDate).toDateString() === dayInMonth.toDateString()
                                    );

                                    return (
                                        <div
                                            key={index}
                                            className="calendar-cell"
                                            onClick={() => holiday ? openHolidayModal(holiday.holidayId) : alert("Không có.")}
                                            style={{
                                                border: '1px solid #ddd',
                                                borderRadius: '5px',
                                                padding: '0.75rem',
                                                minHeight: '100px',
                                                backgroundColor: holiday ? '#f0f9ff' : '#fff',
                                                position: 'relative'
                                            }}
                                        >
                                            <div style={{ fontWeight: 'bold' }}>{dayInMonth.getDate()}</div>

                                            {holiday && (
                                                <div className="holiday-info" style={{
                                                    marginTop: '0.5rem',
                                                    textAlign: 'left',
                                                    fontSize: '0.85rem'
                                                }} >
                                                    <p><strong>{holiday.description}</strong></p>
                                                    {/* <p>Tăng Giá: {holiday.percentageIncrease}%</p> */}
                                                </div>
                                            )}
                                        </div>
                                    );

                                })}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {showModalHoliday && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                        <div className="modal-content">
                            <form>

                                <div className="modal-header  bg-dark text-light">
                                    <h5 className="modal-title">Thông Tin Ngày Lễ</h5>
                                    <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalHoliday}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>

                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        <div className='col-md-12' style={{ textAlign: 'left' }}>
                                            <div className="table-responsive">
                                                <table className="table table-borderless table-hover table-wrap table-centered">
                                                    <thead>
                                                        <tr>
                                                            <th><span>STT</span></th>
                                                            <th><span>Quận</span></th>
                                                            <th><span>Tăng (%)</span></th>
                                                            <th><span>Ngày lễ</span></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            holidayPricingRuleList.length > 0 && holidayPricingRuleList.map((item, index) => (
                                                                <>
                                                                    <tr>
                                                                        <td>{index + 1}</td>
                                                                        <td>{item.district?.districtName}</td>
                                                                        <td>{item.percentageIncrease}</td>
                                                                        <td> {item.holiday?.description}</td>

                                                                    </tr>
                                                                </>
                                                            ))
                                                        }


                                                    </tbody>
                                                </table>

                                            </div>
                                            {
                                                holidayPricingRuleList.length === 0 && (
                                                    <p className='text-center' style={{ color: 'gray' }}>Không có</p>
                                                )
                                            }
                                        </div>
                                    </div>


                                </div>
                                <div className="modal-footer">
                                    {/* <button type="button" className="btn btn-custom">Save</button> */}
                                    <button type="button" className="btn btn-dark btn-sm" onClick={closeModalHoliday} >Đóng</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )}

            {
                showModalCreateHolidayPricing && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-dialog-scrollable modal-xl" role="document">
                            <div className="modal-content">
                                <form
                                    method="post"
                                    id="createHolidayPricingForm"
                                    data-parsley-validate
                                    onSubmit={(e) => submitCreateHolidayPricing(e)}
                                    style={{ textAlign: "left" }}
                                >
                                    <div className="modal-header bg-dark text-light">
                                        <h5 className="modal-title">Tạo Ngày Lễ</h5>
                                        <button
                                            type="button"
                                            className="close text-light"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                            onClick={closeModalCreateHolidayPricing}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                        {showSuccess && Object.entries(success).length > 0 && (
                                            <div className="success-messages" style={{ position: 'absolute', top: '10px', right: '10px', background: 'green', color: 'white', padding: '10px', borderRadius: '5px' }}>
                                                {Object.entries(success).map(([key, message]) => (
                                                    <p key={key} style={{ margin: '0' }}>{message}</p>
                                                ))}
                                            </div>
                                        )}
                                        {showError && Object.entries(error).length > 0 && (
                                            <div className="error-messages" style={{ position: 'absolute', top: '10px', right: '10px', background: 'red', color: 'white', padding: '10px', borderRadius: '5px' }}>
                                                {Object.entries(error).map(([key, message]) => (
                                                    <p key={key} style={{ margin: '0' }}>{message}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                        <h4 className="header-title">Thông Tin Ngày Lễ</h4>
                                        <div className="form-row">
                                            {/* Holiday Date Field */}
                                            <div className="form-group col-md-6">
                                                <label htmlFor="holidayId">Ngày Lễ</label> <span className='text-danger'>*</span>
                                                <select
                                                    name="holidayId"
                                                    className="form-control"
                                                    value={createHolidayPricing.holidayId}
                                                    onChange={(e) => handleChange2(e)}
                                                    required
                                                >
                                                    <option value="">Chọn Ngày</option>
                                                    {holidayList.map((holiday) => (
                                                        <option key={holiday.holidayId} value={holiday.holidayId}>
                                                            {holiday.description}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Percentage Increase Field */}
                                            <div className="form-group col-md-6">
                                                <label htmlFor="percentageIncrease">Tăng Giá (%)</label> <span className='text-danger'>*</span>
                                                <select
                                                    className="form-control"
                                                    id="percentageIncrease"
                                                    name="percentageIncrease"
                                                    value={createHolidayPricing.percentageIncrease}
                                                    onChange={(e) => handleChange2(e)}
                                                    required
                                                >
                                                    <option value="">Chọn mức tăng</option>
                                                    {[...Array(18)].map((_, i) => (
                                                        <option key={i} value={(i + 1) * 5}>
                                                            {(i + 1) * 5}%
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                        </div>

                                        <div className="form-row">
                                            {/* Description Field */}
                                            <div className="form-group col-md-12">
                                                <label>Quận</label> <span className='text-danger'>*</span>
                                                <select
                                                    name="districtId"
                                                    className="form-control"
                                                    value={createHolidayPricing.districtId}
                                                    onChange={(e) => handleChange2(e)}
                                                    required
                                                >
                                                    <option value="">Chọn Quận/Huyện</option>
                                                    {districtList.map((district) => (
                                                        <option key={district.districtId} value={district.districtId}>
                                                            {district.districtName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary btn-sm">Lưu</button>
                                        <button type="button" className="btn btn-dark btn-sm" onClick={closeModalCreateHolidayPricing}>Đóng</button>
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

export default ListHoliday