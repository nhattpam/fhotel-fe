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

const RoomStatus = () => {
    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING
    //get user information
    const loginUserId = sessionStorage.getItem('userId');


    //call list hotel registration
    const [roomList, setRoomList] = useState([]);
    const [roomSearchTerm, setRoomSearchTerm] = useState('');
    const [currentRoomPage, setCurrentRoomPage] = useState(0);
    const [roomsPerPage] = useState(10);


    useEffect(() => {
        userService
            .getAllRoomByStaff(loginUserId)
            .then((res) => {
                const sortedRoomList = [...res.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setRoomList(sortedRoomList);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);


    const handleRoomSearch = (event) => {
        setRoomSearchTerm(event.target.value);
    };

    const filteredRooms = roomList
        .filter((room) => {
            return (
                room.room?.type?.typeName.toString().toLowerCase().includes(roomSearchTerm.toLowerCase()) ||
                room.createdDate.toString().toLowerCase().includes(roomSearchTerm.toLowerCase())
            );
        });

    const pageRoomCount = Math.ceil(filteredRooms.length / roomsPerPage);

    const handleRoomPageClick = (data) => {
        setCurrentRoomPage(data.selected);
    };

    const offsetRoom = currentRoomPage * roomsPerPage;
    const currentRooms = filteredRooms.slice(offsetRoom, offsetRoom + roomsPerPage);



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

    });

    const handleChange = (e) => {
        const value = e.target.value;

        setUpdateRoom({ ...updateRoom, [e.target.name]: value });
    };

    const handleUpdateRoomNoteChange = (value) => {
        setUpdateRoom({ ...updateRoom, note: value });
    };


    const submitUpdateRoom = async (e, roomId) => {
        e.preventDefault();

        try {
            // Fetch the current type pricing data
            const res = await roomService.getRoomById(roomId);
            const roomData = res.data;

            // Make the update request
            console.log(JSON.stringify(updateRoom))
            const updateRes = await roomService.updateRoom(roomId, { ...roomData, status: updateRoom.status, note: updateRoom.note });

            if (updateRes.status === 200) {
                // Use a notification library for better user feedback
                setSuccess({ general: "Cập nhật thành công!" });
                setShowSuccess(true); // Show error
                roomService
                    .getRoomById(roomId)
                    .then((res) => {
                        setRoom(res.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                userService
                    .getAllRoomByStaff(loginUserId)
                    .then((res) => {
                        const sortedRoomList = [...res.data].sort((a, b) => {
                            // Assuming requestedDate is a string in ISO 8601 format
                            return new Date(b.createdDate) - new Date(a.createdDate);
                        });
                        setRoomList(sortedRoomList);

                    })
                    .catch((error) => {
                        console.log(error);
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
            setError({ general: response.data.message, validation: validationErrors });
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
                    {/* start ibox */}
                    <div className="ibox">
                        <div className="ibox-head bg-dark text-light">
                            <div className="ibox-title">Danh Sách Phòng</div>
                            <div className="form-group">
                                <input id="demo-foo-search" type="text" placeholder="Tìm Kiếm" className="form-control form-control-sm"
                                    autoComplete="on" value={roomSearchTerm}
                                    onChange={handleRoomSearch} />
                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table table-borderless table-hover table-wrap table-centered">
                                    <thead>
                                        <tr>
                                            <th><span>STT</span></th>
                                            <th><span>Số phòng</span></th>
                                            <th><span>Loại phòng</span></th>
                                            <th><span>Khách sạn</span></th>
                                            <th><span>Trạng thái</span></th>
                                            <th><span>Hành động</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentRooms.length > 0 && currentRooms.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>Phòng số {item.roomNumber}</td>
                                                        <td>{item.roomType?.type?.typeName}</td>
                                                        <td>
                                                            <Link to={`/edit-hotel/${item.roomType?.hotel?.hotelId}`}>
                                                                {item.roomType?.hotel?.hotelName}
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            {item.status === "Available" && (
                                                                <span className="badge label-table badge-success">Có sẵn</span>
                                                            )}
                                                            {item.status === "Occupied" && (
                                                                <span className="badge label-table badge-danger">Không có sẵn</span>
                                                            )}
                                                            {item.status === "Maintenance" && (
                                                                <span className="badge label-table badge-warning">Bảo trì</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5"
                                                                data-toggle="tooltip" data-original-title="Edit">
                                                                <i className="fa fa-pencil font-14"
                                                                    onClick={() => openRoomModal(item.roomId)} /></button>
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
                                pageCount={pageRoomCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handleRoomPageClick}
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
                                                <h5>Trạng thái: &nbsp;
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
                                                    required
                                                >
                                                    <option value="Available">Có sẵn</option>
                                                    <option value="Occupied">Không có sẵn</option>
                                                    <option value="Maintenance">Bảo trì</option>
                                                </select>
                                                <label htmlFor="note">Ghi chú * :</label>
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
                                    <button type="submit" className="btn btn-primary btn-sm">Lưu</button>
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