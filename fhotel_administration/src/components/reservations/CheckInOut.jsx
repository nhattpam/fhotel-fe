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
import serviceTypeService from '../../services/service-type.service';
import orderService from '../../services/order.service';
import orderDetailService from '../../services/order-detail.service';
import billService from '../../services/bill.service';
import billTransactionImageService from '../../services/bill-transaction-image.service';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';

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
        reservationService.searchReservation(loginUserId, customerSearch)
            .then((res) => {
                if (res.data.length > 0) {
                    // Sort reservations by createdDate in descending order
                    const sortedData = res.data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
                    setReservationDetails(sortedData);
                } else {
                    setReservationDetails(null);
                }
            })
            .catch((error) => {
                console.log("Search error:", error);
                setReservationDetails(null);
            });
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
        event.preventDefault();
        setError({});
        setShowError(false);
        const reservationId = selectedReservationId;
        const reservationResponse = await reservationService.getReservationById(reservationId);
        const roomTypeId = reservationResponse.data.roomTypeId;
        //check empty user document


        try {
            if (selectedRooms.length !== selectedQuantity) {
                setError({ general: `Khách yêu cầu ${selectedQuantity} phòng!` });
                setShowError(true);
                return;
            }
            let userDocuments = [];
            try {
                userDocuments = await reservationService.getAllUserDocumentByReservation(reservationId);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    userDocuments = []; // Treat 404 as no documents found
                } else {
                    console.error("Error fetching user documents:", error);
                    throw error;
                }
            }

            if (userDocuments.length === 0) {
                setError({ general: "Vui lòng cập nhật thông tin giấy tờ của khách hàng!" });
                setShowError(true);
                return;
            }

            // Save room stay history for each selected room
            const promises = selectedRooms.map(roomId => {
                const roomStayHistory = { reservationId, roomId };
                return roomStayHistoryService.saveRoomStayHistory(roomStayHistory)
                    .then(response => {
                        if (response.status === 201) {
                            setSuccess({ general: "Đã nhận phòng cho khách hàng thành công!" });
                            setShowSuccess(true);
                        }
                        return response;
                    })
                    .catch(error => {
                        console.error(`Error adding room stay history for Room ID ${roomId}:`, error);
                        return Promise.reject(error);
                    });
            });

            // Wait for all save operations to complete
            await Promise.all(promises);

            // Now update available rooms after all rooms are processed
            const decreaseAmount = selectedRooms.length;
            const roomTypeResponse = await roomTypeService.getRoomTypeById(roomTypeId);
            const roomType = roomTypeResponse.data;

            const updatedRoomType = {
                ...roomType,
                availableRooms: roomType.availableRooms - decreaseAmount
            };

            console.log("Updating Room Type:", JSON.stringify(updatedRoomType));
            await roomTypeService.updateRoomType(roomTypeId, updatedRoomType);

            handleSearch();
            closeModalPickRoom();
            setSelectedRooms([]);

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
    const [billByReservation, setBillByReservation] = useState(null);



    const openCheckOutModal = (reservationId) => {
        setShowCheckOutModal(true);
        setSelectedReservationId(reservationId)
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
                // Filter for order details where orderStatus is "Confirmed"
                const confirmedOrderDetails = res.data
                    .filter((orderDetail) => orderDetail.order?.orderStatus === "Confirmed")
                    // Sort by orderedDate in descending order (newest first)
                    .sort((a, b) => new Date(b.orderedDate) - new Date(a.orderedDate));

                // Set the sorted and filtered order details list
                setOrderDetailList(confirmedOrderDetails);
            })
            .catch((error) => {
                console.log(error);
            });

        reservationService
            .getBillByReservation(reservationId)
            .then((res) => {
                setBillByReservation(res.data);
                console.log(res.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // Log `billByReservation` after it's updated
    useEffect(() => {
        console.log("Updated billByReservation:", billByReservation);
    }, [billByReservation]);



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

    //CREATE ORDER
    const [showModalCreateOrder, setShowModalCreateOrder] = useState(false);
    const [serviceTypeList, setServiceTypeList] = useState([]);
    const [serviceList, setServiceList] = useState([]);
    const [selectedServiceType, setSelectedServiceType] = useState(''); // Add state for selected city



    const openModalCreateOrder = (reservationId) => {
        setShowModalCreateOrder(true);
        setShowCheckOutModal(false);
        if (reservationId) {
            serviceTypeService
                .getAllServiceType()
                .then((res) => {
                    // Filter out services with the name "Hoàn tiền hủy đặt phòng"
                    const filteredServiceTypes = res.data.filter(
                        (serviceType) => serviceType.serviceTypeName !== "Hoàn tiền hủy đặt phòng"
                    );
                    setServiceTypeList(filteredServiceTypes);
                })
                .catch((error) => {
                    console.error(error);
                });
        }

    };


    useEffect(() => {
        if (selectedServiceType) {
            serviceTypeService
                .getAllServiceByServiceType(selectedServiceType)
                .then((res) => {
                    setServiceList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            setServiceList([]); // Clear service list if no service type is selected
        }
    }, [selectedServiceType]);

    const sortedServices = serviceList.some(service => service.serviceType?.serviceTypeName === "Trả phòng muộn")
        ? serviceList
            .filter(service => service.serviceType?.serviceTypeName === "Trả phòng muộn")
            .sort((a, b) => parseInt(a.serviceName) - parseInt(b.serviceName)) // Sort by serviceName as integer
        : serviceList; // No sorting for other conditions


    const handleChangeCreateOrderDetail = (e) => {
        const { name, value } = e.target;
        setCreateOrderDetail(prevState => ({ ...prevState, [name]: value }));
    };


    const closeModalCreateOrder = () => {
        setShowModalCreateOrder(false);
        setShowCheckOutModal(true);
        setServiceList([]);
    };

    const [createOrderDetail, setCreateOrderDetail] = useState({
        quantity: 1, // Initialize quantity to 1 or desired default
    });

    // Function to handle quantity increment
    const incrementQuantity = () => {
        setCreateOrderDetail((prevState) => ({
            ...prevState,
            quantity: prevState.quantity + 1 // Increment the quantity
        }));
    };

    // Function to handle quantity decrement
    const decrementQuantity = () => {
        setCreateOrderDetail((prevState) => ({
            ...prevState,
            quantity: Math.max(1, prevState.quantity - 1) // Decrement the quantity, ensuring it doesn't go below 1
        }));
    };

    const submitCreateOrder = async (e) => {
        e.preventDefault();

        try {
            if (selectedReservationId) {
                const createOrder = {
                    reservationId: selectedReservationId,
                    totalAmount: 0,
                    orderStatus: "Confirmed"
                }
                // Post the hotel first
                const orderResponse = await orderService.saveOrder(createOrder);

                // Handle 201 success
                if (orderResponse.status === 201) {
                    const orderId = orderResponse.data.orderId;

                    createOrderDetail.orderId = orderId;
                    console.log(JSON.stringify(createOrderDetail))
                    const orderDetailResponse = await orderDetailService.saveOrderDetail(createOrderDetail);
                    if (orderDetailResponse.status === 201) {
                        reservationService
                            .getAllOrderDetailByReservationId(selectedReservationId)
                            .then((res) => {
                                // Filter for order details where orderStatus is "Confirmed"
                                const confirmedOrderDetails = res.data
                                    .filter((orderDetail) => orderDetail.order?.orderStatus === "Confirmed")
                                    // Sort by orderedDate in descending order (newest first)
                                    .sort((a, b) => new Date(b.orderedDate) - new Date(a.orderedDate));

                                // Set the sorted and filtered order details list
                                setOrderDetailList(confirmedOrderDetails);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                        setShowCheckOutModal(true);
                        setShowModalCreateOrder(false);
                    }
                } else {
                    handleResponseError(orderResponse);
                }
            }

        } catch (error) {
            handleResponseError(error.response);
        }
    };

    //END CREATE ORDER

    //START CHECKOUT
    const [loading, setLoading] = useState(false);

    const totalAmount = orderDetailList.reduce((total, item) => total + (item.order?.totalAmount || 0), 0)
        + reservation.totalAmount;

    const amountToPay = orderDetailList.reduce((total, item) => total + (item.order?.totalAmount || 0), 0)
        + (reservation.isPrePaid === false ? reservation.totalAmount : 0)

    const handlePay = async (reservationId, totalAmount) => {
        const createBill = {
            reservationId: reservationId,
            totalAmount: totalAmount
        };

        try {
            if (amountToPay === 0) {
                setError({ general: `Số tiền không hợp lệ` });
                setShowError(true);
                setLoading(false);
                return;
            }
            else {
                setLoading(true); // Set loading to true when payment is initiated

                console.log("Payload to create bill:", JSON.stringify(createBill));
                const billResponse = await billService.saveBill(createBill);

                if (billResponse.status === 201) {
                    // Proceed with payment logic
                    try {
                        const paymentResponse = await billService.payBill(billResponse.data.billId);
                        window.open(paymentResponse.data, '_blank');

                        // Refresh the bill info after payment
                        reservationService
                            .getBillByReservation(reservationId)
                            .then((res) => {
                                setBillByReservation(res.data);
                                console.log(res.data);
                            })
                            .catch((error) => {
                                console.log(error);
                            });

                        // Optionally, you can check for reservation status here and stop loading
                        const checkReservationStatus = setInterval(() => {
                            reservationService.getReservationById(reservationId)
                                .then((res) => {
                                    if (res.data.paymentStatus === "Paid") {
                                        clearInterval(checkReservationStatus); // Stop checking when paid
                                        setLoading(false); // Set loading to false once paid
                                        // Optionally, refresh reservation info
                                        openCheckOutModal(reservationId);

                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        }, 2000); // Check every 2 seconds
                    } catch (paymentError) {
                        console.error("Payment Error:", paymentError.response.data);
                        window.alert("Error processing payment!");
                        setLoading(false); // Stop loading if payment fails
                    }
                } else {
                    window.alert("Đã tồn tại hóa đơn!");
                    setLoading(false); // Stop loading if the bill already exists
                }
            }

        } catch (error) {
            window.alert("Đã tồn tại hóa đơn!");
            setLoading(false); // Stop loading if there is an error creating the bill
        }
    };


    const handlePayBill = async (billId, reservationId) => {

        try {
            billService
                .payBill(billId)
                .then((res) => {
                    window.open(res.data, '_blank');

                })
                .catch((error) => {
                    console.log(error);
                });
            // Optionally, you can check for reservation status here and stop loading
            const checkReservationStatus = setInterval(() => {
                reservationService.getReservationById(reservationId)
                    .then((res) => {
                        if (res.data.paymentStatus === "Paid") {
                            clearInterval(checkReservationStatus); // Stop checking when paid
                            // Optionally, refresh reservation info
                            openCheckOutModal(reservationId);

                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }, 2000); // Check every 2 seconds

        } catch (error) {
            handleResponseError(error.response);
        }
    };

    const handleCreatebill = async (reservationId, totalAmount) => {
        const createBill = {
            reservationId: reservationId,
            totalAmount: totalAmount
        };
        try {
            console.log("Payload to create bill:", JSON.stringify(createBill));
            const billResponse = await billService.saveBill(createBill);

            if (billResponse.status === 201) {
                // Proceed with payment logic
                try {
                    reservationService
                        .getBillByReservation(reservationId)
                        .then((res) => {
                            setBillByReservation(res.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    reservationService
                        .getReservationById(reservationId)
                        .then((res) => {
                            setReservation(res.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        });

                } catch (paymentError) {
                    console.error("Payment Error:", paymentError.response.data);
                }
            } else {
                window.alert("Đã tồn tại hóa đơn!");
                setLoading(false); // Stop loading if the bill already exists
            }

        } catch (error) {
            window.alert("Đã tồn tại hóa đơn!");
            setLoading(false); // Stop loading if there is an error creating the bill
        }
    };

    const handleDeleteBill = async (billId, reservationId) => {

        try {
            const billResponse = await billService.deleteBillById(billId);
            if (billResponse.status === 200) {
                reservationService
                    .getBillByReservation(reservationId)
                    .then((res) => {
                        setBillByReservation(res.data);
                        console.log(res.data)
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                window.alert("Không thể xóa!")
            }

        } catch (error) {
            handleResponseError(error.response);
        }
    };


    const [updateReservationStatus, setUpdateReservationStatus] = useState({

    });

    const submitUpdateReservationStatus = async (e, reservationId, reservationStatus) => {
        e.preventDefault();

        try {
            // Fetch the user data
            const res = await reservationService.getReservationById(reservationId);
            const reservationData = res.data;

            // Update the local state with the fetched data and new isActive flag
            setUpdateReservationStatus({ ...reservationData, reservationStatus });
            console.log(updateReservationStatus)
            // Make the update request
            const updateRes = await reservationService.updateReservation(reservationId, { ...reservationData, reservationStatus });
            console.log(updateRes)
            if (updateRes.status === 200) {
                setSuccess({ general: "Trả phòng thành công!" });
                setShowSuccess(true); // Show error
                openCheckOutModal(reservationId);
                handleSearch();
            } else {
                handleResponseError(error.response);
            }
        } catch (error) {
            handleResponseError(error.response);
        }
    };



    //END CHECKOUT


    //CREATE BILL TRANSACTION IMAGE:
    const [billTransactionImageList, setBillTransactionImageList] = useState([]);
    const [selectedBillId, setSelectedBillId] = useState(null);

    const [showModalCreateBillTransactionImage, setShowModalCreateBillTransactionImage] = useState(false);
    const closeModalCreateBillTransactionImage = () => {
        setShowModalCreateBillTransactionImage(false);
    };


    const openCreateBillTransactionImageModal = (billId) => {
        setShowModalCreateBillTransactionImage(true);
        setSelectedBillId(billId);
        billService
            .getAllBillTransactionImageByBillId(billId)
            .then((res) => {
                setBillTransactionImageList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });

    };
    const [selectedFile4, setSelectedFile4] = useState(null);

    // Handle file selection
    const handleFileChange4 = (event) => {
        setSelectedFile4(event.target.files[0]);
    };

    const [imageList4, setImageList4] = useState(billTransactionImageList);


    // Upload image and refresh the room image list without closing the modal
    const handleUploadAndPost4 = async () => {
        if (!selectedFile4) {
            alert("Chọn hình!");
            return;
        }

        try {
            // Prepare the FormData with the correct key expected by the API
            const formData = new FormData();
            formData.append("file", selectedFile4); // Adjust key if needed
            console.log([...formData.entries()]); // Logs the form data before submission

            // Upload the image to the API
            const uploadResponse = await roomImageService.uploadImage(formData);

            if (uploadResponse && uploadResponse.data) {
                const imageUrl = uploadResponse.data.link; // Extract the returned image URL from the response
                // Update roomImage object
                const createBillTransactionImage = {
                    billId: selectedBillId,
                    image: imageUrl,
                };

                // Save the room image to your database
                await billTransactionImageService.saveBillTransactionImage(createBillTransactionImage);

                // Refresh the room image list by calling the fetchRoomImages function
                fetchHotelBillTransactionImages(selectedBillId);

                // Optionally, update the local image list without refetching (in case you want instant visual feedback)
                setImageList4((prevList) => [...prevList, { image: imageUrl }]);

            }
        } catch (error) {
            console.error("Error uploading and posting image:", error);
        }
    };

    const fetchHotelBillTransactionImages = (billId) => {
        billService
            .getAllBillTransactionImageByBillId(billId)
            .then((res) => {
                setBillTransactionImageList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDeleteImage4 = async (billTransactionImageId) => {
        try {
            // Call the API to delete the image by roomImageId
            await billTransactionImageService.deleteBillTransactionImageById(billTransactionImageId);

            // After successful deletion, remove the image from the imageList
            setBillTransactionImageList(prevList => prevList.filter(item => item.billTransactionImageId !== billTransactionImageId));
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };


    //DELETE ORDER, ORDER DETAIL
    const handleDeleteOrderDetail = async (orderDetailId) => {
        try {
            // Call the API to delete the image by roomImageId
            await orderDetailService.deleteOrderDetailById(orderDetailId);

            // After successful deletion, remove the image from the imageList
            setOrderDetailList(prevList => prevList.filter(item => item.orderDetailId !== orderDetailId));
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };


    // RESERVATION BY ROOM TYPE
    const [reservationByRoomTypeList, setReservationByRoomTypeList] = useState([]);

    const [showModalReservationByRoomType, setShowModalReservationByRoomType] = useState(false);
    const closeModalReservationByRoomType = () => {
        setShowModalReservationByRoomType(false);
    };


    const openReservationByRoomTypeModal = (roomTypeId) => {
        setShowModalReservationByRoomType(true);
        // Clear the image list first to avoid showing images from the previous room type
        // setRoomImageList([]); // Reset roomImageList to an empty array
        if (roomTypeId) {
            roomTypeService
                .getAllReservationByRoomTypeId(roomTypeId)
                .then((res) => {
                    const sortedReservationList = [...res.data].sort((a, b) => {
                        // Assuming requestedDate is a string in ISO 8601 format
                        return new Date(b.createdDate) - new Date(a.createdDate);
                    });
                    setReservationByRoomTypeList(sortedReservationList);
                })
                .catch((error) => {
                    console.log(error);
                });

        }
    };
    const [reservationSearchTerm, setReservationSearchTerm] = useState('');
    const [currentReservationPage, setCurrentReservationPage] = useState(0);
    const [reservationsPerPage] = useState(10);
    const [selectedHotelId, setSelectedHotelId] = useState('');
    const uniqueHotels = [...new Set(reservationByRoomTypeList.map((reservation) => reservation.roomType?.hotel?.hotelName))]
        .filter(Boolean);

    const handleReservationSearch = (event) => {
        setReservationSearchTerm(event.target.value);
    };

    const filteredReservations = reservationByRoomTypeList
        .filter((reservation) => {
            const matchesType = selectedHotelId ? reservation.roomType?.hotel?.hotelName === selectedHotelId : true;
            const matchesSearchTerm = (
                reservation.code.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.customer?.name.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.customer?.code.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.customer?.email.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.customer?.phoneNumber.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.roomType?.type?.typeName.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.roomType?.hotel?.code.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.roomType?.hotel?.hotelName.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.createdDate.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.numberOfRooms?.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase())
            );
            return matchesType && matchesSearchTerm;
        });

    const pageReservationCount = Math.ceil(filteredReservations.length / reservationsPerPage);

    const handleReservationPageClick = (data) => {
        setCurrentReservationPage(data.selected);
    };

    const offsetReservation = currentReservationPage * reservationsPerPage;
    const currentReservations = filteredReservations.slice(offsetReservation, offsetReservation + reservationsPerPage);

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
            setError({ validation: validationErrors });
        } else {
            setError({ general: "An unexpected error occurred. Please try again." });
        }
        setShowError(true); // Show error modal or message
    };
    const [userDocumentList2, setUserDocumentList2] = useState([]);

    const [showModalUserDocument, setShowModalUserDocument] = useState(false);
    const closeModalUserDocument = () => {
        setShowModalUserDocument(false);
        setUserDocumentList2([]);
    };


    const openUserDocumentModal = (reservationId) => {
        setShowModalUserDocument(true);
        reservationService
            .getAllUserDocumentByReservation(reservationId)
            .then((res) => {
                setUserDocumentList2(res.data);
            })
            .catch((error) => {
                console.log(error);
            });

    };


    const handlePrint = () => {
        const printContent = document.getElementById('print-section').innerHTML;
        const iframe = document.createElement('iframe');

        iframe.style.position = 'absolute';
        iframe.style.top = '-10000px'; // Hide the iframe
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`
            <html>
                <head><title>Print</title></head>
                <body>${printContent}</body>
            </html>
        `);
        doc.close();

        iframe.contentWindow.focus();
        iframe.contentWindow.print();

        // Remove the iframe after printing
        setTimeout(() => document.body.removeChild(iframe), 1000);
    };

    const formatter = new Intl.NumberFormat('en-US');


    return (
        <>
            <Header />
            <SideBar />
            <div className="content-wrapper" style={{ textAlign: 'left', display: 'block' }}>
                {/* Page Heading */}
                <div className="page-heading d-flex align-items-center justify-content-between">
                    <h2 className="page-title">Nhận phòng / Trả phòng</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="index.html">
                                <i className="la la-home font-20" />
                            </a>
                        </li>
                        <li className="breadcrumb-item active">Nhận phòng / Trả phòng</li>
                    </ol>
                </div>

                <div className="page-content">
                    <div className="card shadow-lg border-0 rounded">
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Tìm kiếm Đặt Phòng</h4>
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
                                            placeholder="Nhập mã đặt phòng, tên khách hàng, số điện thoại, email hoặc số căn cước"
                                            value={customerSearch}
                                            onChange={(e) => setCustomerSearch(e.target.value)}
                                        />
                                        <button className="btn btn-primary input-group-append ml-2" onClick={handleSearch}>
                                            <i class="fa fa-search" aria-hidden="true"></i> Tìm
                                        </button>
                                    </div>
                                </div>

                                {/* Reservation Details */}
                                {reservationDetails && reservationDetails.length > 0 ? (
                                    <div className="reservation-details mt-4">
                                        <h5 className="mb-4 mt-2 ml-2" style={{ fontWeight: 'bold' }}>Chi Tiết Đặt Phòng</h5>
                                        {reservationDetails.map((reservation, index) => (
                                            <div key={index} className="card mb-3 border-light shadow-sm">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <p><strong className='mr-2'>Mã số:</strong> {reservation.code}</p>
                                                            <p><strong className='mr-2'>Tên khách hàng:</strong> {reservation.customer?.name}</p>
                                                            <p><strong className='mr-2'>Số căn cước:</strong> {reservation.customer?.identificationNumber}</p>
                                                            <p><strong className='mr-2'>Email:</strong> {reservation.customer?.email}</p>
                                                            <p><strong className='mr-2'>Số điện thoại:</strong> {reservation.customer?.phoneNumber}</p>
                                                            <p><strong className='mr-2'>Ngày dự kiến nhận phòng:</strong> {new Date(reservation.checkInDate).toLocaleDateString('en-US')}</p>
                                                            <p><strong className='mr-2'>Ngày dự kiến trả phòng:</strong> {new Date(reservation.checkOutDate).toLocaleDateString('en-US')}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <p><strong className='mr-2'>Loại phòng:</strong> {reservation.roomType?.type?.typeName}</p>
                                                            <p><strong className='mr-2'>Số lượng đặt:</strong> {reservation.numberOfRooms} phòng</p>
                                                            <p><strong className='mr-2'>Tổng số tiền:</strong> {formatter.format(reservation.totalAmount)}₫</p>
                                                            <p>
                                                                <strong className='mr-2'>Trạng thái đặt phòng:</strong>
                                                                {reservation.reservationStatus === "CheckIn" ? (
                                                                    <span className="badge label-table badge-success">Đã nhận phòng</span>
                                                                ) : reservation.reservationStatus === "Cancelled" ? (
                                                                    <span className="badge label-table badge-danger">Đã hủy</span>
                                                                ) : reservation.reservationStatus === "Pending" ? (
                                                                    <span className="badge label-table badge-warning">Đang chờ</span>
                                                                ) : reservation.reservationStatus === "CheckOut" ? (
                                                                    <span className="badge label-table badge-danger">Đã trả phòng</span>
                                                                ) : reservation.reservationStatus === "Refunded" ? (
                                                                    <span className="badge label-table badge-danger">Đã hoàn tiền</span>
                                                                ) : (
                                                                    <span className="badge label-table badge-warning">Unknown Status</span>
                                                                )}
                                                            </p>
                                                            <p className="mb-2"><strong className='mr-2'>Trạng thái thanh toán:</strong>
                                                                {
                                                                    reservation.isPrePaid && reservation.paymentStatus === "Paid" && (
                                                                        <span className="badge label-table badge-success">
                                                                            <i className="fa fa-check-circle" aria-hidden="true"></i> Đã thanh toán
                                                                        </span>
                                                                    )
                                                                }

                                                                {
                                                                    reservation.isPrePaid && reservation.paymentStatus === "Not Paid" && (
                                                                        <span className="badge label-table badge-warning">
                                                                            <i className="fa fa-clock" aria-hidden="true"></i> Đã thanh toán trước
                                                                        </span>
                                                                    )
                                                                }

                                                                {
                                                                    !reservation.isPrePaid && reservation.paymentStatus === "Paid" && (
                                                                        <span className="badge label-table badge-success">
                                                                            <i className="fa fa-credit-card" aria-hidden="true"></i> Đã thanh toán
                                                                        </span>
                                                                    )
                                                                }

                                                                {
                                                                    !reservation.isPrePaid && reservation.paymentStatus === "Not Paid" && (
                                                                        <span className="badge label-table badge-danger">
                                                                            <i className="fa fa-times-circle" aria-hidden="true"></i> Chưa thanh toán
                                                                        </span>
                                                                    )
                                                                }

                                                            </p>

                                                            <p><strong className='mr-2'>Khách sạn:</strong> {reservation.roomType?.hotel?.hotelName}</p>
                                                            <p><strong className='mr-2'>Ngày đặt:</strong> {new Date(reservation.createdDate).toLocaleString('en-US')}</p>


                                                        </div>
                                                    </div>
                                                    {/* Action Buttons for Each Reservation */}
                                                    <div className="mt-4 d-flex gap-3">
                                                        {reservation.reservationStatus === "Pending" && (
                                                            <button className="btn btn-success " onClick={() =>
                                                                openPickRoomModal(reservation.roomTypeId, reservation.numberOfRooms, reservation.reservationId)} >
                                                                <i class="fa fa-calendar-check-o" aria-hidden="true"></i> Nhận phòng
                                                            </button>
                                                        )}
                                                        {reservation.reservationStatus === "CheckIn" && (
                                                            <button disabled className="btn btn-success mr-2" onClick={() =>
                                                                openPickRoomModal(reservation.roomTypeId, reservation.numberOfRooms, reservation.reservationId)} >
                                                                <i class="fa fa-calendar-check-o" aria-hidden="true"></i> Nhận phòng
                                                            </button>
                                                        )}
                                                        {reservation.reservationStatus === "CheckOut" && (
                                                            <button disabled className="btn btn-success mr-2">
                                                                <i class="fa fa-calendar-check-o" aria-hidden="true"></i> Nhận phòng
                                                            </button>
                                                        )}
                                                        {reservation.reservationStatus === "CheckOut" && (
                                                            <button className="btn btn-danger mr-2" onClick={() =>
                                                                openCheckOutModal(reservation.reservationId)}>
                                                                <i class="fa fa-calendar-times-o" aria-hidden="true"></i> Trả phòng
                                                            </button>
                                                        )}

                                                        {reservation.reservationStatus === "CheckIn" && (
                                                            <button className="btn btn-danger ml-2" onClick={() =>
                                                                openCheckOutModal(reservation.reservationId)}>
                                                                <i class="fa fa-calendar-times-o" aria-hidden="true"></i> Trả phòng
                                                            </button>
                                                        )}
                                                        {reservation.reservationStatus === "Pending" && (
                                                            <button disabled className="btn btn-danger ml-2" onClick={() =>
                                                                openCheckOutModal(reservation.reservationId)}>
                                                                <i class="fa fa-calendar-times-o" aria-hidden="true"></i> Trả phòng
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
                                    <h5 className="modal-title">Nhận Phòng Cho Khách Hàng</h5>
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


                                        <div className="col-md-7" style={{ fontSize: '15px' }}>
                                            <table className="table table-responsive table-hover mt-3">
                                                <tbody>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Loại phòng:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{roomType.type?.typeName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Diện tích:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{roomType.roomSize} m²</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Tổng số phòng:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{roomType.totalRooms} phòng</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Số phòng còn trống:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{roomType.availableRooms} phòng</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Số phòng cần đặt:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{reservation.numberOfRooms} phòng</td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                            <div>
                                                <h3 className="text-primary" style={{ textAlign: 'left', fontWeight: 'bold' }}>Danh sách phòng</h3>
                                                <div className="room-list">
                                                    {roomList.map((room) => (
                                                        <div
                                                            key={room.roomNumber}
                                                            className="room-box"

                                                            style={{
                                                                backgroundColor: room.status === 'Available' ? 'green' :
                                                                    room.status === 'Occupied' ? 'red' :
                                                                        '#E4A11B',
                                                                position: 'relative',
                                                                textAlign: 'center',
                                                                flex: '0 1 auto',
                                                                margin: '5px'
                                                            }}
                                                        >
                                                            <p onClick={() => openRoomModal(room.roomId)}>{room.roomNumber}</p>
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
                                                <h3 className="text-primary" style={{ textAlign: 'left', fontWeight: 'bold' }}>Tiện ích phòng</h3>
                                                <td style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', margin: 0 }}>
                                                    {
                                                        roomFacilities.length > 0 ? roomFacilities.map((item, index) => (
                                                            <div key={index} style={{
                                                                position: 'relative',
                                                                textAlign: 'center',
                                                                flex: '0 1 auto',
                                                                margin: '5px',
                                                                padding: '8px 12px',
                                                                backgroundColor: '#e57373',
                                                                color: 'white',
                                                                borderRadius: '15px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                                                            }}>
                                                                <span >{item.facility?.facilityName}</span>

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
                                                <button type="submit" className="btn btn-primary" ><i class="fa fa-calendar-check-o" aria-hidden="true"></i> Nhận phòng</button>
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
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Thanh Toán Phòng {reservation.roomType?.type?.typeName}</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeCheckOutModal}>
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
                                <div className="container-fluid">
                                    {/* Reservation Information */}
                                    <div className='row' id='print-section'>
                                        <div className="col-md-4" style={{ textAlign: 'left' }}>
                                            <h5>Thông Tin Khách Hàng</h5>
                                            <p className="mb-1" ><strong className='mr-2'>Họ và tên:</strong> {reservation.customer?.name}</p>
                                            <p className="mb-1"><strong className='mr-2'>Email:</strong> {reservation.customer?.email}</p>
                                            <p className="mb-1"><strong className='mr-2'>Số điện thoại:</strong> {reservation.customer?.phoneNumber}</p>
                                            <p><strong className='mr-2'>Số căn cước:</strong> {reservation.customer?.identificationNumber}&nbsp;<button
                                                type="button"
                                                className="btn btn-default btn-xs"
                                                data-toggle="tooltip"
                                                data-original-title="Activate"
                                                onClick={() => openUserDocumentModal(reservation.reservationId)}
                                            >
                                                <i class="fa fa-file-image-o text-warning" aria-hidden="true"></i>

                                            </button></p>
                                        </div>
                                        <div className="col-md-4" style={{ textAlign: 'left' }}>
                                            <h5>Thông Tin Phòng</h5>
                                            <p className="mb-1"><strong className='mr-2'> Ngày nhận phòng:</strong> {new Date(reservation.checkInDate).toLocaleDateString('en-US')}</p>
                                            <p className="mb-1"><strong className='mr-2'> Ngày trả phòng:</strong> {new Date(reservation.checkOutDate).toLocaleDateString('en-US')}</p>
                                            <p className="mb-1"><strong className='mr-2'>Loại phòng:</strong> {reservation.roomType?.type?.typeName}
                                                <button className="btn btn-default btn-xs m-l-5 text-primary"
                                                    data-toggle="tooltip" data-original-title="Edit">
                                                    <i className="fa fa-eye font-14"
                                                        onClick={() => openReservationByRoomTypeModal(reservation.roomTypeId)} />
                                                </button>
                                            </p>
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
                                            <p className="mb-1"><strong className='mr-2'>Mã số:</strong> {reservation.code}</p>
                                            <p className="mb-1"><strong className='mr-2'>Trạng thái đặt phòng:</strong>
                                                {reservation.reservationStatus === "Pending" && (
                                                    <span className="badge label-table badge-warning">Đang chờ</span>
                                                )}
                                                {reservation.reservationStatus === "CheckIn" && (
                                                    <span className="badge label-table badge-success">Đã nhận phòng</span>
                                                )}
                                                {reservation.reservationStatus === "CheckOut" && (
                                                    <span className="badge label-table badge-danger">Đã trả phòng</span>
                                                )}
                                                {reservation.reservationStatus === "Cancelled" && (
                                                    <span className="badge label-table badge-danger">Đã hủy</span>
                                                )}
                                                {reservation.reservationStatus === "Refunded" && (
                                                    <span className="badge label-table badge-danger">Đã hoàn tiền</span>
                                                )}
                                            </p>
                                            <p className="mb-1"><strong className='mr-2'>Trạng thái thanh toán:</strong>
                                                {
                                                    reservation.isPrePaid && reservation.paymentStatus === "Paid" && (
                                                        <span className="badge label-table badge-success">
                                                            <i className="fa fa-check-circle" aria-hidden="true"></i> Đã thanh toán
                                                        </span>
                                                    )
                                                }

                                                {
                                                    reservation.isPrePaid && reservation.paymentStatus === "Not Paid" && (
                                                        <span className="badge label-table badge-warning">
                                                            <i className="fa fa-clock" aria-hidden="true"></i> Đã thanh toán trước
                                                        </span>
                                                    )
                                                }

                                                {
                                                    !reservation.isPrePaid && reservation.paymentStatus === "Paid" && (
                                                        <span className="badge label-table badge-success">
                                                            <i className="fa fa-credit-card" aria-hidden="true"></i> Đã thanh toán
                                                        </span>
                                                    )
                                                }

                                                {
                                                    !reservation.isPrePaid && reservation.paymentStatus === "Not Paid" && (
                                                        <span className="badge label-table badge-danger">
                                                            <i className="fa fa-times-circle" aria-hidden="true"></i> Chưa thanh toán
                                                        </span>
                                                    )
                                                }

                                            </p>
                                            {reservation.isPrePaid === true && (
                                                <p className="mb-1"><strong className='mr-2'>Cần thanh toán:</strong>0₫</p>
                                            )}
                                            {reservation.isPrePaid === false && (
                                                <p className="mb-1"><strong className='mr-2'>Cần thanh toán:</strong>{formatter.format(reservation.totalAmount)}₫</p>
                                            )}

                                        </div>
                                        {/* Divider */}
                                        <div className="col-md-12">
                                            <hr />
                                        </div>
                                        <div className="col-md-12" style={{ textAlign: 'left' }}>
                                            <h5>
                                                <i className="fa fa-clock-o text-primary" aria-hidden="true"></i> Tiền phòng:&nbsp;
                                                <span style={{ fontWeight: 'bold' }}>{formatter.format(reservation.totalAmount)}₫
                                                </span> {
                                                    reservation.isPrePaid === true && (

                                                        <span style={{ fontStyle: 'italic' }}>(Đã thanh toán trước)</span>
                                                    )
                                                }
                                            </h5>
                                        </div>
                                        {/* Divider */}
                                        <div className="col-md-12">
                                            <hr />
                                        </div>
                                        <div className="col-md-12" style={{ textAlign: 'left' }}>
                                            <h5><i className="fa fa-life-ring text-danger" aria-hidden="true"></i> Tiền dịch vụ: <span style={{ fontWeight: 'bold' }}>{formatter.format(orderDetailList.reduce((total, item) => total + (item.order?.totalAmount || 0), 0))
                                            }₫</span></h5>
                                            <div className="table-responsive">
                                                <table className="table table-borderless table-hover table-wrap table-centered">
                                                    <thead>
                                                        <tr>
                                                            <th><span>STT</span></th>
                                                            <th><span>Hình ảnh</span></th>
                                                            <th><span>Tên dịch vụ</span></th>
                                                            <th><span>Số lượng</span></th>
                                                            <th><span>Loại dịch vụ</span></th>
                                                            <th><span>Giá (₫)</span></th>
                                                            {

                                                                reservation.reservationStatus === "CheckIn" && (
                                                                    <>
                                                                        <th><span>Hành động</span></th>
                                                                    </>
                                                                )
                                                            }
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            orderDetailList.length > 0 && orderDetailList.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    {
                                                                        item.service?.serviceType?.serviceTypeName === "Trả phòng muộn" && (
                                                                            <>
                                                                                <td>
                                                                                    <i className="fa fa-calendar-times-o fa-4x" aria-hidden="true"></i>
                                                                                </td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        item.service?.serviceType?.serviceTypeName !== "Trả phòng muộn" && (
                                                                            <>
                                                                                <td>
                                                                                    <img src={item.service?.image} alt="avatar" style={{ width: "120px", height: '100px' }} />
                                                                                </td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        item.service?.serviceType?.serviceTypeName === "Trả phòng muộn" && (
                                                                            <>
                                                                                <td>Muộn {item.service?.serviceName} ngày</td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        item.service?.serviceType?.serviceTypeName !== "Trả phòng muộn" && (
                                                                            <>
                                                                                <td>{item.service?.serviceName}</td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    <td>{item.quantity}</td>
                                                                    <td>{item.service?.serviceType?.serviceTypeName}</td>
                                                                    {
                                                                        item.service?.serviceType?.serviceTypeName === "Trả phòng muộn" && (
                                                                            <>
                                                                                <td>{formatter.format(item.order?.totalAmount)}</td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        item.service?.serviceType?.serviceTypeName !== "Trả phòng muộn" && (
                                                                            <>
                                                                                <td>{formatter.format(item.order?.totalAmount)}</td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {

                                                                        reservation.reservationStatus === "CheckIn" && (
                                                                            <>
                                                                                <td>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-default btn-xs m-r-5"
                                                                                        data-toggle="tooltip"
                                                                                        data-original-title="Activate"
                                                                                        onClick={() => handleDeleteOrderDetail(item.orderDetailId)}>
                                                                                        <i class="fa fa-trash-o text-danger" aria-hidden="true"></i>

                                                                                    </button>
                                                                                </td>
                                                                            </>
                                                                        )
                                                                    }

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
                                            {

                                                reservation.reservationStatus === "CheckIn" && (
                                                    <>
                                                        <button className='btn btn-success' onClick={() => openModalCreateOrder(reservation.reservationId)}>Thêm <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                                        </button>
                                                    </>
                                                )
                                            }


                                            {/* Calculate and display total amount */}
                                            <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                                <h5>
                                                    <span style={{ fontWeight: 'bold' }}>Số tiền cần thanh toán: &nbsp;</span>
                                                    {formatter.format(orderDetailList.reduce((total, item) => total + (item.order?.totalAmount || 0), 0)
                                                        + (reservation.isPrePaid === false ? reservation.totalAmount : 0))}₫
                                                </h5>
                                            </div>

                                        </div>
                                        {/* Divider */}
                                        <div className="col-md-12">
                                            <hr />
                                        </div>


                                    </div>
                                    <div className='row'>
                                        <div className="col-md-12" style={{ textAlign: 'left' }}>
                                            <h5>
                                                <i className="fa fa-file-text text-success"></i>  Hóa đơn:
                                            </h5>
                                            <div className="table-responsive">
                                                <table className="table table-borderless table-hover table-wrap table-centered">
                                                    <thead>
                                                        <tr>
                                                            <th><span>STT</span></th>
                                                            <th><span>Ngày tạo</span></th>
                                                            <th><span>Tổng số tiền (₫)</span></th>
                                                            <th><span>Trạng thái</span></th>
                                                            {
                                                                billByReservation && (
                                                                    billByReservation.billStatus !== "Paid" && (
                                                                        <>
                                                                            <th><span>Hành động</span></th>

                                                                        </>
                                                                    )
                                                                )

                                                            }
                                                            {
                                                                billByReservation && (
                                                                    billByReservation.billStatus === "Paid" && (
                                                                        <>
                                                                            <th><span>Hành động</span></th>

                                                                        </>
                                                                    )
                                                                )

                                                            }
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            billByReservation && (
                                                                <tr>
                                                                    <td>1</td>
                                                                    <td>{new Date(billByReservation.createdDate).toLocaleString('en-US')}</td>
                                                                    <td>{formatter.format(billByReservation.totalAmount)}</td>
                                                                    {
                                                                        billByReservation.billStatus === "Pending" && (
                                                                            <>
                                                                                <td><span className="badge label-table badge-warning">Đang chờ</span></td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        billByReservation.billStatus === "Paid" && (
                                                                            <>
                                                                                <td><span className="badge label-table badge-success">Đã thanh toán</span></td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    <td>
                                                                        {
                                                                            billByReservation.billStatus === "Paid" && (
                                                                                <>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-default btn-xs m-r-5"
                                                                                        data-toggle="tooltip"
                                                                                        data-original-title="Activate"
                                                                                        onClick={() => openCreateBillTransactionImageModal(billByReservation.billId)}                                                                            >
                                                                                        <i class="fa fa-file-image-o text-warning" aria-hidden="true"></i>

                                                                                    </button>
                                                                                </>
                                                                            )
                                                                        }
                                                                        {
                                                                            billByReservation.billStatus !== "Paid" && (
                                                                                <>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-default btn-xs m-r-5"
                                                                                        data-toggle="tooltip"
                                                                                        data-original-title="Activate"
                                                                                        onClick={() => handlePayBill(billByReservation.billId, billByReservation.reservationId)} // Activate
                                                                                    >
                                                                                        <i className="fa fa-credit-card-alt text-success" aria-hidden="true"></i>
                                                                                    </button>

                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-default btn-xs m-r-5"
                                                                                        data-toggle="tooltip"
                                                                                        data-original-title="Activate"
                                                                                        onClick={() => handleDeleteBill(billByReservation.billId, billByReservation.reservationId)}                                                                            >
                                                                                        <i className="fa fa-times text-danger" aria-hidden="true"></i>
                                                                                    </button>

                                                                                </>
                                                                            )
                                                                        }

                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                                {
                                                    !billByReservation && (
                                                        <>
                                                            <p className='text-center' style={{ fontStyle: 'italic', color: 'gray' }}>Không có</p>
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                {loginUser.role?.roleName === "Receptionist" && (
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={handlePrint}
                                    >
                                        <i className="fa fa-print" aria-hidden="true"></i>&nbsp;In
                                    </button>
                                )}

                                {
                                    reservation.reservationStatus === "CheckIn" && (
                                        <>
                                            {loginUser.role?.roleName === "Receptionist" && (
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => handleCreatebill(reservation.reservationId, totalAmount)}
                                                >

                                                    <span>
                                                        <i className="fa fa-money" aria-hidden="true"></i>&nbsp;Tạo hóa đơn
                                                    </span>
                                                </button>
                                            )}


                                            {loginUser.role?.roleName === "Receptionist" && (
                                                <form
                                                    id="demo-form"
                                                    onSubmit={(e) => submitUpdateReservationStatus(e, reservation.reservationId, updateReservationStatus.reservationStatus)}
                                                    className="d-inline"
                                                >
                                                    {
                                                        reservation.paymentStatus === "Paid" && (
                                                            <>
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-primary"
                                                                    onClick={() => setUpdateReservationStatus({ ...setUpdateReservationStatus, reservationStatus: "CheckOut" })}
                                                                >
                                                                    <i className="fa fa-calendar-times-o" aria-hidden="true"></i> Trả Phòng
                                                                </button>
                                                            </>
                                                        )
                                                    }

                                                </form>
                                            )}
                                        </>
                                    )
                                }
                            </div>



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
            {showModalCreateOrder && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                        <div className="modal-content">
                            <form onSubmit={(e) => submitCreateOrder(e)}>

                                <div className="modal-header  bg-dark text-light">
                                    <h5 className="modal-title">Thêm dịch vụ</h5>
                                    <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalCreateOrder}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-6" style={{ textAlign: 'left' }}>
                                            <label>Loại dịch vụ</label>
                                            <select
                                                className="form-control"
                                                onChange={(e) => {
                                                    setSelectedServiceType(e.target.value); // Update selected city
                                                }}
                                                required
                                                style={{ height: '50px' }}
                                            >
                                                <option value="">Chọn loại dịch vụ</option>
                                                {serviceTypeList.map((type) => (
                                                    <option key={type.serviceTypeId} value={type.serviceTypeId}>
                                                        {type.serviceTypeName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6" style={{ textAlign: 'left' }}>
                                            <label>Dịch vụ</label>
                                            <select
                                                name='serviceId'
                                                className="form-control"
                                                value={createOrderDetail.serviceId}
                                                onChange={(e) => handleChangeCreateOrderDetail(e)}
                                                required
                                                style={{ height: '50px' }}
                                            >
                                                <option value="">Chọn dịch vụ</option>
                                                {sortedServices.map((service) => (
                                                    <option key={service.serviceId} value={service.serviceId}>
                                                        {
                                                            service.serviceType?.serviceTypeName === "Trả phòng muộn" && (
                                                                <>
                                                                    {service.serviceName} ngày
                                                                </>
                                                            )
                                                        }
                                                        {
                                                            service.serviceType?.serviceTypeName !== "Trả phòng muộn" && (
                                                                <>
                                                                    {service.serviceName}
                                                                </>
                                                            )
                                                        }

                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6 mt-2" style={{ textAlign: 'left' }}>
                                            <label>Số lượng</label>
                                            <div className="input-group">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={decrementQuantity} // Call decrement function on click
                                                >
                                                    -
                                                </button>
                                                <input
                                                    name='quantity'
                                                    type="number"
                                                    className="form-control"
                                                    value={createOrderDetail.quantity}
                                                    readOnly // Make it read-only to prevent direct input
                                                    style={{ height: '50px', textAlign: 'center' }} // Center the text in the input
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={incrementQuantity} // Call increment function on click
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                    </div>


                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-success"><i class="fa fa-floppy-o" aria-hidden="true"></i> Lưu</button>
                                    <button type="button" className="btn btn-dark" onClick={closeModalCreateOrder} >Đóng</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )}

            {showModalCreateBillTransactionImage && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Tải Lên Hình Ảnh Chuyển Tiền</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalCreateBillTransactionImage}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                <div className="row">
                                    <div className="col-md-12" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {
                                            billTransactionImageList.length > 0 ? (
                                                billTransactionImageList.map((item, index) => (
                                                    <div key={index} style={{ flex: '1 0 50%', textAlign: 'center', margin: '10px 0', position: 'relative' }}>
                                                        <img src={item.image} alt="Room" style={{ width: "250px", height: "200px" }} />
                                                        {
                                                            loginUser.role?.roleName === "Receptionist" && (
                                                                <>
                                                                    {/* Delete Icon/Button */}
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
                                                                        onClick={() => handleDeleteImage4(item.hotelDocumentId)}
                                                                    >
                                                                        &times; {/* This represents the delete icon (X symbol) */}
                                                                    </button>
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                ))
                                            ) : (
                                                <>
                                                    <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                </>
                                            )
                                        }


                                        {
                                            loginUser.role?.roleName === "Receptionist" && (
                                                <>
                                                    <div className="form-group mt-3">
                                                        <input type="file" onChange={handleFileChange4} />
                                                        <button type="button" className="btn btn-success mt-2" onClick={handleUploadAndPost4}>
                                                            + Tải file
                                                        </button>
                                                    </div>
                                                </>
                                            )
                                        }

                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalCreateBillTransactionImage} >Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
            {showModalReservationByRoomType && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content" style={{ textAlign: 'left' }}>
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Danh Sách Đặt Phòng</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalReservationByRoomType}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                {/* start ibox */}
                                <div className="table-responsive">
                                    <table className="table table-borderless table-hover table-wrap table-centered">
                                        <thead>
                                            <tr>
                                                <th><span>STT</span></th>
                                                <th><span>Mã số</span></th>
                                                <th><span>Khách hàng</span></th>
                                                <th><span>Loại phòng</span></th>
                                                <th><span>Số lượng</span></th>
                                                <th><span>Ngày đặt</span></th>
                                                <th><span>Ngày dự kiến nhận phòng</span></th>
                                                <th><span>Ngày dự kiến trả phòng</span></th>
                                                <th><span>Trạng thái</span></th>
                                                {/* <th><span>Hành động</span></th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                currentReservations.length > 0 && currentReservations.map((item, index) => (
                                                    <>
                                                        <tr>
                                                            <td>{index + 1}</td>
                                                            <td>{item.code}</td>
                                                            <td>
                                                                {item.customer?.name}
                                                            </td>
                                                            <td>{item.roomType?.type?.typeName}</td>
                                                            <td>{item.numberOfRooms}</td>
                                                            <td> {new Date(item.createdDate).toLocaleString('en-US')}</td>
                                                            <td> {new Date(item.checkInDate).toLocaleDateString('en-US')}</td>
                                                            <td> {new Date(item.checkOutDate).toLocaleDateString('en-US')}</td>
                                                            <td>
                                                                {item.reservationStatus === "Pending" && (
                                                                    <span className="badge label-table badge-warning">Đang chờ</span>
                                                                )}
                                                                {item.reservationStatus === "CheckIn" && (
                                                                    <span className="badge label-table badge-success">Đã nhận phòng</span>
                                                                )}
                                                                {item.reservationStatus === "CheckOut" && (
                                                                    <span className="badge label-table badge-danger">Đã trả phòng</span>
                                                                )}
                                                                {item.reservationStatus === "Cancelled" && (
                                                                    <span className="badge label-table badge-danger">Đã hủy</span>
                                                                )}
                                                                {item.reservationStatus === "Refunded" && (
                                                                    <span className="badge label-table badge-danger">Đã hoàn tiền</span>
                                                                )}
                                                            </td>
                                                            {/* <td>
                                                                <button className="btn btn-default btn-xs m-r-5"
                                                                    data-toggle="tooltip" data-original-title="Edit">
                                                                    <i className="fa fa-pencil font-14 text-primary"
                                                                        onClick={() => openReservationModal(item.reservationId)} /></button>
                                                            </td> */}
                                                        </tr>
                                                    </>
                                                ))
                                            }


                                        </tbody>
                                    </table>
                                    {
                                        currentReservations.length === 0 && (
                                            <>
                                                <p className='text-center mt-3' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                            </>
                                        )
                                    }
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
                                            pageCount={pageReservationCount}
                                            marginPagesDisplayed={2}
                                            pageRangeDisplayed={5}
                                            onPageChange={handleReservationPageClick}
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
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalReservationByRoomType} >Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
            {showModalUserDocument && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Hình Ảnh Giấy Tờ Của Khách Hàng</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalUserDocument}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                <div className="row">
                                    <div className="col-md-12" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {
                                            userDocumentList2.length > 0 ? (
                                                userDocumentList2.map((item, index) => (
                                                    <div key={index} style={{ flex: '1 0 50%', textAlign: 'center', margin: '10px 0', position: 'relative' }}>
                                                        <img src={item.image} alt="Room" style={{ width: "500px", height: "500px" }} />
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
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalUserDocument} >Đóng</button>
                            </div>
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
  width: 70px;
  height: 70px;
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
