import React, { useEffect, useState } from 'react';
import Header from '../Header';
import SideBar from '../SideBar';
import userService from '../../services/user.service';
import roomTypeService from '../../services/room-type.service';
import { Link } from 'react-router-dom';
import roomStayHistoryService from '../../services/room-stay-history.service';
import reservationService from '../../services/reservation.service';
import documentService from '../../services/document.service';
import roomImageService from '../../services/room-image.service';
import userDocumentService from '../../services/user-document.service';
import roomService from '../../services/room.service';

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
            res.code.toLowerCase().includes(customerSearch.toLowerCase()) ||
            res.customer?.identificationNumber.includes(customerSearch)
        );

        if (filteredReservations.length > 0) {
            setReservationDetails(filteredReservations);
        } else {
            setReservationDetails(null);
        }
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
            reservationService
                .getAllUserDocumentByReservation(reservationId)
                .then((res) => {
                    setUserDocumentList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
            documentService
                .getAllDocument()
                .then((res) => {
                    setDocumentList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    //CREATE USER DOCUMENT
    const [createUserDocument, setCreateUserDocument] = useState({
        reservationId: "",
        image: "",
        documentId: ""
    });

    const [userDocumentList, setUserDocumentList] = useState([]);
    const [documentList, setDocumentList] = useState([]);
    const [selectedFileUserDocument, setSelectedFileUserDocument] = useState(null);
    const [userImageList, setUserImageList] = useState(userDocumentList);
    // Handle file selection
    const handleFileChange = (event) => {
        setSelectedFileUserDocument(event.target.files[0]);
    };

    // Upload image and refresh the room image list without closing the modal
    const handleUploadAndPostUserDocument = async (reservationId) => {
        if (!selectedFileUserDocument) {
            alert("Chọn hình!");
            return;
        }

        try {
            // Prepare the FormData with the correct key expected by the API
            const formData = new FormData();
            formData.append("file", selectedFileUserDocument); // Adjust key if needed
            console.log([...formData.entries()]); // Logs the form data before submission

            // Upload the image to the API
            const uploadResponse = await roomImageService.uploadImage(formData);

            if (uploadResponse && uploadResponse.data) {
                const imageUrl = uploadResponse.data.link; // Extract the returned image URL from the response
                const document = documentList.find(doc => doc.documentName === "Identification Image");
                if (document) {
                    const documentId = document.documentId;
                    // Update roomImage object
                    const updatedUserDocument = {
                        reservationId: reservationId,
                        image: imageUrl,
                        documentId: documentId
                    };
                    setCreateUserDocument(updatedUserDocument);

                    // Save the room image to your database
                    await userDocumentService.saveUserDocument(updatedUserDocument);

                    // Refresh the room image list by calling the fetchRoomImages function
                    fetchUserDocuments(reservationId);

                    // Optionally, update the local image list without refetching (in case you want instant visual feedback)
                    setUserImageList((prevList) => [...prevList, { image: imageUrl }]);
                }

            }
        } catch (error) {
            console.error("Error uploading and posting image:", error);
        }
    };

    const fetchUserDocuments = (reservationId) => {
        reservationService
            .getAllUserDocumentByReservation(reservationId)
            .then((res) => {
                setUserDocumentList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDeleteImage = async (userDocumentId) => {
        try {
            // Call the API to delete the image by roomImageId
            await userDocumentService.deleteUserDocumentById(userDocumentId);

            // After successful deletion, remove the image from the imageList
            setUserDocumentList(prevList => prevList.filter(item => item.userDocumentId !== userDocumentId));
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    //CREATE USER DOCUMENT

    const [updateReservation, setUpdateReservation] = useState({

    });

    // Function to handle form submission
    const handleCreateRoomStayHistory = async (event) => {
        event.preventDefault(); // Prevent the default form submission
        setError({}); // Reset any previous errors
        setShowError(false); // Hide error before validation
        const reservationId = selectedReservationId;

        try {
            // Only proceed if the selected rooms are within the allowed quantity
            if (selectedRooms.length > selectedQuantity) {
                setError({ general: `Khách yêu cầu ${selectedQuantity} phòng!` });
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
                console.log(JSON.stringify(roomStayHistory))
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

            //update reservation status -> checkin
            // Fetch the user data
            const reservationStatus = "CheckIn";
            const actualCheckInTime = new Date();
            const res = await reservationService.getReservationById(selectedReservationId);
            const reservationData = res.data;

            // Update the local state with the fetched data and new isActive flag
            setUpdateReservation({ ...reservationData, reservationStatus, actualCheckInTime });

            // Make the update request
            const updateRes = await reservationService.updateReservation(selectedReservationId, { ...reservationData, reservationStatus });

            if (updateRes.status === 200) {
                setSuccess({ general: "Đã Check-In cho khách hàng thành công!" });
                setShowSuccess(true);

                /// refresh search list with search term
                // window.location.reload();
            } else {
                handleResponseError(error.response);
            }

            // After submitting, clear the selected rooms
            setSelectedRooms([]); // Clear selected amenities after submission
        } catch (error) {
            handleResponseError(error.response);
        }


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



    //CHECK OUT
    const [showCheckOutModal, setShowCheckOutModal] = useState(false);

    const closeCheckOutModal = () => {
        setShowCheckOutModal(false);
    };

    const [roomStayHistoryList, setRoomStayHistoryList] = useState([]);
    const [orderDetailList, setOrderDetailList] = useState([]);


    const openCheckOutModal = (reservationId) => {
        setShowCheckOutModal(true);

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
    }



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


    /// notification
    const [success, setSuccess] = useState({}); // State to hold error messages
    const [showSuccess, setShowSuccess] = useState(false); // State to manage error visibility
    //notification after creating
    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false); // Hide the error after 2 seconds
                // window.location.reload();
            }, 3000); // Change this value to adjust the duration
            // window.location.reload();
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [showSuccess]); // Only run effect if showError changes


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
                            <h4 className="mb-0">Tìm Kiếm Đặt Phòng</h4>
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
                                            placeholder="Nhập mã đặt chỗ, tên khách hàng, số điện thoại, email hoặc số căn cước"
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
                                        <h5 className="mb-4">Chi Tiết Đặt Phòng</h5>
                                        {reservationDetails.map((reservation, index) => (
                                            <div key={index} className="card mb-3 border-light shadow-sm">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <p><strong className='mr-2'>Mã đặt chỗ:</strong> {reservation.code}</p>
                                                            <p><strong className='mr-2'>Tên khách hàng:</strong> {reservation.customer?.name}</p>
                                                            <p><strong className='mr-2'>Số căn cước:</strong> {reservation.customer?.identificationNumber}</p>
                                                            <p><strong className='mr-2'>Email:</strong> {reservation.customer?.email}</p>
                                                            <p><strong className='mr-2'>Số điện thoại:</strong> {reservation.customer?.phoneNumber}</p>
                                                            <p><strong className='mr-2'>Ngày dự kiến check-In:</strong> {new Date(reservation.checkInDate).toLocaleDateString('en-US')}</p>
                                                            <p><strong className='mr-2'>Ngày dự kiến check-Out:</strong> {new Date(reservation.checkOutDate).toLocaleDateString('en-US')}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <p><strong className='mr-2'>Loại phòng:</strong> {reservation.roomType?.type?.typeName}</p>
                                                            <p><strong className='mr-2'>Số lượng đặt:</strong> {reservation.numberOfRooms} phòng</p>
                                                            <p><strong className='mr-2'>Tổng số tiền:</strong> {reservation.totalAmount} (VND)</p>
                                                            <p>
                                                                <strong className='mr-2'>Trạng thái thanh toán:</strong>
                                                                {reservation.paymentStatus === "Paid" ? (
                                                                    <span className="badge label-table badge-success">Đã Thanh Toán</span>
                                                                ) : reservation.paymentStatus === "Not Paid" ? (
                                                                    <span className="badge label-table badge-danger">Chưa Thanh Toán</span>
                                                                ) : (
                                                                    <span className="badge label-table badge-warning">Unknown Status</span>
                                                                )}
                                                            </p>
                                                            <p>
                                                                <strong className='mr-2'>Trạng thái đặt phòng:</strong>
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
                                                            <p><strong className='mr-2'>Ngày thực tế check-in:</strong> {reservation.actualCheckInTime
                                                                ? new Date(reservation.actualCheckInTime).toLocaleString('en-US')
                                                                : "Chưa có"}</p>
                                                            <p>
                                                                <strong className='mr-2'>Ngày thực tế check-out:</strong>
                                                                {reservation.actualCheckOutDate
                                                                    ? new Date(reservation.actualCheckOutDate).toLocaleString('en-US')
                                                                    : "Chưa có"}
                                                            </p>
                                                            <p><strong className='mr-2'>Khách sạn:</strong> {reservation.roomType?.hotel?.hotelName}</p>


                                                        </div>
                                                    </div>
                                                    {/* Action Buttons for Each Reservation */}
                                                    <div className="mt-4 d-flex gap-3">
                                                        {reservation.reservationStatus === "Pending" && (
                                                            <button className="btn btn-success " onClick={() =>
                                                                openPickRoomModal(reservation.roomTypeId, reservation.numberOfRooms, reservation.reservationId)} >
                                                                <i className="la la-sign-out" /> Check-In
                                                            </button>
                                                        )}
                                                        {reservation.reservationStatus === "CheckIn" && (
                                                            <button disabled className="btn btn-success " onClick={() =>
                                                                openPickRoomModal(reservation.roomTypeId, reservation.numberOfRooms, reservation.reservationId)} >
                                                                <i className="la la-sign-out" /> Check-In
                                                            </button>
                                                        )}

                                                        {reservation.reservationStatus === "CheckIn" && (
                                                            <button className="btn btn-danger ml-2" onClick={() =>
                                                                openCheckOutModal(reservation.reservationId)}>
                                                                <i className="la la-sign-out" /> Check-Out
                                                            </button>
                                                        )}
                                                        {reservation.reservationStatus === "Pending" && (
                                                            <button disabled className="btn btn-danger ml-2" onClick={() =>
                                                                openCheckOutModal(reservation.reservationId)}>
                                                                <i className="la la-sign-out" /> Check-Out
                                                            </button>
                                                        )}



                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="alert alert-warning mt-4">
                                        <i className="la la-exclamation-triangle" /> Không tìm thấy đặt phòng. Tìm kiếm lại!
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
                                    <h5 className="modal-title">Check-In Cho Khách Hàng</h5>
                                    <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalPickRoom}>
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
                                                    <>
                                                        <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                    </>
                                                )
                                            }

                                        </div>


                                        <div className="col-md-7">
                                            <table className="table table-responsive table-hover mt-3">
                                                <tbody>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Loại phòng:</th>
                                                        <td>{roomType.type?.typeName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Diện tích:</th>
                                                        <td>{roomType.roomSize} m²</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Tổng số phòng:</th>
                                                        <td>{roomType.totalRooms} phòng</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Số phòng còn trống:</th>
                                                        <td>{roomType.availableRooms} phòng</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Số phòng cần đặt:</th>
                                                        <td>{reservation.numberOfRooms} phòng</td>
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
                                                            onClick={() => openRoomModal(room.roomId)}
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
                                                    <>
                                                        <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                    </>
                                                )}
                                            </div>

                                            <hr />
                                            <div>
                                                <h3 className="text-primary" style={{ textAlign: 'left', fontWeight: 'bold' }}>Tiện Nghi</h3>
                                                <td style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', margin: 0 }}>
                                                    {
                                                        roomFacilities.length > 0 ? roomFacilities.map((item, index) => (
                                                            <div key={index} style={{ position: 'relative', textAlign: 'center', flex: '0 1 auto', margin: '5px' }}>
                                                                <span className="badge label-table badge-danger">{item.facility?.facilityName}</span>

                                                            </div>
                                                        ))
                                                            : (
                                                                <>
                                                                    <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                                </>
                                                            )
                                                    }

                                                </td>

                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <hr />
                                        </div>
                                        <div className="col-md-12" style={{ textAlign: 'left' }}>
                                            <h4 style={{ fontWeight: 'bold' }}>Lưu thông tin khách hàng</h4>
                                            <div style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', gap: '10px' }}>
                                                {userDocumentList.length > 0 ? (
                                                    userDocumentList.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            style={{
                                                                flex: '0 0 auto',
                                                                textAlign: 'center',
                                                                position: 'relative',
                                                                marginBottom: '10px'
                                                            }}
                                                        >
                                                            <img src={item.image} alt="Room" style={{ width: '250px', height: '200px' }} />
                                                            {loginUser.role?.roleName === "Receptionist" && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger"
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '10px',
                                                                        right: '10px',
                                                                        background: 'transparent',
                                                                        border: 'none',
                                                                        color: 'red',
                                                                        fontSize: '20px',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    onClick={() => handleDeleteImage(item.userDocumentId)}
                                                                >
                                                                    &times;
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <>
                                                        <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                    </>
                                                )}
                                            </div>
                                            {loginUser.role?.roleName === "Receptionist" && (
                                                <div className="form-group mt-3">
                                                    <input type="file" onChange={handleFileChange} />
                                                    <button type="button" className="btn btn-success mt-2" onClick={() => handleUploadAndPostUserDocument(reservation.reservationId)}>
                                                        + Tải lên
                                                    </button>
                                                </div>
                                            )}
                                        </div>


                                    </div>


                                </div>
                                <div className="modal-footer">
                                    {
                                        loginUser.role?.roleName === "Receptionist" && (
                                            <>
                                                <button type="submit" className="btn btn-primary" >Check-In</button>
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

            {showCheckOutModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <form onSubmit={handleCreateRoomStayHistory}>
                                <div className="modal-header bg-dark text-light">
                                    <h5 className="modal-title">Check-Out</h5>
                                    <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeCheckOutModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>

                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
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
                                                            onClick={() => openRoomModal(roomStayHistory?.room.roomId)}
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
                                                    </>)}
                                            </div>
                                            <div className="col-md-4" style={{ textAlign: 'left' }}>
                                                <h5>Thanh Toán</h5>
                                                <p className="mb-1"><strong className='mr-2'>Mã đặt chỗ:</strong> {reservation.code}</p>
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
                                                <h5>Dịch Vụ</h5>
                                                <div className="table-responsive">
                                                    <table className="table table-borderless table-hover table-wrap table-centered">
                                                        <thead>
                                                            <tr>
                                                                <th><span>STT</span></th>
                                                                <th><span>Hình Ảnh</span></th>
                                                                <th><span>Tên Dịch Vụ</span></th>
                                                                <th><span>Số Lượng</span></th>
                                                                <th><span>Loại Dịch Vụ</span></th>
                                                                <th><span>Đơn Giá (VND)</span></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                orderDetailList.length > 0 && orderDetailList.map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>
                                                                            <img src={item.service?.image} alt="avatar" style={{ width: "120px", height: '100px' }} />
                                                                        </td>
                                                                        <td>{item.service?.serviceName}</td>
                                                                        <td>{item.quantity}</td>
                                                                        <td>{item.service?.serviceType?.serviceTypeName}</td>
                                                                        <td>{item.service?.price}</td>
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
                                                        {(orderDetailList.reduce((total, item) => total + (item.quantity * item.service?.price || 0), 0))
                                                            + (reservation.paymentStatus === "Not Paid" ? reservation.totalAmount : 0)} VND
                                                    </h5>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    {loginUser.role?.roleName === "Receptionist" && (
                                        <button type="submit" className="btn btn-primary">Check-Out</button>
                                    )}
                                    <button type="button" className="btn btn-dark" onClick={closeCheckOutModal}>Đóng</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showModalRoom && (
                <div
                    className="modal fade show"
                    tabIndex="-1"
                    role="dialog"
                    style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                        <div className="modal-content shadow-lg rounded">
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Chi Tiết Phòng</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalRoom}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto', textAlign: 'left' }}>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-12">
                                            <h5 className="mb-3">
                                                <span style={{ color: '#00796b', fontWeight: 'bold', fontSize: '1.25rem' }}>Phòng số:</span>
                                                <span style={{ fontWeight: 'bold', color: '#388e3c', marginLeft: '10px' }}>{room.roomNumber}</span>
                                            </h5>

                                            <h5 className="mb-3">
                                                <span style={{ color: '#00796b', fontWeight: 'bold', fontSize: '1.25rem' }}>Loại phòng:</span>
                                                <span style={{ fontWeight: 'bold', color: '#388e3c', marginLeft: '10px' }}>{room.roomType?.type?.typeName}</span>
                                            </h5>

                                            <h5 className="mb-3">
                                                <span style={{ color: '#00796b', fontWeight: 'bold', fontSize: '1.25rem' }}>Trạng thái:</span>
                                                <span style={{ marginLeft: '10px' }}>
                                                    {room.status === "Available" && (
                                                        <span style={{ backgroundColor: '#4caf50', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>Có sẵn</span>
                                                    )}
                                                    {room.status === "Occupied" && (
                                                        <span style={{ backgroundColor: '#f44336', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>Không có sẵn</span>
                                                    )}
                                                    {room.status === "Maintenance" && (
                                                        <span style={{ backgroundColor: '#ff9800', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>Bảo trì</span>
                                                    )}
                                                </span>
                                            </h5>

                                            <h5 className="mb-3">
                                                <span style={{ color: '#00796b', fontWeight: 'bold', fontSize: '1.25rem' }}>Ghi chú:</span>
                                                <div style={{ marginTop: '8px', paddingLeft: '20px', fontStyle: 'italic', color: '#616161' }}
                                                    dangerouslySetInnerHTML={{ __html: room.note ?? 'Không có' }}
                                                ></div>
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalRoom} >Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


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


            `}</style>
        </>
    );

};

export default CheckInOut;
