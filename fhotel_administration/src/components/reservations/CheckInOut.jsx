import React, { useEffect, useState } from 'react';
import Header from '../Header';
import SideBar from '../SideBar';
import userService from '../../services/user.service';
import roomTypeService from '../../services/room-type.service';
import { Link } from 'react-router-dom';
import roomStayHistoryService from '../../services/room-stay-history.service';
import reservationService from '../../services/reservation.service';

const CheckInOut = () => {
    //get user information
    const loginUserId = sessionStorage.getItem('userId');
    const [loginUser, setLoginUser] = useState({

    });
    useEffect(() => {
        userService
            .getUserById(loginUserId)
            .then((res) => {

                setLoginUser(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, loginUserId);

    //call list hotel registration
    const [reservationList, setReservationList] = useState([]);

    const [customerSearch, setCustomerSearch] = useState('');
    const [reservationDetails, setReservationDetails] = useState([]);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [isCheckedOut, setIsCheckedOut] = useState(false);

    useEffect(() => {
        userService
            .getAllReservationByStaff(loginUserId)
            .then((res) => {
                const sortedReservationList = [...res.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setReservationList(sortedReservationList);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleSearch = () => {
        // Simulate searching for reservation
        const filteredReservations = reservationList.filter(res =>
            res.customer?.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
            res.customer?.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
            res.customer?.identificationNumber.includes(customerSearch)
        );

        if (filteredReservations.length > 0) {
            setReservationDetails(filteredReservations);
        } else {
            setReservationDetails(null);
        }
    };


    const handleCheckIn = () => {
        // Simulate checking in process
        setIsCheckedIn(true);
    };

    const handleCheckOut = () => {
        // Simulate checking out process
        setIsCheckedOut(true);
    };


    //PICK ROOM
    const [roomImageList, setRoomImageList] = useState([]);
    const [roomFacilities, setRoomFacilities] = useState([]);
    const [roomList, setRoomList] = useState([]);

    const [roomType, setRoomType] = useState({

    });
    const [showModalPickRoom, setShowModalPickRoom] = useState(false);
    const closeModalPickRoom = () => {
        setShowModalPickRoom(false);
    };

    const [selectedRooms, setSelectedRooms] = useState([]);
    const [selectedReservationId, setSelectedReservationId] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState(null);

    const handleRoomSelect = (roomId) => {
        setSelectedRooms((prevSelected) => {
            if (prevSelected.includes(roomId)) {
                // If the amenity is already selected, remove it
                return prevSelected.filter(id => id !== roomId);
            } else {
                // If the amenity is not selected, add it
                return [...prevSelected, roomId];
            }
        });
    };

    const [reservation, setReservation] = useState({

    });

    const openPickRoomModal = (roomTypeId, quantity, reservationId) => {
        setShowModalPickRoom(true);
        // Clear the image list first to avoid showing images from the previous room type
        setRoomImageList([]); // Reset roomImageList to an empty array

        setSelectedReservationId(reservationId);
        setSelectedQuantity(quantity);
        if (roomTypeId) {
            roomTypeService
                .getRoomTypeById(roomTypeId)
                .then((res) => {
                    setRoomType(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });

            fetchRoomImages(roomTypeId); // Fetch images
            roomTypeService
                .getAllRoombyRoomTypeId(roomTypeId)
                .then((res) => {
                    const sortedRooms = res.data.sort((a, b) => a.roomNumber - b.roomNumber);
                    setRoomList(sortedRooms);
                })
                .catch((error) => {
                    console.log(error);
                });

            fetchRoomFacilities(roomTypeId); // Fetch images

            reservationService
                .getReservationById(reservationId)
                .then((res) => {
                    setReservation(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };


    // Function to handle form submission
    // Function to handle form submission
    const handleCreateRoomStayHistory = (event) => {
        event.preventDefault(); // Prevent the default form submission
        setError({}); // Reset any previous errors
        setShowError(false); // Hide error before validation
        const reservationId = selectedReservationId;

        // Only proceed if the selected rooms are within the allowed quantity
        if (selectedRooms.length > selectedQuantity) {
            setError({ general: `Cannot Choose more than ${selectedQuantity}` });
            setShowError(true);
            return;
        }
        // Array to hold promises for each save operation
        const promises = selectedRooms.map(roomId => {
            // Prepare the room stay history object
            const roomStayHistory = {
                reservationId,
                roomId
            };

            // Log the room stay history before saving
            console.log("Preparing to save Room Stay History:", roomStayHistory);

            return roomStayHistoryService.saveRoomStayHistory(roomStayHistory)
                .then(response => {
                    console.log(`Room added: Room ID ${roomId}, Response:`, response);
                    return response; // Return the response for further processing if needed
                })
                .catch(error => {
                    console.error(`Error adding room stay history for Room ID ${roomId}:`, error);
                    return Promise.reject(error); // Reject the promise for error handling
                });
        });

        // Wait for all promises to resolve
        Promise.all(promises)
            .then(() => {
                console.log("All room stay histories have been processed.");
                closeModalPickRoom(); // Close the modal here
            })
            .catch(() => {
                console.error("Some room stay histories could not be added. Check errors above.");
                // You can show a notification or error message to the user if needed
            });

        // After submitting, clear the selected rooms
        setSelectedRooms([]); // Clear selected amenities after submission
    };





    // Function to fetch room images based on roomTypeId
    const fetchRoomImages = (roomTypeId) => {
        roomTypeService
            .getAllRoomImagebyRoomTypeId(roomTypeId)
            .then((res) => {
                setRoomImageList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    //  Function to fetch room facilities based on roomTypeId
    const fetchRoomFacilities = (roomTypeId) => {
        roomTypeService
            .getAllFacilityByRoomTyeId(roomTypeId)
            .then((res) => {
                setRoomFacilities(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const [error, setError] = useState({}); // State to hold error messages
    const [showError, setShowError] = useState(false); // State to manage error visibility
    //notification after creating
    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => {
                setShowError(false); // Hide the error after 2 seconds
            }, 3000); // Change this value to adjust the duration
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [showError]); // Only run effect if showError changes

    return (
        <>
            <Header />
            <SideBar />
            <div className="content-wrapper" style={{ textAlign: 'left', display: 'block' }}>
                {/* Page Heading */}
                <div className="page-heading d-flex align-items-center justify-content-between">
                    <h2 className="page-title">Check-In / Check-Out</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="index.html">
                                <i className="la la-home font-20" />
                            </a>
                        </li>
                        <li className="breadcrumb-item active">Check-In / Check-Out</li>
                    </ol>
                </div>

                <div className="page-content">
                    <div className="card shadow-lg border-0 rounded">
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Tìm Kiếm Đặt Chỗ</h4>
                        </div>

                        <div className="card-body p-4" style={{ textAlign: 'left' }}>
                            <div className="check-in-out-page">
                                {/* Search Section */}
                                <div className="search-section mb-4">
                                    {/* <label htmlFor="reservation-search" className="form-label">Search Reservation</label> */}
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            id="reservation-search"
                                            className="form-control"
                                            placeholder="Nhập tên khách hàng hoặc số điện thoại hoặc email hoặc số căn cước"
                                            value={customerSearch}
                                            onChange={(e) => setCustomerSearch(e.target.value)}
                                        />
                                        <button className="btn btn-primary input-group-append ml-2" onClick={handleSearch}>
                                            <i className="la la-search" /> Tìm
                                        </button>
                                    </div>
                                </div>

                                {/* Reservation Details */}
                                {reservationDetails && reservationDetails.length > 0 ? (
                                    <div className="reservation-details mt-4">
                                        <h5 className="mb-4">Chi Tiết Đặt Chỗ</h5>
                                        {reservationDetails.map((reservation, index) => (
                                            <div key={index} className="card mb-3 border-light shadow-sm">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <p><strong className='mr-2'>Tên Khách Hàng:</strong> {reservation.customer?.name}</p>
                                                            <p><strong className='mr-2'>Số Căn Cước:</strong> {reservation.customer?.identificationNumber}</p>
                                                            <p><strong className='mr-2'>Email:</strong> {reservation.customer?.email}</p>
                                                            <p><strong className='mr-2'>Số Điện Thoại:</strong> {reservation.customer?.phoneNumber}</p>
                                                            <p><strong className='mr-2'>Ngày Dự Kiến Check-In:</strong> {new Date(reservation.checkInDate).toLocaleDateString('en-US')}</p>
                                                            <p><strong className='mr-2'>Ngày Dự Kiến Check-Out:</strong> {new Date(reservation.checkOutDate).toLocaleDateString('en-US')}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <p><strong className='mr-2'>Loại Phòng:</strong> {reservation.roomType?.type?.typeName}</p>
                                                            <p><strong className='mr-2'>Số Lượng Đặt:</strong> {reservation.numberOfRooms}</p>
                                                            <p><strong className='mr-2'>Tổng Số Tiền:</strong> {reservation.totalAmount} VND</p>
                                                            <p>
                                                                <strong className='mr-2'>Trạng Thái Thanh Toán:</strong>
                                                                {reservation.paymentStatus === "Paid" ? (
                                                                    <span className="badge label-table badge-success">Đã Thanh Toán</span>
                                                                ) : reservation.paymentStatus === "Not Paid" ? (
                                                                    <span className="badge label-table badge-danger">Chưa Thanh Toán</span>
                                                                ) : (
                                                                    <span className="badge label-table badge-warning">Unknown Status</span>
                                                                )}
                                                            </p>
                                                            <p>
                                                                <strong className='mr-2'>Trạng Thái Đặt Chỗ:</strong>
                                                                {reservation.reservationStatus === "CheckIn" ? (
                                                                    <span className="badge label-table badge-success">Đã CheckIn</span>
                                                                ) : reservation.reservationStatus === "Cancelled" ? (
                                                                    <span className="badge label-table badge-danger">Đã Hủy</span>
                                                                ) : reservation.reservationStatus === "Pending" ? (
                                                                    <span className="badge label-table badge-warning">Đang Chờ</span>
                                                                ) : reservation.reservationStatus === "CheckOut" ? (
                                                                    <span className="badge label-table badge-warning">Đã CheckOut</span>
                                                                ) : (
                                                                    <span className="badge label-table badge-warning">Unknown Status</span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {/* Action Buttons for Each Reservation */}
                                                    <div className="mt-4 d-flex gap-3">
                                                        {!reservation.isCheckedIn ? (
                                                            <button className="btn btn-success" onClick={() => handleCheckIn(reservation)}>
                                                                <i className="la la-sign-in" /> Check-In
                                                            </button>
                                                        ) : (
                                                            <p className="text-success"><strong>Checked In at:</strong> {new Date().toLocaleTimeString()}</p>
                                                        )}

                                                        {!reservation.isCheckedOut ? (
                                                            <button className="btn btn-danger ml-2" onClick={() => handleCheckOut(reservation)} disabled={!reservation.isCheckedIn}>
                                                                <i className="la la-sign-out" /> Check-Out
                                                            </button>
                                                        ) : (
                                                            <p className="text-danger"><strong>Checked Out at:</strong> {new Date().toLocaleTimeString()}</p>
                                                        )}

                                                        <button className="btn btn-primary ml-2" onClick={() =>
                                                            openPickRoomModal(reservation.roomTypeId, reservation.numberOfRooms, reservation.reservationId)} >
                                                            <i className="la la-sign-out" /> Chọn Phòng
                                                        </button>

                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="alert alert-warning mt-4">
                                        <i className="la la-exclamation-triangle" /> Không tìm thấy đặt chỗ. Tìm kiếm lại!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModalPickRoom && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <form onSubmit={handleCreateRoomStayHistory}> {/* Attach handleSubmit here */}

                                <div className="modal-header bg-dark text-light">
                                    <h5 className="modal-title">Chọn Phòng Cho Khách Hàng</h5>
                                    <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalPickRoom}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    {showError && Object.entries(error).length > 0 && (
                                        <div className="error-messages" style={{ position: 'absolute', top: '10px', right: '10px', background: 'red', color: 'white', padding: '10px', borderRadius: '5px' }}>
                                            {Object.entries(error).map(([key, message]) => (
                                                <p key={key} style={{ margin: '0' }}>{message}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-5" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {
                                                roomImageList.length > 0 ? (
                                                    roomImageList.map((item, index) => (
                                                        <div key={index} style={{ flex: '1 0 50%', textAlign: 'center', margin: '10px 0', position: 'relative' }}>
                                                            <img src={item.image} alt="Room" style={{ width: "250px", height: "200px" }} />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div style={{ textAlign: 'center', margin: '10px 0', fontSize: '16px', color: 'gray' }}>
                                                        Không tìm thấy.
                                                    </div>
                                                )
                                            }

                                        </div>


                                        <div className="col-md-7">
                                            <table className="table table-responsive table-hover mt-3">
                                                <tbody>
                                                    <tr>
                                                        <th style={{ width: '30%' }}>Loại Phòng:</th>
                                                        <td>{roomType.type?.typeName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Diện Tích:</th>
                                                        <td>{roomType.roomSize} m²</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Tổng Số Phòng:</th>
                                                        <td>{roomType.totalRooms}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Số Phòng Còn Trống:</th>
                                                        <td>{roomType.availableRooms}</td>
                                                    </tr>


                                                </tbody>
                                            </table>
                                            <div>
                                                <h3 className="text-primary" style={{ textAlign: 'left', fontWeight: 'bold' }}>Danh Sách Phòng</h3>
                                                <div className="room-list">
                                                    {roomList.map((room) => (
                                                        <div
                                                            key={room.roomNumber}
                                                            className="room-box"
                                                            style={{
                                                                backgroundColor: room.status === 'Available' ? 'green' : 'red',
                                                                position: 'relative',
                                                                textAlign: 'center',
                                                                flex: '0 1 auto',
                                                                margin: '5px'
                                                            }}
                                                        >
                                                            <p>{room.roomNumber}</p>
                                                            {
                                                                reservation.reservationStatus !== "CheckIn" &&
                                                                reservation.reservationStatus !== "Cancelled" &&
                                                                reservation.reservationStatus !== "CheckOut" && (
                                                                    <>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedRooms.includes(room.roomId)} // Check if this room is selected
                                                                            onChange={() => room.status === 'Available' && handleRoomSelect(room.roomId)} // Only toggle if available
                                                                            disabled={room.status !== 'Available'} // Disable checkbox for unavailable rooms
                                                                            style={{ position: 'absolute', top: '10px', left: '10px' }} // Positioning the checkbox
                                                                        />
                                                                    </>
                                                                )
                                                            }


                                                        </div>
                                                    ))}
                                                </div>
                                                {roomList.length === 0 && (
                                                    <p>Không tìm thấy.</p>
                                                )}
                                            </div>

                                            <hr />
                                            <div>
                                                <h3 className="text-primary" style={{ textAlign: 'left', fontWeight: 'bold' }}>Cơ Sở Vật Chất</h3>
                                                <td style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', margin: 0 }}>
                                                    {
                                                        roomFacilities.length > 0 ? roomFacilities.map((item, index) => (
                                                            <div key={index} style={{ position: 'relative', textAlign: 'center', flex: '0 1 auto', margin: '5px' }}>
                                                                <span className="badge label-table badge-danger">{item.facility?.facilityName}</span>

                                                            </div>
                                                        ))
                                                            : (
                                                                <div style={{ textAlign: 'center', fontSize: '16px', color: 'gray' }}>
                                                                    Không tìm thấy.
                                                                </div>
                                                            )
                                                    }

                                                </td>

                                            </div>
                                        </div>

                                    </div>


                                </div>
                                <div className="modal-footer">
                                    {
                                        loginUser.role?.roleName === "Receptionist" && (
                                            <>
                                                <button type="submit" className="btn btn-primary" >Lưu</button>
                                            </>
                                        )
                                    }
                                    <button type="button" className="btn btn-dark" onClick={closeModalPickRoom} >Đóng</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )
            }


            <style jsx>{`
                .content-wrapper {
                    background-color: #f0f4f8;
                    min-height: 100vh;
                    padding: 20px;
                }
    
                .page-title {
                    font-size: 24px;
                    font-weight: bold;
                }
    
                .card {
                    border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
    
                .card-header {
                    background-color: #343a40;
                    padding: 15px 20px;
                    font-size: 18px;
                    border-bottom: none;
                }
    
                .card-body {
                    padding: 30px;
                    background-color: #fff;
                }
    
                .form-control {
                    border: 1px solid #ced4da;
                    padding: 10px;
                    border-radius: 6px;
                    transition: box-shadow 0.3s ease;
                }
    
                .form-control:focus {
                    box-shadow: 0 0 10px rgba(0, 123, 255, 0.25);
                }
    
                .input-group-append {
                    background-color: #007bff;
                    border: none;
                    border-radius: 0 6px 6px 0;
                    color: white;
                    padding: 10px 20px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
    
                .input-group-append:hover {
                    background-color: #0056b3;
                }
    
                .reservation-details {
                    background-color: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                }
    
                .btn {
                    padding: 10px 20px;
                    font-size: 16px;
                    border-radius: 6px;
                }
    
                .btn-success {
                    background-color: #28a745;
                    border: none;
                    transition: background-color 0.3s ease;
                }
    
                .btn-success:hover {
                    background-color: #218838;
                }
    
                .btn-danger {
                    background-color: #dc3545;
                    border: none;
                    transition: background-color 0.3s ease;
                }
    
                .btn-danger:hover {
                    background-color: #c82333;
                }
    
                .alert {
                    border-radius: 6px;
                    padding: 20px;
                    font-size: 16px;
                }
    
                @media (max-width: 768px) {
                    .card-body {
                        padding: 20px;
                    }
    
                    .row {
                        display: flex;
                        flex-direction: column;
                    }
    
                    .input-group {
                        display: flex;
                        flex-direction: column;
                    }
    
                    .input-group-append {
                        margin-top: 10px;
                    }
    
                    .btn {
                        width: 100%;
                    }
                }

                          .custom-modal-xl {
    max-width: 90%;
    width: 90%;
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

            `}</style>
        </>
    );

};

export default CheckInOut;
