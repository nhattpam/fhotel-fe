import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import userService from '../../services/user.service';
import { Link } from 'react-router-dom';
import roomService from '../../services/room.service';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import roomStayHistoryService from '../../services/room-stay-history.service';

const RoomStatus = () => {
    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING
    //get user information
    const loginUserId = sessionStorage.getItem('userId');


    //call list hotel registration
    const [roomList, setRoomList] = useState([]);
    const [roomStayHistoryList, setRoomStayHistoryList] = useState([]);



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

    const [filter, setFilter] = useState('All'); // Filter state for room status

    // Filtered room list based on the selected filter
    const filteredRooms = roomList.filter(room => {
        if (filter === 'All') return true;
        return room.status === filter;
    });

    // Calculate counts for each status
    const availableCount = roomList.filter(room => room.status === 'Available').length;
    const occupiedCount = roomList.filter(room => room.status === 'Occupied').length;
    const maintenanceCount = roomList.filter(room => room.status === 'Maintenance').length;



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


    //update room status
    const [updateRoom, setUpdateRoom] = useState({
        status: room.status || "Available", // default status to room's current status or 'Available'
        note: room.note || "",              // default note to room's current note or an empty string
        isCleaned: room.isCleaned || false  // default cleaned status
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateRoom((prev) => ({
            ...prev,
            [name]: name === "isCleaned" ? value === "true" : value,
        }));
    };



    const handleUpdateRoomNoteChange = (value) => {
        setUpdateRoom({ ...updateRoom, note: value });
    };


    const submitUpdateRoom = async (e, roomId) => {
        e.preventDefault();
        console.log(JSON.stringify(updateRoom))

        // if (!updateRoom.status || !updateRoom.note || !updateRoom.isCleaned) {
        //     console.error("Status or note is missing!");
        //     return; // Ensure that both fields have valid values
        // }

        try {
            const res = await roomService.getRoomById(roomId);
            const roomData = res.data;

            const updateRes = await roomService.updateRoom(roomId, {
                ...roomData,
                status: updateRoom.status,
                note: updateRoom.note,
                isCleaned: updateRoom.isCleaned
            });

            if (updateRes.status === 200) {
                setSuccess({ general: "Cập nhật thành công!" });
                setShowSuccess(true);
                // Update room data
                roomService.getRoomById(roomId).then((res) => setRoom(res.data));
                // Update room list
                userService.getAllRoomByStaff(loginUserId).then((res) => {
                    const sortedRoomList = [...res.data].sort((a, b) => a.roomNumber - b.roomNumber);
                    setRoomList(sortedRoomList);
                });
            } else {
                handleResponseError(updateRes);
            }
        } catch (error) {
            handleResponseError(error.response);
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
                    <div className="ibox">
                        <div className="ibox-head bg-dark text-light">
                            <div className="ibox-title">Danh sách phòng</div>
                        </div>
                        <div className="ibox-body">
                            {/* Filter Buttons */}
                            <div className="mb-3">
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
                                {filteredRooms.map(room => {
                                    const occupiedRoom = roomStayHistoryList.find(
                                        history =>
                                            history.roomId === room.roomId &&
                                            history.checkInDate &&
                                            !history.checkOutDate &&
                                            history.reservation.reservationStatus === 'CheckIn'
                                    );

                                    return (
                                        <div
                                            onClick={() => openRoomModal(room.roomId)}
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
                                                {/* Left section (1/4 of the card) with a darker color and icon */}
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
                                                    {/* Font Awesome icon based on room status */}
                                                    <i
                                                        className={
                                                            room.status === 'Available' ? 'fa fa-check-circle' :
                                                                room.status === 'Occupied' ? 'fa fa-bed' :
                                                                    'fa fa-wrench'
                                                        }
                                                        style={{ fontSize: '1.5em', marginTop: '5px' }}
                                                    ></i>
                                                </div>
                                                {/* Right section (3/4 of the card) for additional information */}
                                                <div style={{ flex: '3', padding: '20px', position: 'relative' }}>
                                                    {/* Positioning icon at the top right */}
                                                    <i
                                                        className={`fa ${room.isCleaned ? 'fa-thumbs-o-up' : 'fa-thumbs-o-down'}`}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '10px',
                                                            right: '10px',
                                                            fontSize: '1.5em',
                                                            color: 'white',
                                                        }}
                                                    ></i>
                                                    {room.status === 'Available' && (
                                                        <h4 style={{ fontWeight: 'bold' }}>Trống</h4>
                                                    )}
                                                    {room.status === 'Occupied' ? (
                                                        occupiedRoom ? (
                                                            <div>
                                                                <h4 style={{ fontWeight: 'bold' }}>Đang sử dụng</h4>
                                                                <p>Khách: {occupiedRoom.reservation?.customer?.name}</p>
                                                            </div>
                                                        ) : (
                                                            <h4 style={{ fontWeight: 'bold' }}>Không có sẵn</h4>
                                                        )
                                                    ) : (
                                                        <></>
                                                    )}
                                                    {room.status === 'Maintenance' && (
                                                        <h4 style={{ fontWeight: 'bold' }}>Đang bảo trì</h4>
                                                    )}
                                                    {/* Display for isCleaned */}
                                                    {/* <div
                                                        style={{
                                                            marginTop: '20px',
                                                            padding: '5px',
                                                            borderRadius: '5px',
                                                            backgroundColor: room.isCleaned ? '#d4edda' : '#f8d7da',
                                                            color: room.isCleaned ? '#155724' : '#721c24',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <h5 style={{ fontWeight: 'bold', margin: 0 }}>
                                                            {room.isCleaned ? 'Đã dọn' : 'Chưa dọn'}
                                                        </h5>
                                                    </div> */}
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

            {showModalRoom && (
                <div
                    className="modal fade show"
                    tabIndex="-1"
                    role="dialog"
                    style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                        <div className="modal-content shadow-lg rounded">
                            <form onSubmit={(e) => submitUpdateRoom(e, room.roomId)}>
                                <div className="modal-header bg-dark text-light">
                                    <h5 className="modal-title">Chi Tiết Phòng</h5>
                                    <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalRoom}>
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

                                <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto', textAlign: 'left' }}>
                                    <div className="container-fluid">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <h5>Phòng số: <span style={{ fontWeight: 'bold', color: 'green' }}>{room.roomNumber}</span> </h5>
                                                <h5>Loại phòng: <span style={{ fontWeight: 'bold', color: 'green' }}>{room.roomType?.type?.typeName}</span> </h5>
                                                <h5>Trạng thái phòng: &nbsp;
                                                    {room.status === "Available" && (
                                                        <span className="badge label-table badge-success">Có sẵn</span>
                                                    )}
                                                    {room.status === "Occupied" && (
                                                        <span className="badge label-table badge-danger">Không có sẵn</span>
                                                    )}
                                                    {room.status === "Maintenance" && (
                                                        <span className="badge label-table badge-warning">Bảo trì</span>
                                                    )}
                                                </h5>
                                                <select
                                                    name="status"
                                                    className='form-control'
                                                    onChange={(e) => handleChange(e)}
                                                    value={updateRoom.status} // add fallback value
                                                    required
                                                >
                                                    <option value="">Chọn trạng thái</option>
                                                    <option value="Available">Có sẵn</option>
                                                    <option value="Occupied">Không có sẵn</option>
                                                    <option value="Maintenance">Bảo trì</option>
                                                </select>
                                                <h5 className='mt-2'>Trạng thái dọn phòng: &nbsp;
                                                    {room.isCleaned === true && (
                                                        <span className="badge label-table badge-success">Đã dọn</span>
                                                    )}
                                                    {room.isCleaned === false && (
                                                        <span className="badge label-table badge-danger">Chưa dọn</span>
                                                    )}

                                                </h5>
                                                <select
                                                    name="isCleaned"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={updateRoom.isCleaned ? "true" : "false"} // Ensure boolean is converted to string for the dropdown
                                                    required
                                                >
                                                    <option value="">Chọn trạng thái</option>
                                                    <option value="true">Đã dọn</option>
                                                    <option value="false">Chưa dọn</option>
                                                </select>


                                                <h5 htmlFor="note" className='mt-2'>Ghi chú * :</h5>
                                                <ReactQuill
                                                    value={updateRoom.note}
                                                    onChange={handleUpdateRoomNoteChange}
                                                    modules={{
                                                        toolbar: [
                                                            [{ header: [1, 2, false] }],
                                                            [{ 'direction': 'rtl' }],
                                                            [{ 'align': [] }],
                                                            ['code-block'],
                                                            [{ 'color': [] }, { 'background': [] }],
                                                            ['clean']
                                                        ]
                                                    }}
                                                    theme="snow"
                                                    preserveWhitespace={true}
                                                    style={{ height: '300px', marginBottom: '50px' }}
                                                />

                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary btn-sm"><i class="fa fa-floppy-o" aria-hidden="true"></i> Lưu</button>
                                    <button type="button" className="btn btn-dark btn-sm" onClick={closeModalRoom} >Đóng</button>
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
                                            `}
            </style>

        </>
    )
}

export default RoomStatus