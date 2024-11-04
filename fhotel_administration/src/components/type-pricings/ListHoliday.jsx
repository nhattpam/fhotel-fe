import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import holidayPricingService from '../../services/holiday-pricing.service';

const ListHoliday = () => {
    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING
    //call list hotel registration
    const [holidayList, setHolidayList] = useState([]);
    const [holidaySearchTerm, setHolidaySearchTerm] = useState('');
    const [currentHolidayPage, setCurrentHolidayPage] = useState(0);
    const [holidaysPerPage] = useState(10);


    useEffect(() => {
        holidayPricingService
            .getAllHolidayPricingRule()
            .then((res) => {
                setHolidayList(res.data);
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



    //detail holiday modal 
    const [showModalHoliday, setShowModalHoliday] = useState(false);

    const [holiday, setHoliday] = useState({

    });

    // Set the start date to the first day of the current month
    const startDateOfMonth = new Date(2024, 10, 1); // November 1, 2024
    const startDayOfWeek = startDateOfMonth.getDay(); // Day of the week for November 1, 2024

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
            {/* START PAGE CONTENT */}
            <div className="page-heading">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="index.html"><i className="la la-home font-20" /></a>
                    </li>
                </ol>
            </div>
            <div className="page-content fade-in-up">
                {/* Header with search bar */}
                <div className="ibox">
                    <div className="ibox-head bg-dark text-light">
                        <div className="ibox-title">Danh Sách Ngày Lễ - Calendar View</div>
                        <div className="form-group">
                            <input 
                                id="demo-foo-search" 
                                type="text" 
                                placeholder="Tìm kiếm" 
                                className="form-control form-control-sm"
                                autoComplete="on" 
                                value={holidaySearchTerm}
                                onChange={handleHolidaySearch} 
                            />
                        </div>
                    </div>
                    {/* Calendar Container */}
                    <div className="ibox-body">
                        <div className="calendar-container" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, 1fr)',
                            gap: '0.5rem',
                            textAlign: 'center'
                        }}>
                            {/* Days of the week header */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} style={{ fontWeight: 'bold', padding: '0.5rem' }}>{day}</div>
                            ))}
                            
                            {/* Empty cells to align the first day of the month */}
                            {Array.from({ length: startDayOfWeek }).map((_, index) => (
                                <div key={`empty-${index}`} style={{ visibility: 'hidden' }} />
                            ))}

                            {/* Calendar cells */}
                            {Array.from({ length: 30 }, (_, index) => {
                                // Get the date for each cell
                                const dayInMonth = new Date(2024, 10, 1 + index); // Adjust for November 1

                                // Check if there is a holiday on this day
                                const holiday = currentHolidays.find(h => 
                                    new Date(h.holidayDate).toDateString() === dayInMonth.toDateString()
                                );

                                return (
                                    <div 
                                        key={index} 
                                        className="calendar-cell" 
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
                                            }}>
                                                <p><strong>{holiday.description}</strong></p>
                                                <p>Tăng Giá: {holiday.percentageIncrease}%</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {/* Pagination */}
                <div className='container-fluid'>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <ReactPaginate
                            previousLabel={<IconContext.Provider value={{ color: "#000", size: "14px" }}><AiFillCaretLeft /></IconContext.Provider>}
                            nextLabel={<IconContext.Provider value={{ color: "#000", size: "14px" }}><AiFillCaretRight /></IconContext.Provider>}
                            breakLabel={'...'}
                            breakClassName={'page-item'}
                            breakLinkClassName={'page-link'}
                            pageCount={pageHolidayCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handleHolidayPageClick}
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