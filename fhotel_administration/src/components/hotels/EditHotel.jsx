import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import hotelService from '../../services/hotel.service';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import Dropzone from "react-dropzone";
import cityService from '../../services/city.service';
import userService from '../../services/user.service';
import hotelAmenityService from '../../services/hotel-amenity.service';
import { Link, useParams } from 'react-router-dom';
import roomTypeService from '../../services/room-type.service';
import roomImageService from '../../services/room-image.service';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import amenityService from '../../services/amenity.service';
import typeService from '../../services/type.service';
import facilityService from '../../services/facility.service';
import roomFacilityService from '../../services/room-facility.service';
import hotelImageService from '../../services/hotel-image.service';
import hotelDocumentService from '../../services/hotel-document.service';
import documentService from '../../services/document.service';

const EditHotel = () => {

    //login user
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

    const { hotelId } = useParams();

    const [hotel, setHotel] = useState({

    });
    //list hotel amenities
    const [hotelAmenityList, setHotelAmenityList] = useState([]);
    const [roomTypeList, setRoomTypeList] = useState([]);
    const [typeList, setTypeList] = useState([]);
    const [hotelStaffList, setHotelStaffList] = useState([]);
    const [hotelDocumentList, setHotelDocumentList] = useState([]);
    const [hotelImageList, setHotelImageList] = useState([]);
    const [roomPrices, setRoomPrices] = useState({}); // New state to store room prices
    const [documentList, setDocumentList] = useState([]);

    useEffect(() => {
        hotelService
            .getHotelById(hotelId)
            .then((res) => {
                setHotel(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
        hotelService
            .getAllAmenityHotelById(hotelId)
            .then((res) => {
                setHotelAmenityList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
        hotelService
            .getAllRoomTypeByHotelId(hotelId)
            .then((res) => {
                const roomTypes = res.data;
                setRoomTypeList(roomTypes);
                // Fetch price for each room type
                roomTypes.forEach((roomType) => {
                    roomTypeService.getTodayPricebyRoomTypeId(roomType.roomTypeId)
                        .then((priceRes) => {
                            setRoomPrices(prevPrices => ({
                                ...prevPrices,
                                [roomType.roomTypeId]: priceRes.data // Save the price by room type ID
                            }));
                        })
                        .catch((error) => {
                            console.log("Error fetching price for roomTypeId:", roomType.roomTypeId, error);
                        });
                });
            })
            .catch((error) => {
                console.log(error);
            });
        hotelService
            .getAllHotelStaffByHotelId(hotelId)
            .then((res) => {
                setHotelStaffList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
        typeService
            .getAllType()
            .then((res) => {
                setTypeList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
        hotelService
            .getAllHotelDocumentByHotelId(hotelId)
            .then((res) => {
                setHotelDocumentList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
        hotelService
            .getAllHotelImageByHotelId(hotelId)
            .then((res) => {
                setHotelImageList(res.data);
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
    }, [hotelId]);

    //detail room type modal 
    const [roomImageList, setRoomImageList] = useState([]);
    const [roomFacilities, setRoomFacilities] = useState([]);
    const [roomList, setRoomList] = useState([]);

    const [roomType, setRoomType] = useState({

    });
    const [showModalRoomType, setShowModalRoomType] = useState(false);
    const closeModalRoomType = () => {
        setShowModalRoomType(false);
    };


    const openRoomTypeModal = (roomTypeId) => {
        setShowModalRoomType(true);
        // Clear the image list first to avoid showing images from the previous room type
        setRoomImageList([]); // Reset roomImageList to an empty array
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

    const [selectedFile, setSelectedFile] = useState(null);
    const [imageList, setImageList] = useState(roomImageList);
    const [roomImage, setRoomImage] = useState({
        roomTypeId: roomType.roomTypeId,
        image: "",
    });

    // Handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Upload image and refresh the room image list without closing the modal
    const handleUploadAndPost = async () => {
        if (!selectedFile) {
            alert("Please select an image");
            return;
        }

        try {
            // Prepare the FormData with the correct key expected by the API
            const formData = new FormData();
            formData.append("file", selectedFile); // Adjust key if needed
            console.log([...formData.entries()]); // Logs the form data before submission

            // Upload the image to the API
            const uploadResponse = await roomImageService.uploadImage(formData);

            if (uploadResponse && uploadResponse.data) {
                const imageUrl = uploadResponse.data.link; // Extract the returned image URL from the response

                // Update roomImage object
                const updatedRoomImage = {
                    roomTypeId: roomType.roomTypeId,
                    image: imageUrl,
                };
                setRoomImage(updatedRoomImage);

                // Save the room image to your database
                await roomImageService.saveRoomImage(updatedRoomImage);

                // Refresh the room image list by calling the fetchRoomImages function
                fetchRoomImages(roomType.roomTypeId);

                // Optionally, update the local image list without refetching (in case you want instant visual feedback)
                setImageList((prevList) => [...prevList, { image: imageUrl }]);
            }
        } catch (error) {
            console.error("Error uploading and posting image:", error);
        }
    };

    const handleDeleteImage = async (roomImageId) => {
        try {
            // Call the API to delete the image by roomImageId
            await roomImageService.deleteRoomImageById(roomImageId);

            // After successful deletion, remove the image from the imageList
            setRoomImageList(prevList => prevList.filter(item => item.roomImageId !== roomImageId));
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };


    //create room type & then create room image for room type id
    const [showModalCreateRoomType, setShowModalCreateRoomType] = useState(false);

    const openCreateRoomTypeModal = () => {
        setShowModalCreateRoomType(true);

    };

    const closeModalCreateRoomType = () => {
        setShowModalCreateRoomType(false);
    };

    const [createRoomType, setCreateRoomType] = useState({
        hotelId: hotelId,
        typeId: "",
        description: "",
        roomSize: 0,
        totalRooms: 0,

    });
    const [roomImageList2, setRoomImageList2] = useState([]);
    const [createRoomImage, setCreateRoomImage] = useState({
        roomTypeId: "",
        image: ""
    });

    const [error, setError] = useState({}); // State to hold error messages
    const [showError, setShowError] = useState(false); // State to manage error visibility
    const [formSubmitted, setFormSubmitted] = useState(false); // State to track submission status

    const handleChange = (e) => {
        const value = e.target.value;

        setCreateRoomType({ ...createRoomType, [e.target.name]: value });
    };

    const handleCreateRoomTypeDescriptionChange = (value) => {
        setCreateRoomType({ ...createRoomType, description: value });
    };

    // Validation function
    const validateForm = () => {
        const errors = {};

        // Type Name validation
        if (!createRoomType.typeId.trim()) {
            errors.typeId = "Type Name is required";
        }

        // Room Size validation
        if (createRoomType.roomSize <= 0) {
            errors.roomSize = "Room Size must be greater than 0";
        }


        // Total Rooms validation
        if (!createRoomType.totalRooms) {
            errors.totalRooms = "Total Rooms is required";
        }
        // Description validation
        if (!createRoomType.description.trim()) {
            errors.description = "Description is required";
        }

        setError(errors);

        // Return true if no errors, otherwise false
        return Object.keys(errors).length === 0;
    };

    const submitCreateRoomType = async (e) => {
        e.preventDefault();

        // Validate the form before submitting
        if (!validateForm()) {
            setShowError(true);
            return;
        }

        // If validation passes, proceed with the form submission
        console.log(JSON.stringify(createRoomType));

        roomTypeService
            .saveRoomType(createRoomType)
            .then((res) => {
                console.log(JSON.stringify(createRoomType));
                //o day la dong thong bao tao thanh cong mau success
                setRoomType(res.data);
                setFormSubmitted(true); // Mark form as submitted
                hotelService
                    .getAllRoomTypeByHotelId(hotelId)
                    .then((res) => {
                        setRoomTypeList(res.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // Function to fetch room images based on roomTypeId
    const fetchRoomImages2 = (roomTypeId) => {
        roomTypeService
            .getAllRoomImagebyRoomTypeId(roomTypeId)
            .then((res) => {
                setRoomImageList2(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const [selectedFile2, setSelectedFile2] = useState(null);
    const [imageList2, setImageList2] = useState(roomImageList);
    const [roomImage2, setRoomImage2] = useState({
        roomTypeId: roomType.roomTypeId,
        image: "",
    });

    // Handle file selection
    const handleFileChange2 = (event) => {
        setSelectedFile2(event.target.files[0]);
    };

    // Upload image and refresh the room image list without closing the modal
    const handleUploadAndPost2 = async () => {
        if (!selectedFile2) {
            alert("Please select an image");
            return;
        }

        try {
            // Prepare the FormData with the correct key expected by the API
            const formData = new FormData();
            formData.append("file", selectedFile2); // Adjust key if needed
            console.log([...formData.entries()]); // Logs the form data before submission

            // Upload the image to the API
            const uploadResponse = await roomImageService.uploadImage(formData);

            if (uploadResponse && uploadResponse.data) {
                const imageUrl = uploadResponse.data.link; // Extract the returned image URL from the response

                // Update roomImage object
                const updatedRoomImage = {
                    roomTypeId: roomType.roomTypeId,
                    image: imageUrl,
                };
                setCreateRoomImage(updatedRoomImage);

                // Save the room image to your database
                await roomImageService.saveRoomImage(updatedRoomImage);

                // Refresh the room image list by calling the fetchRoomImages function
                fetchRoomImages2(roomType.roomTypeId);

                // Optionally, update the local image list without refetching (in case you want instant visual feedback)
                setImageList((prevList) => [...prevList, { image: imageUrl }]);
            }
        } catch (error) {
            console.error("Error uploading and posting image:", error);
        }
    };

    const handleDeleteImage2 = async (roomImageId) => {
        try {
            // Call the API to delete the image by roomImageId
            await roomImageService.deleteRoomImageById(roomImageId);

            // After successful deletion, remove the image from the imageList
            setRoomImageList2(prevList => prevList.filter(item => item.roomImageId !== roomImageId));
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };


    //Admin: Update room type status
    const [updateRoomTypeStatus, setUpdateRoomTypeStatus] = useState({

    });
    const submitUpdateRoomTypeStatus = async (e, roomTypeId, isActive) => {
        e.preventDefault();

        try {
            // Fetch the user data
            const res = await roomTypeService.getRoomTypeById(roomTypeId);
            const roomTypeData = res.data;

            // Update the local state with the fetched data and new isActive flag
            setUpdateRoomTypeStatus({ ...roomTypeData, isActive });

            // Make the update request
            const updateRes = await roomTypeService.updateRoomType(roomTypeId, { ...roomTypeData, isActive });

            if (updateRes.status === 200) {
                // window.alert("Update successful!");
                // Refresh the roomTypeList after update
                const updatedRoomTypes = await hotelService.getAllRoomTypeByHotelId(hotelId);
                setRoomTypeList(updatedRoomTypes.data);  // Update the roomTypeList state with fresh data
            } else {
                window.alert("Update FAILED!");
            }
        } catch (error) {
            console.log(error);
            window.alert("An error occurred during the update.");
        }
    };


    //create hotel amenity
    const [showModalCreateHotelAmenity, setShowModalCreateHotelAmenity] = useState(false);

    const openCreateHotelAmenityModal = () => {
        setShowModalCreateHotelAmenity(true);

    };

    const closeModalCreateHotelAmenity = () => {
        setShowModalCreateHotelAmenity(false);
    };

    const [amenityList, setAmenityList] = useState([]);
    const [facilityList, setFacilityList] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [selectedFacilities, setSelectedFacilities] = useState([]);

    useEffect(() => {
        amenityService
            .getAllAmenity()
            .then((res) => {
                setAmenityList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
        facilityService
            .getAllFacility()
            .then((res) => {
                setFacilityList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // Function to handle amenity selection
    const handleAmenitySelect = (amenityId) => {
        setSelectedAmenities((prevSelected) => {
            if (prevSelected.includes(amenityId)) {
                // If the amenity is already selected, remove it
                return prevSelected.filter(id => id !== amenityId);
            } else {
                // If the amenity is not selected, add it
                return [...prevSelected, amenityId];
            }
        });
    };

    // Function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission

        selectedAmenities.forEach(amenityId => {
            hotelAmenityService.saveHotelAmenity({ hotelId, amenityId })
                .then(response => {
                    console.log("Amenity added:", response);
                    // After successful creation, refresh the hotel amenity list
                    hotelService.getAllAmenityHotelById(hotelId)
                        .then((res) => {
                            setHotelAmenityList(res.data); // Update the state with new amenities
                        })
                        .catch((error) => {
                            console.log("Error fetching amenities after creation:", error);
                        });
                })
                .catch(error => {
                    console.error("Error adding amenity:", error);
                    // Optionally, you can show an error message for each failure
                });
        });

        // After submitting, you may want to clear the selected amenities or close the modal
        setSelectedAmenities([]); // Clear selected amenities after submission
        closeModalCreateHotelAmenity(); // Close the modal if needed
    };


    const handleDeleteHotelAmenity = async (hotelAmenityId) => {
        try {
            // Call the API to delete the image by roomImageId
            await hotelAmenityService.deleteHotelAmenityById(hotelAmenityId);

            // After successful deletion, remove the image from the imageList
            setHotelAmenityList(prevList => prevList.filter(item => item.hotelAmenityId !== hotelAmenityId));
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };


    //submit room facility
    // Add a state to store the roomTypeId
    const [selectedRoomTypeId, setSelectedRoomTypeId] = useState(null);

    const [showModalCreateRoomFacility, setShowModalCreateRoomFacility] = useState(false);

    const openCreateRoomFacilityModal = (roomTypeId) => {
        setSelectedRoomTypeId(roomTypeId); // Set the roomTypeId in the state
        setShowModalCreateRoomFacility(true);

    };

    const closeModalCreateRoomFacility = () => {
        setShowModalCreateRoomFacility(false);
    };
    // Function to handle amenity selection
    const handleFacilitySelect = (facilityId) => {
        setSelectedFacilities((prevSelected) => {
            if (prevSelected.includes(facilityId)) {
                // If the amenity is already selected, remove it
                return prevSelected.filter(id => id !== facilityId);
            } else {
                // If the amenity is not selected, add it
                return [...prevSelected, facilityId];
            }
        });
    };

    // Use the roomTypeId when submitting the form
    const handleSubmitRoomFacility = (event) => {
        event.preventDefault();

        if (!selectedRoomTypeId) {
            console.error("Room type ID is missing");
            return;
        }

        selectedFacilities.forEach(facilityId => {
            roomFacilityService.saveRoomFacility({ roomTypeId: selectedRoomTypeId, facilityId })
                .then(response => {
                    console.log("Facility added:", response);
                    // Optionally refresh the facilities list or perform other actions
                    fetchRoomFacilities(selectedRoomTypeId)
                })
                .catch(error => {
                    console.error("Error adding facility:", error);
                });
        });

        // Optionally clear selections and close modal
        setSelectedFacilities([]);
        closeModalCreateRoomFacility();
    };


    const handleDeleteRoomFacility = async (roomFacilityId) => {
        try {
            // Call the API to delete the image by roomImageId
            await roomFacilityService.deleteRoomFacilityById(roomFacilityId);
            fetchRoomFacilities(selectedRoomTypeId);
            // After successful deletion, remove the image from the imageList
            // setHotelAmenityList(prevList => prevList.filter(item => item.hotelAmenityId !== hotelAmenityId));
        } catch (error) {
            console.error('Error deleting room facility:', error);
        }
    };


    ///upload and delete hotel image
    const [showModalCreateHotelImage, setShowModalCreateHotelImage] = useState(false);
    const closeModalCreateHotelImage = () => {
        setShowModalCreateHotelImage(false);
    };


    const openCreateHotelImageModal = (hotelId) => {
        setShowModalCreateHotelImage(true);
        // Clear the image list first to avoid showing images from the previous room type
        setRoomImageList([]); // Reset roomImageList to an empty array
        if (hotelId) {

        }
    };
    const [hotelImage, setHotelImage] = useState({
        hotelId: hotelId,
        image: "",
    });



    const [selectedFile3, setSelectedFile3] = useState(null);

    // Handle file selection
    const handleFileChange3 = (event) => {
        setSelectedFile3(event.target.files[0]);
    };

    const [imageList3, setImageList3] = useState(hotelImageList);


    // Upload image and refresh the room image list without closing the modal
    const handleUploadAndPost3 = async () => {
        if (!selectedFile3) {
            alert("Please select an image");
            return;
        }

        try {
            // Prepare the FormData with the correct key expected by the API
            const formData = new FormData();
            formData.append("file", selectedFile3); // Adjust key if needed
            console.log([...formData.entries()]); // Logs the form data before submission

            // Upload the image to the API
            const uploadResponse = await roomImageService.uploadImage(formData);

            if (uploadResponse && uploadResponse.data) {
                const imageUrl = uploadResponse.data.link; // Extract the returned image URL from the response

                // Update roomImage object
                const updatedHotelImage = {
                    hotelId: hotelId,
                    image: imageUrl,
                };
                setHotelImage(updatedHotelImage);

                // Save the room image to your database
                await hotelImageService.saveHotelImage(updatedHotelImage);

                // Refresh the room image list by calling the fetchRoomImages function
                fetchHotelImages(hotelId);

                // Optionally, update the local image list without refetching (in case you want instant visual feedback)
                setImageList3((prevList) => [...prevList, { image: imageUrl }]);
            }
        } catch (error) {
            console.error("Error uploading and posting image:", error);
        }
    };

    const fetchHotelImages = (hotelId) => {
        hotelService
            .getAllHotelImageByHotelId(hotelId)
            .then((res) => {
                setHotelImageList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDeleteImage3 = async (hotelImageId) => {
        try {
            // Call the API to delete the image by roomImageId
            await hotelImageService.deleteRHotelImageById(hotelImageId);

            // After successful deletion, remove the image from the imageList
            setHotelImageList(prevList => prevList.filter(item => item.hotelImageId !== hotelImageId));
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };


    ///upload and delete hotel document
    const [showModalCreateHotelDocument, setShowModalCreateHotelDocument] = useState(false);
    const closeModalCreateHotelDocument = () => {
        setShowModalCreateHotelDocument(false);
    };


    const openCreateHotelDocumentModal = (hotelId) => {
        setShowModalCreateHotelDocument(true);
        // Clear the image list first to avoid showing images from the previous room type
        setRoomImageList([]); // Reset roomImageList to an empty array
        if (hotelId) {

        }
    };
    const [hotelDocument, setHotelDocument] = useState({
        hotelId: hotelId,
        image: "",
    });



    const [selectedFile4, setSelectedFile4] = useState(null);

    // Handle file selection
    const handleFileChange4 = (event) => {
        setSelectedFile4(event.target.files[0]);
    };

    const [imageList4, setImageList4] = useState(hotelDocumentList);


    // Upload image and refresh the room image list without closing the modal
    const handleUploadAndPost4 = async () => {
        if (!selectedFile4) {
            alert("Please select an image");
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
                const document = documentList.find(doc => doc.documentName === "Hotel Registration");
                if (document) {
                    const documentId = document.documentId;
                    // Update roomImage object
                    const updatedHotelDocument = {
                        hotelId: hotelId,
                        image: imageUrl,
                        documentId: documentId
                    };
                    setHotelDocument(updatedHotelDocument);

                    // Save the room image to your database
                    await hotelDocumentService.saveHotelDocument(updatedHotelDocument);

                    // Refresh the room image list by calling the fetchRoomImages function
                    fetchHotelDocuments(hotelId);

                    // Optionally, update the local image list without refetching (in case you want instant visual feedback)
                    setImageList4((prevList) => [...prevList, { image: imageUrl }]);
                }

            }
        } catch (error) {
            console.error("Error uploading and posting image:", error);
        }
    };

    const fetchHotelDocuments = (hotelId) => {
        hotelService
            .getAllHotelDocumentByHotelId(hotelId)
            .then((res) => {
                setHotelDocumentList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDeleteImage4 = async (hotelDocumentId) => {
        try {
            // Call the API to delete the image by roomImageId
            await hotelDocumentService.deleteHotelDocumentById(hotelDocumentId);

            // After successful deletion, remove the image from the imageList
            setHotelDocumentList(prevList => prevList.filter(item => item.hotelDocumentId !== hotelDocumentId));
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };


    //click display larger image: 
    const [showImageLargerModal, setShowLargerImageModal] = useState(false);
    const [selectedImageLarger, setSelectedImageLarger] = useState(null);

    // Function to handle opening the modal with the clicked image
    const handleImageLargerClick = (image) => {
        setSelectedImageLarger(image); // Set the clicked image
        setShowLargerImageModal(true);      // Show the modal
    };

    // Function to handle closing the modal
    const handleCloseImageLargeModal = () => {
        setShowLargerImageModal(false);
        setSelectedImageLarger(null); // Reset the selected image
    };
    return (
        <>
            <Header />
            <SideBar />
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
                        <div className="ibox-head">
                            <div className="ibox-title">Khách Sạn: {hotel.hotelName}</div>

                        </div>
                        <div className="ibox-body">
                            <table className="table table-borderless table-hover table-wrap table-centered m-0">
                                <tbody>
                                    <tr>
                                        <th>Hình Ảnh:</th>
                                        <td style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', margin: 0 }}>
                                            {
                                                hotelImageList.length > 0 ? hotelImageList.map((item, index) => (
                                                    <div key={index} style={{ position: 'relative', textAlign: 'center', flex: '0 1 auto', margin: '5px' }}>
                                                        <img src={item.image} alt="hotel image" style={{ width: "100px", margin: '0 5px' }}
                                                            onClick={() => handleImageLargerClick(item.image)}
                                                        />

                                                        {/* Delete Button */}
                                                        {
                                                            loginUser.role?.roleName === "Hotel Manager" && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger"
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: '0', // Adjust to position the button as needed
                                                                            right: '0', // Adjust to position the button as needed
                                                                            background: 'transparent',
                                                                            border: 'none',
                                                                            color: 'red',
                                                                            fontSize: '20px',
                                                                            cursor: 'pointer',
                                                                        }}
                                                                        onClick={() => handleDeleteImage3(item.hotelImageId)}
                                                                    >
                                                                        &times; {/* This represents the delete icon (X symbol) */}
                                                                    </button>
                                                                </>
                                                            )
                                                        }

                                                    </div>
                                                ))
                                                    : (
                                                        <div style={{ textAlign: 'center', fontSize: '16px', color: 'gray' }}>
                                                            Không tìm thấy.
                                                        </div>
                                                    )
                                            }

                                            {/* Square Add Button */}
                                            {
                                                loginUser.role?.roleName === "Hotel Manager" && (
                                                    <>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: '40px', // Adjust the size as needed
                                                                height: '40px', // Same as width for a square
                                                                backgroundColor: '#258cd1', // Button color
                                                                color: '#fff', // Text color
                                                                borderRadius: '4px', // Optional rounded corners
                                                                margin: '5px', // Space around the button
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() => openCreateHotelImageModal(hotelId)}
                                                        >
                                                            +
                                                        </div>
                                                    </>
                                                )
                                            }

                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Tên Khách Sạn:</th>
                                        <td>{hotel.hotelName}</td>
                                    </tr>
                                    <tr>
                                        <th>Số Điện Thoại:</th>
                                        <td>{hotel.phone}</td>
                                    </tr>
                                    <tr>
                                        <th>Email:</th>
                                        <td>{hotel.email}</td>
                                    </tr>

                                    <tr>
                                        <th>Sao:</th>
                                        <td>{hotel.star === null ? 0 : hotel.star} <i className="fa fa-star text-warning" aria-hidden="true"></i></td>
                                    </tr>

                                    <tr>
                                        <th>Giấy Tờ:</th>
                                        <td style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', margin: 0 }}>
                                            {
                                                hotelDocumentList.length > 0 ? hotelDocumentList.map((item, index) => (
                                                    <div key={index} style={{ position: 'relative', textAlign: 'center', flex: '0 1 auto', margin: '5px' }}>
                                                        <img src={item.image} alt="amenity" style={{ width: "100px", margin: '0 5px' }}
                                                            onClick={() => handleImageLargerClick(item.image)} />

                                                        {/* Delete Button */}
                                                        {
                                                            loginUser.role?.roleName === "Hotel Manager" && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger"
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: '0', // Adjust to position the button as needed
                                                                            right: '0', // Adjust to position the button as needed
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
                                                    : (
                                                        <div style={{ textAlign: 'center', fontSize: '16px', color: 'gray' }}>
                                                            No hotel documents available.
                                                        </div>
                                                    )
                                            }

                                            {/* Square Add Button */}
                                            {
                                                loginUser.role?.roleName === "Hotel Manager" && (
                                                    <>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: '40px', // Adjust the size as needed
                                                                height: '40px', // Same as width for a square
                                                                backgroundColor: '#258cd1', // Button color
                                                                color: '#fff', // Text color
                                                                borderRadius: '4px', // Optional rounded corners
                                                                margin: '5px', // Space around the button
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() => openCreateHotelDocumentModal(hotel.hotelId)}
                                                        >
                                                            +
                                                        </div>
                                                    </>
                                                )
                                            }

                                        </td>
                                    </tr>

                                    <tr>
                                        <th>Quận/Huyện:</th>
                                        <td>{hotel && hotel.district?.districtName ? hotel.district?.districtName : 'Unknown District'}</td>
                                    </tr>
                                    <tr>
                                        <th>Thành Phố:</th>
                                        <td>{hotel && hotel.district?.city?.cityName ? hotel.district?.city?.cityName : 'Unknown City'}</td>
                                    </tr>
                                    <tr>
                                        <th>Trạng Thái:</th>
                                        <td>
                                            {hotel.isActive ? (
                                                <span className="badge label-table badge-success">Đang Hoạt Động</span>
                                            ) : (
                                                <span className="badge label-table badge-danger">Chưa Kích Hoạt</span>
                                            )}</td>
                                    </tr>
                                    <tr>
                                        <th>Ngày Tạo:</th>
                                        <td>
                                            {new Date(hotel.createdDate).toLocaleString('en-US')}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Ngày Cập Nhật:</th>
                                        <td>
                                            {new Date(hotel.updatedDate).toLocaleString('en-US')}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Tiện Nghi:</th>
                                        <td style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', margin: 0 }}>
                                            {
                                                hotelAmenityList.length > 0 ? hotelAmenityList.map((item, index) => (
                                                    <div key={index} style={{ position: 'relative', textAlign: 'center', flex: '0 1 auto', margin: '5px' }}>
                                                        <img src={item.amenity?.image} alt="amenity" style={{ width: "40px", margin: '0 5px' }} />

                                                        {/* Delete Button */}
                                                        {
                                                            loginUser.role?.roleName === "Hotel Manager" && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger"
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: '0', // Adjust to position the button as needed
                                                                            right: '0', // Adjust to position the button as needed
                                                                            background: 'transparent',
                                                                            border: 'none',
                                                                            color: 'red',
                                                                            fontSize: '20px',
                                                                            cursor: 'pointer',
                                                                        }}
                                                                        onClick={() => handleDeleteHotelAmenity(item.hotelAmenityId)}
                                                                    >
                                                                        &times; {/* This represents the delete icon (X symbol) */}
                                                                    </button>
                                                                </>
                                                            )
                                                        }

                                                    </div>
                                                ))
                                                    : (
                                                        <div style={{ textAlign: 'center', fontSize: '16px', color: 'gray' }}>
                                                            Không tìm thấy.
                                                        </div>
                                                    )
                                            }

                                            {/* Square Add Button */}
                                            {
                                                loginUser.role?.roleName === "Hotel Manager" && (
                                                    <>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: '40px', // Adjust the size as needed
                                                                height: '40px', // Same as width for a square
                                                                backgroundColor: '#258cd1', // Button color
                                                                color: '#fff', // Text color
                                                                borderRadius: '4px', // Optional rounded corners
                                                                margin: '5px', // Space around the button
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() => openCreateHotelAmenityModal(hotel.hotelId)}
                                                        >
                                                            +
                                                        </div>
                                                    </>
                                                )
                                            }

                                        </td>



                                    </tr>
                                    <tr>
                                        <th>Mô Tả:</th>
                                        <td dangerouslySetInnerHTML={{ __html: hotel.description }}>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <hr />

                            <div className="form-group d-flex align-items-center justify-content-between">
                                <h2 style={{ fontWeight: 'bold' }}>Các Loại Phòng Của Khách Sạn</h2>
                                {
                                    loginUser.role?.roleName === "Hotel Manager" && (
                                        <>
                                            <button
                                                className="btn btn-primary ml-auto"
                                                onClick={openCreateRoomTypeModal}
                                            >
                                                Tạo Loại Phòng
                                            </button>
                                        </>
                                    )
                                }
                            </div>


                            <div className="table-responsive">
                                <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                    <thead className="thead-light">
                                        <tr>
                                            <th>STT.</th>
                                            <th data-hide="phone">Tên Loại</th>
                                            <th>Kích Thước Phòng</th>
                                            <th>Giá</th> {/* Add a new column for the price */}
                                            <th data-toggle="true">Trạng Thái</th>
                                            <th>Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            roomTypeList.length > 0 && roomTypeList.map((item, index) => (
                                                <tr key={item.roomTypeId}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.type?.typeName}</td>
                                                    <td>{item.roomSize} m²</td>
                                                    <td>
                                                        {
                                                            roomPrices[item.roomTypeId] !== undefined
                                                                ? `${roomPrices[item.roomTypeId]} VND` // Show price if available
                                                                : "Loading..." // Show loading message while fetching price
                                                        }
                                                    </td>
                                                    <td>
                                                        {item.isActive ? (
                                                            <span className="badge label-table badge-success">Đang Hoạt Động</span>
                                                        ) : (
                                                            <span className="badge label-table badge-danger">Chưa Kích Hoạt</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-default btn-xs m-r-5"
                                                            data-toggle="tooltip" data-original-title="Edit">
                                                            <i className="fa fa-pencil font-14"
                                                                onClick={() => openRoomTypeModal(item.roomTypeId)} />
                                                        </button>
                                                        <form
                                                            id="demo-form"
                                                            onSubmit={(e) => submitUpdateRoomTypeStatus(e, item.roomTypeId, updateRoomTypeStatus.isActive)}
                                                            className="d-inline"
                                                        >
                                                            <button
                                                                type="submit"
                                                                className="btn btn-default btn-xs m-r-5"
                                                                data-toggle="tooltip"
                                                                data-original-title="Activate"
                                                                onClick={() => setUpdateRoomTypeStatus({ ...updateRoomTypeStatus, isActive: true })}
                                                            >
                                                                <i className="fa fa-check font-14 text-success" />
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                className="btn btn-default btn-xs"
                                                                data-toggle="tooltip"
                                                                data-original-title="Deactivate"
                                                                onClick={() => setUpdateRoomTypeStatus({ ...updateRoomTypeStatus, isActive: false })}
                                                            >
                                                                <i className="fa fa-times font-14 text-danger" />
                                                            </button>
                                                        </form>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                {
                                    roomTypeList.length === 0 && (
                                        <div className='text-center mt-3' style={{ fontSize: '16px', color: 'gray' }}>
                                            Không tìm thấy.
                                        </div>
                                    )
                                }
                            </div> {/* end .table-responsive */}

                            <hr />
                            <div className="form-group d-flex align-items-center justify-content-between">
                                <h2 style={{ fontWeight: 'bold' }}>Nhân Viên Của Khách Sạn</h2>
                            </div>


                            <div className="table-responsive">
                                <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                    <thead>
                                        <tr>
                                            <th>STT.</th>
                                            <th>Họ Và Tên</th>
                                            <th>Email</th>
                                            <th>Chức Vụ</th>
                                            <th>Trạng Thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            hotelStaffList.length > 0 && hotelStaffList.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.user?.name}</td>
                                                        <td>{item.user?.email}</td>
                                                        <td>{item.user?.role?.roleName}</td>
                                                        <td>
                                                            {item.user?.isActive ? (
                                                                <span className="badge label-table badge-success">Đang Hoạt Động</span>
                                                            ) : (
                                                                <span className="badge label-table badge-danger">Chưa Kích Hoạt</span>
                                                            )}
                                                        </td>

                                                    </tr>
                                                </>
                                            ))
                                        }


                                    </tbody>
                                </table>
                                {
                                    hotelStaffList.length === 0 && (
                                        <div className='text-center mt-3' style={{ fontSize: '16px', color: 'gray' }}>
                                            Không tìm thấy.
                                        </div>
                                    )
                                }
                            </div> {/* end .table-responsive */}

                        </div>

                    </div>
                    {/* end ibox */}

                </div>

            </div >

            {showModalRoomType && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <form>

                                <div className="modal-header">
                                    <h5 className="modal-title">Thông Tin Loại Phòng</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalRoomType}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-5" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {
                                                roomImageList.length > 0 ? (
                                                    roomImageList.map((item, index) => (
                                                        <div key={index} style={{ flex: '1 0 50%', textAlign: 'center', margin: '10px 0', position: 'relative' }}>
                                                            <img src={item.image} alt="Room" style={{ width: "250px", height: "200px" }} />
                                                            {
                                                                loginUser.role?.roleName === "Hotel Manager" && (
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
                                                                            onClick={() => handleDeleteImage(item.roomImageId)}
                                                                        >
                                                                            &times; {/* This represents the delete icon (X symbol) */}
                                                                        </button>
                                                                    </>
                                                                )
                                                            }
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div style={{ textAlign: 'center', margin: '10px 0', fontSize: '16px', color: 'gray' }}>
                                                        Không tìm thấy.
                                                    </div>
                                                )
                                            }


                                            {
                                                loginUser.role?.roleName === "Hotel Manager" && (
                                                    <>
                                                        <div className="form-group mt-3">
                                                            <input type="file" onChange={handleFileChange} />
                                                            <button type="button" className="btn btn-success mt-2" onClick={handleUploadAndPost}>
                                                                + Upload
                                                            </button>
                                                        </div>
                                                    </>
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
                                                        <th>Số Lượng Phòng:</th>
                                                        <td>{roomType.totalRooms}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Số Phòng Còn Trống:</th>
                                                        <td>{roomType.availableRooms}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Mô Tả:</th>
                                                        <td dangerouslySetInnerHTML={{ __html: roomType.description }}></td>
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
                                                            style={{ backgroundColor: room.status === 'Available' ? 'green' : 'red' }}
                                                        >
                                                            <p>{room.roomNumber}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                {roomList.length === 0 && (
                                                    <>
                                                        <p>Không tìm thấy.</p>
                                                    </>
                                                )}
                                            </div>
                                            <hr />
                                            <div>
                                                <h3 className="text-primary" style={{ textAlign: 'left', fontWeight: 'bold' }}>Cơ Sở Vật Chất</h3>
                                                <td style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', margin: 0 }}>
                                                    {
                                                        roomFacilities.length > 0 ? roomFacilities.map((item, index) => (
                                                            <div key={index} style={{ position: 'relative', textAlign: 'center', flex: '0 1 auto', margin: '5px' }}>
                                                                <h4>{item.facility?.facilityName}</h4>

                                                                {/* Delete Button */}
                                                                {
                                                                    loginUser.role?.roleName === "Hotel Manager" && (
                                                                        <>
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-danger"
                                                                                style={{
                                                                                    position: 'absolute',
                                                                                    top: '0', // Adjust to position the button as needed
                                                                                    right: '0', // Adjust to position the button as needed
                                                                                    background: 'transparent',
                                                                                    border: 'none',
                                                                                    color: 'red',
                                                                                    fontSize: '20px',
                                                                                    cursor: 'pointer',
                                                                                }}
                                                                                onClick={() => handleDeleteRoomFacility(item.hotelAmenityId)}
                                                                            >
                                                                                &times; {/* This represents the delete icon (X symbol) */}
                                                                            </button>
                                                                        </>
                                                                    )
                                                                }

                                                            </div>
                                                        ))
                                                            : (
                                                                <div style={{ textAlign: 'center', fontSize: '16px', color: 'gray' }}>
                                                                    Không tìm thấy.
                                                                </div>
                                                            )
                                                    }

                                                    {/* Square Add Button */}
                                                    {
                                                        loginUser.role?.roleName === "Hotel Manager" && (
                                                            <>
                                                                <div
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        width: '40px', // Adjust the size as needed
                                                                        height: '40px', // Same as width for a square
                                                                        backgroundColor: '#258cd1', // Button color
                                                                        color: '#fff', // Text color
                                                                        borderRadius: '4px', // Optional rounded corners
                                                                        margin: '5px', // Space around the button
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    onClick={() => openCreateRoomFacilityModal(roomType.roomTypeId)}
                                                                >
                                                                    +
                                                                </div>
                                                            </>
                                                        )
                                                    }

                                                </td>

                                            </div>
                                        </div>

                                    </div>


                                </div>
                                <div className="modal-footer">
                                    {
                                        loginUser.role?.roleName === "Hotel Manager" && (
                                            <>
                                                <Link type="button" className="btn btn-custom" to={`/edit-hotel/${hotel.hotelId}`}>Edit</Link>
                                            </>
                                        )
                                    }
                                    <button type="button" className="btn btn-dark" onClick={closeModalRoomType} >Đóng</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )
            }

            {
                showModalCreateRoomType && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">

                            <div className="modal-content">
                                <form
                                    method="post"
                                    className="mt-3"
                                    id="myAwesomeDropzone"
                                    data-plugin="dropzone"
                                    data-previews-container="#file-previews"
                                    data-upload-preview-template="#uploadPreviewTemplate"
                                    data-parsley-validate
                                    onSubmit={(e) => submitCreateRoomType(e)}
                                    style={{ textAlign: "left" }}
                                >
                                    <div className="modal-header">
                                        <h5 className="modal-title">Tạo Loại Phòng</h5>

                                        <button
                                            type="button"
                                            className="close"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                            onClick={closeModalCreateRoomType}
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

                                    {/* Modal Body with scrollable content */}
                                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>

                                        {/* Form Fields */}
                                        <h4 className="header-title ">Thông Tin</h4>
                                        <div className="form-row">
                                            <div className="form-group  col-md-6">
                                                <label htmlFor="hotelName">Loại Phòng * :</label>
                                                <select
                                                    name="typeId"
                                                    className="form-control"
                                                    value={createRoomType.typeId}
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                >
                                                    <option value="">Chọn Loại</option>
                                                    {typeList.map((type) => (
                                                        <option key={type.typeId} value={type.typeId}>
                                                            {type.typeName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group  col-md-6">
                                                <label htmlFor="size">Diện Tích * :</label>
                                                <div className="input-group">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="roomSize"
                                                        id="roomSize"
                                                        value={createRoomType.roomSize}
                                                        onChange={(e) => handleChange(e)}
                                                        placeholder="Enter the size"
                                                        min="0"
                                                        required
                                                        disabled={formSubmitted} // Disable if form submitted

                                                        aria-describedby="sizeHelp"
                                                    />
                                                    <div className="input-group-append">
                                                        <span className="input-group-text custom-append">m²</span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>


                                        <div className="form-row">


                                            <div className="form-group col-md-6">
                                                <label htmlFor="maxOccupancy">Số Lượng Phòng * :</label>
                                                <select
                                                    className="form-control"
                                                    id="totalRooms"
                                                    name="totalRooms"
                                                    value={createRoomType.totalRooms}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={formSubmitted} // Disable if form submitted

                                                >
                                                    <option value="">Chọn</option>
                                                    {[...Array(10).keys()].map((_, index) => (
                                                        <option key={index + 1} value={index + 1}>
                                                            {index + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group col-md-12">
                                                <label htmlFor="description">Mô Tả * :</label>
                                                <ReactQuill
                                                    value={createRoomType.description}
                                                    onChange={handleCreateRoomTypeDescriptionChange}
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
                                                    readOnly={formSubmitted} // Disable editor if form submitted
                                                />
                                            </div>
                                            {formSubmitted && ( // Conditional rendering for "Add Room images" heading
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="">Thêm Hình Ảnh * :</label>

                                                    {/* Container for images */}
                                                    <div className="row mt-3">
                                                        {roomImageList2.length > 0 && roomImageList2.map((item, index) => (
                                                            <div key={index} className="col-md-3" style={{ textAlign: 'center', margin: '10px 0', position: 'relative' }}>
                                                                <img src={item.image} alt="Room" style={{ width: "100%", height: "auto", maxHeight: "200px" }} />

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
                                                                    onClick={() => handleDeleteImage2(item.roomImageId)}
                                                                >
                                                                    &times; {/* This represents the delete icon (X symbol) */}
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="form-group mt-3">
                                                        <input type="file" onChange={handleFileChange2} />
                                                        <button type="button" className="btn btn-success mt-2" onClick={handleUploadAndPost2}>
                                                            + Upload
                                                        </button>
                                                    </div>
                                                </div>
                                            )}



                                        </div>

                                    </div>

                                    {/* Modal Footer */}
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-custom" disabled={formSubmitted}>Lưu</button>
                                        <button type="button" className="btn btn-dark" onClick={closeModalCreateRoomType}>Đóng</button>
                                    </div>

                                </form>


                            </div>
                        </div>
                    </div >

                )
            }

            {
                showModalCreateHotelAmenity && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-dialog-scrollable custom-modal-small" role="document">
                            <div className="modal-content">
                                <form onSubmit={handleSubmit}> {/* Attach handleSubmit here */}
                                    <div className="modal-header">
                                        <h5 className="modal-title">Thêm Tiện Nghi</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalCreateHotelAmenity}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                        <div className="row">
                                            <div className="col-md-12" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                {
                                                    amenityList.length > 0 && amenityList.map((item, index) => (
                                                        <div key={index} style={{ position: 'relative', textAlign: 'center', flex: '0 1 auto', margin: '5px' }}>
                                                            <img src={item.image} alt="amenity" style={{ width: "40px", margin: '0 5px' }} />
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedAmenities.includes(item.amenityId)} // Check if this amenity is selected
                                                                onChange={() => handleAmenitySelect(item.amenityId)} // Toggle selection
                                                                style={{ position: 'absolute', top: '10px', left: '10px' }} // Positioning the checkbox
                                                            />
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        {
                                            loginUser.role?.roleName === "Hotel Manager" && (
                                                <button type="submit" className="btn btn-custom">Lưu</button>
                                            )
                                        }
                                        <button type="button" className="btn btn-dark" onClick={closeModalCreateHotelAmenity}>Đóng</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                showModalCreateRoomFacility && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-dialog-scrollable custom-modal-small" role="document">
                            <div className="modal-content">
                                <form onSubmit={handleSubmitRoomFacility}> {/* Attach handleSubmit here */}
                                    <div className="modal-header">
                                        <h5 className="modal-title">Thêm Cơ Sở Vật Chất</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalCreateRoomFacility}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                        <div className="row">
                                            <div className='ml-4' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                {facilityList.length > 0 && facilityList.map((item, index) => (
                                                    <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedFacilities.includes(item.facilityId)} // Check if this facility is selected
                                                            onChange={() => handleFacilitySelect(item.facilityId)} // Toggle selection
                                                            style={{ marginRight: '10px' }} // Add space between checkbox and text
                                                        />
                                                        <h3 style={{ margin: 0 }}>{item.facilityName}</h3>
                                                    </div>
                                                ))}
                                            </div>


                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        {
                                            loginUser.role?.roleName === "Hotel Manager" && (
                                                <button type="submit" className="btn btn-custom">Lưu</button>
                                            )
                                        }
                                        <button type="button" className="btn btn-dark" onClick={closeModalCreateRoomFacility}>Đóng</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div >
                )
            }

            {showModalCreateHotelImage && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <form>

                                <div className="modal-header">
                                    <h5 className="modal-title">Upload Hình Ảnh Khách Sạn</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalCreateHotelImage}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-12" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {
                                                hotelImageList.length > 0 ? (
                                                    hotelImageList.map((item, index) => (
                                                        <div key={index} style={{ flex: '1 0 50%', textAlign: 'center', margin: '10px 0', position: 'relative' }}>
                                                            <img src={item.image} alt="Room" style={{ width: "250px", height: "200px" }} />
                                                            {
                                                                loginUser.role?.roleName === "Hotel Manager" && (
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
                                                                            onClick={() => handleDeleteImage3(item.hotelImageId)}
                                                                        >
                                                                            &times; {/* This represents the delete icon (X symbol) */}
                                                                        </button>
                                                                    </>
                                                                )
                                                            }
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div style={{ textAlign: 'center', margin: '10px 0', fontSize: '16px', color: 'gray' }}>
                                                        Không tìm thấy.
                                                    </div>
                                                )
                                            }
                                            {
                                                loginUser.role?.roleName === "Hotel Manager" && (
                                                    <>
                                                        <div className="form-group mt-3">
                                                            <input type="file" onChange={handleFileChange3} />
                                                            <button type="button" className="btn btn-success mt-2" onClick={handleUploadAndPost3}>
                                                                + Upload
                                                            </button>
                                                        </div>
                                                    </>
                                                )
                                            }

                                        </div>

                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-dark" onClick={closeModalCreateHotelImage} >Đóng</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )
            }

            {showModalCreateHotelDocument && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <form>

                                <div className="modal-header">
                                    <h5 className="modal-title">Upload Giấy Tờ Khách Sạn</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalCreateHotelDocument}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-12" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {
                                                hotelDocumentList.length > 0 ? (
                                                    hotelDocumentList.map((item, index) => (
                                                        <div key={index} style={{ flex: '1 0 50%', textAlign: 'center', margin: '10px 0', position: 'relative' }}>
                                                            <img src={item.image} alt="Room" style={{ width: "250px", height: "200px" }} />
                                                            {
                                                                loginUser.role?.roleName === "Hotel Manager" && (
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
                                                    <div style={{ textAlign: 'center', margin: '10px 0', fontSize: '16px', color: 'gray' }}>
                                                        Không tìm thấy.
                                                    </div>
                                                )
                                            }


                                            {
                                                loginUser.role?.roleName === "Hotel Manager" && (
                                                    <>
                                                        <div className="form-group mt-3">
                                                            <input type="file" onChange={handleFileChange4} />
                                                            <button type="button" className="btn btn-success mt-2" onClick={handleUploadAndPost4}>
                                                                + Upload
                                                            </button>
                                                        </div>
                                                    </>
                                                )
                                            }

                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-dark" onClick={closeModalCreateHotelDocument} >Đóng</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )
            }
            {/* Modal for displaying the large image */}
            {showImageLargerModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <form>

                                <div className="modal-header">
                                    <h5 className="modal-title">Hình Ảnh</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCloseImageLargeModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        {selectedImageLarger && <img src={selectedImageLarger} alt="Large preview" style={{ width: '100%' }} />}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-dark" onClick={handleCloseImageLargeModal} >Đóng</button>
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

                .custom-modal-xl {
    max-width: 90%;
    width: 90%;
}

   .custom-modal-small {
    max-width: 50%;
    width: 50%;
}
    .btn-custom{
    background-color: #3498db;
    color: white
    }

    .custom-append {
    display: inline-block;
    width: 100px; /* Adjust this value based on your design needs */
    height: 100%; /* Makes it match the height of the input field */
    text-align: center;
    vertical-align: middle;
    background-color: #e9ecef; /* Optional: Matches input's background */
    border: 1px solid #ced4da; /* Matches the input's border style */
    border-left: 0; /* Removes the border between the input and append */
    line-height: calc(2.25rem); /* Matches the default height of Bootstrap input */
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


                                            `}
            </style>

        </>
    )
}

export default EditHotel