import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import userService from '../../services/user.service';

const HotelRevenuePolicy = () => {
    const loginUserId = sessionStorage.getItem('userId');
    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING
    //call list revenuePolicy registration
    const [revenuePolicyList, setRevenuePolicyList] = useState([]);
    const [revenuePolicySearchTerm, setRevenuePolicySearchTerm] = useState('');
    const [currentRevenuePolicyPage, setCurrentRevenuePolicyPage] = useState(0);
    const [revenuePolicysPerPage] = useState(10);


    useEffect(() => {
        userService
            .getAllRevenuePolicyByOwner(loginUserId)
            .then((res) => {

                const sortedRevenuePolicyList = [...res.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setRevenuePolicyList(sortedRevenuePolicyList);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });

    }, []);

    const [selectedHotelId, setSelectedHotelId] = useState('');
    const uniqueHotels = [...new Set(revenuePolicyList.map((revenue) => revenue.hotel?.hotelName))]
        .filter(Boolean);


    const handleRevenuePolicySearch = (event) => {
        setRevenuePolicySearchTerm(event.target.value);
    };

    const filteredRevenuePolicys = revenuePolicyList
        .filter((revenuePolicy) => {
            const matchesHotel = selectedHotelId ? revenuePolicy.hotel?.hotelName === selectedHotelId : true;
            const matchesSearchTerm = (
                revenuePolicy.adminPercentage.toString().toLowerCase().includes(revenuePolicySearchTerm.toLowerCase()) ||
                revenuePolicy.hotelPercentage.toString().toLowerCase().includes(revenuePolicySearchTerm.toLowerCase()) ||
                revenuePolicy.hotel?.code.toString().toLowerCase().includes(revenuePolicySearchTerm.toLowerCase()) ||
                revenuePolicy.hotel?.name.toString().toLowerCase().includes(revenuePolicySearchTerm.toLowerCase()) ||
                revenuePolicy.effectiveDate.toString().toLowerCase().includes(revenuePolicySearchTerm.toLowerCase()) ||
                revenuePolicy.expiryDate.toString().toLowerCase().includes(revenuePolicySearchTerm.toLowerCase())
            );
            return matchesHotel && matchesSearchTerm;
        });

    const pageRevenuePolicyCount = Math.ceil(filteredRevenuePolicys.length / revenuePolicysPerPage);

    const handleRevenuePolicyPageClick = (data) => {
        setCurrentRevenuePolicyPage(data.selected);
    };

    const offsetRevenuePolicy = currentRevenuePolicyPage * revenuePolicysPerPage;
    const currentRevenuePolicys = filteredRevenuePolicys.slice(offsetRevenuePolicy, offsetRevenuePolicy + revenuePolicysPerPage);



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
                            <div className="ibox-title">Danh Sách Chính sách Chia Doanh Thu</div>
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
                                        value={revenuePolicySearchTerm}
                                        onChange={handleRevenuePolicySearch}
                                    />
                                </div>

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
                                            <th><span>Hệ thống (%)</span></th>
                                            <th><span>Khách sạn (%)</span></th>
                                            <th><span>Ngày áp dụng</span></th>
                                            <th><span>Ngày kết thúc</span></th>
                                            <th><span>Ngày tạo</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentRevenuePolicys.length > 0 && currentRevenuePolicys.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.hotel?.code}</td>
                                                        <td>{item.hotel?.hotelName}</td>
                                                        <td>{item.adminPercentage}</td>
                                                        <td>{item.hotelPercentage}</td>
                                                        <td>{new Date(item.effectiveDate).toLocaleDateString('en-US')}</td>
                                                        <td>{new Date(item.expiryDate).toLocaleDateString('en-US')}</td>
                                                        <td>{new Date(item.createdDate).toLocaleString('en-US')}</td>
                                                    </tr>
                                                </>
                                            ))
                                        }


                                    </tbody>

                                </table>
                                {
                                    currentRevenuePolicys.length === 0 && (
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
                                pageCount={pageRevenuePolicyCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handleRevenuePolicyPageClick}
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

export default HotelRevenuePolicy