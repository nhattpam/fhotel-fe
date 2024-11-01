import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import userService from '../../services/user.service';
import { Link, useParams } from 'react-router-dom';
import roomTypeService from '../../services/room-type.service';
import roomStayHistoryService from '../../services/room-stay-history.service';

const ListRoom = () => {
    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING
    //get user information
    const loginUserId = sessionStorage.getItem('userId');

    const [roomList, setRoomList] = useState([]);
    const [roomStayHistoryList, setRoomStayHistoryList] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        userService
            .getAllRoomByStaff(loginUserId)
            .then((res) => {
                const sortedRoomList = [...res.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return a.roomNumber - b.roomNumber; // Sort by roomNumber in ascending order
                });
                setRoomList(sortedRoomList);
                setLoading(false);

            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
        roomStayHistoryService
            .getAllRoomStayHistory()
            .then((res) => {
                setRoomStayHistoryList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    const filteredRoomList = roomList.filter((room) => {
        if (filter === 'All') return true;
        if (filter === 'Available') return room.status === 'Available';
        if (filter === 'Occupied') return room.status === 'Occupied';
        if (filter === 'Maintenance') return room.status === 'Maintenance';
        return true;
    });

      // Calculate counts for each status
      const availableCount = roomList.filter(room => room.status === 'Available').length;
      const occupiedCount = roomList.filter(room => room.status === 'Occupied').length;
      const maintenanceCount = roomList.filter(room => room.status === 'Maintenance').length;


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
                        <div className="ibox-title">Danh sách phòng</div>
                    </div>
                    <div className="ibox-body">
                        {/* Filter Buttons */}
                        <div className="mb-3 d-flex gap-2">
                        <button
                                    onClick={() => setFilter('All')}
                                    style={{ backgroundColor: 'white', color: 'black', marginRight: '10px' }}
                                    className="btn"
                                >
                                    Tất cả ({roomList.length})
                                </button>
                                <button
                                    onClick={() => setFilter('Available')}
                                    style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}
                                    className="btn"
                                >
                                    Trống ({availableCount})
                                </button>
                                <button
                                    onClick={() => setFilter('Occupied')}
                                    style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}
                                    className="btn"
                                >
                                    Nhận phòng ({occupiedCount})
                                </button>
                                <button
                                    onClick={() => setFilter('Maintenance')}
                                    style={{ backgroundColor: '#E4A11B', color: 'black' }}
                                    className="btn"
                                >
                                    Bảo trì ({maintenanceCount})
                                </button>
                        </div>

                        {/* Room Cards */}
                        <div className="row">
                            {filteredRoomList.map((room) => {
                                const occupiedRoom = roomStayHistoryList.find(
                                    (history) =>
                                        history.roomId === room.roomId &&
                                        history.checkInDate &&
                                        !history.checkOutDate &&
                                        history.reservation?.reservationStatus === 'CheckIn'
                                );

                                return (
                                    <div
                                        key={room.roomNumber}
                                        className="col-md-4 mb-3"
                                        style={{ padding: '10px' }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                backgroundColor:
                                                    room.status === 'Available' ? 'green' :
                                                    room.status === 'Occupied' ? 'red' :
                                                    '#E4A11B',
                                                color: 'white',
                                                borderRadius: '5px',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    flex: '1',
                                                    backgroundColor:
                                                        room.status === 'Available' ? 'darkgreen' :
                                                        room.status === 'Occupied' ? 'darkred' :
                                                        'goldenrod',
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '10px'
                                                }}
                                            >
                                                <p>{room.roomType?.type?.typeName}</p>
                                                <p>{room.roomNumber}</p>
                                                <i
                                                    className={
                                                        room.status === 'Available' ? 'fa fa-check-circle' :
                                                        room.status === 'Occupied' ? 'fa fa-bed' :
                                                        'fa fa-wrench'
                                                    }
                                                    style={{ fontSize: '1.5em', marginTop: '5px' }}
                                                ></i>
                                            </div>
                                            <div style={{ flex: '3', padding: '20px' }}>
                                                {room.status === 'Available' && (
                                                    <h4 style={{ fontWeight: 'bold' }}>Trống</h4>
                                                )}
                                                {room.status === 'Occupied' && occupiedRoom && (
                                                    <div>
                                                        <h4 style={{ fontWeight: 'bold' }}>Đang sử dụng</h4>
                                                        <p>Khách: {occupiedRoom.reservation.customer.name}</p>
                                                    </div>
                                                )}
                                                {room.status === 'Maintenance' && (
                                                    <h4 style={{ fontWeight: 'bold' }}>Đang bảo trì</h4>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
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

export default ListRoom