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
import reservationService from '../../services/reservation.service';
import billService from '../../services/bill.service';

const EditHotel = () => {
    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING
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
    const [feedbackList, setFeedbackList] = useState([]);

    useEffect(() => {
        hotelService
            .getHotelById(hotelId)
            .then((res) => {
                setHotel(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
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
        hotelService
            .getAllFeedbackByHotelId(hotelId)
            .then((res) => {
                setFeedbackList(res.data);
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
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
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

    const [success, setSuccess] = useState({});
    const [error, setError] = useState({});
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false); // State to track submission status

    const handleChange = (e) => {
        const value = e.target.value;

        setCreateRoomType({ ...createRoomType, [e.target.name]: value });
    };

    const handleCreateRoomTypeDescriptionChange = (value) => {
        setCreateRoomType({ ...createRoomType, description: value });
    };

    // Validation function
    // Validation function
    const validateForm = async () => {
        const errors = {};

        // Type Name validation
        if (!createRoomType.typeId || !createRoomType.typeId.trim()) {
            errors.typeId = "Loại phòng chưa chọn!";
        }

        if (createRoomType.typeId) {
            try {
                const res = await typeService.getTypeById(createRoomType.typeId);
                const type = res.data; // Assuming `typeService.getTypeById` returns an object with `data` that includes `minSize` and `maxSize`
                console.log("DMM: " + res.data.minSize)
                // Check if createRoomType.roomSize is within the range
                if (createRoomType.roomSize < type.minSize || createRoomType.roomSize > type.maxSize) {
                    errors.roomSize = `Diện tích phải từ ${type.minSize}m² tới ${type.maxSize}m²`;
                    // You might want to return an error or handle it based on your needs
                } else {
                    console.log("Room size is within the valid range.");
                    // Proceed with the next steps
                }
            } catch (error) {
                console.log("Error fetching room type:", error);
            }
        }



        // Total Rooms validation
        if (!createRoomType.totalRooms) {
            errors.totalRooms = "Tổng số phòng bắt buộc!";
        }

        // Description validation
        if (!createRoomType.description || !createRoomType.description.trim()) {
            errors.description = "Mô tả là bắt buộc!";
        }

        setError(errors);

        // Return true if no errors, otherwise false
        return Object.keys(errors).length === 0;
    };

    const [filesRoomImage, setFilesRoomImage] = useState([]); // Change to array for multiple images
    const [imagePreviewsRoomImage, setImagePreviewsRoomImage] = useState([]); // Array for previews
    const [selectedImageIndexRoomImage, setSelectedImageIndexRoomImage] = useState(0);

    const handleFileDropRoomImage = (acceptedFiles) => {
        const newImagePreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
        setImagePreviewsRoomImage((prev) => [...prev, ...newImagePreviews]);
        setFilesRoomImage((prev) => [...prev, ...acceptedFiles]); // Add this line
    };

    const submitCreateRoomType = async (e) => {
        e.preventDefault();

        // Validate the form before submitting
        const isValid = await validateForm();
        if (!isValid) {
            setShowError(true);
            return;
        }

        // If validation passes, proceed with the form submission
        console.log(JSON.stringify(createRoomType));

        try {
            // Post the hotel first
            const roomTypeResponse = await roomTypeService.saveRoomType(createRoomType);

            // Handle 201 success
            if (roomTypeResponse.status === 201) {
                const roomTypeId = roomTypeResponse.data.roomTypeId;

                // Upload each hotel image
                for (let file of filesRoomImage) {
                    const imageData = new FormData();
                    imageData.append('file', file);

                    const imageResponse = await hotelImageService.uploadImage(imageData);
                    const imageUrl = imageResponse.data.link; // Assuming this gives you the URL
                    // Create hotel image object
                    const createRoomImageData = { roomTypeId, image: imageUrl };

                    await roomImageService.saveRoomImage(createRoomImageData);
                }

                selectedFacilities.forEach(async (facilityId) => {
                    try {
                        const response = await roomFacilityService.saveRoomFacility({ roomTypeId: roomTypeId, facilityId });
                        console.log("Facility added:", response);
                        // Optionally refresh the facilities list or perform other actions
                        fetchRoomFacilities(selectedRoomTypeId);
                    } catch (error) {
                        console.error("Error adding facility:", error);
                    }
                });

                // Optionally clear selections and close modal
                setSelectedFacilities([]);
                setSuccess({ general: "Tạo Thành Công!" });
                setShowSuccess(true); // Show success
                hotelService
                    .getAllRoomTypeByHotelId(hotelId)
                    .then((res) => {
                        setRoomTypeList(res.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });

            } else {
                handleResponseError(roomTypeResponse);
            }
        } catch (error) {
            handleResponseError(error.response);
        }
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

    // Function to toggle select all amenities
    const handleSelectAllAmenity = () => {
        if (selectedAmenities.length === amenityList.length) {
            // If all are selected, deselect all
            setSelectedAmenities([]);
        } else {
            // If not all are selected, select all
            setSelectedAmenities(amenityList.map(item => item.amenityId));
        }
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

    // Function to toggle select all amenities
    const handleSelectAllFacility = () => {
        if (selectedFacilities.length === facilityList.length) {
            // If all are selected, deselect all
            setSelectedFacilities([]);
        } else {
            // If not all are selected, select all
            setSelectedFacilities(facilityList.map(item => item.facilityId));
        }
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
            console.log(roomFacilityId)
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


    //DETAIL HOTEL OWNER
    //detail user modal 
    const [showModalUser, setShowModalUser] = useState(false);

    const [user, setUser] = useState({

    });

    //list hotels by hotel manager
    const [hotelList, setHotelList] = useState([]);

    const openUserModal = (userId) => {
        setShowModalUser(true);
        if (userId) {
            userService
                .getUserById(userId)
                .then((res) => {
                    setUser(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
            userService
                .getAllHotelByUserId(userId)
                .then((res) => {
                    setHotelList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const closeModalUser = () => {
        setShowModalUser(false);
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

     //detail reservation modal 
     const [showModalReservation, setShowModalReservation] = useState(false);
     const [roomStayHistoryList, setRoomStayHistoryList] = useState([]);
     const [orderDetailList, setOrderDetailList] = useState([]);
     const [billByReservation, setBillByReservation] = useState(null);
 
     const [reservation, setReservation] = useState({
 
     });
 
 
     const openReservationModal = (reservationId) => {
         setShowModalReservation(true);
         if (reservationId) {
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
     };
 
     const closeModalReservation = () => {
         setShowModalReservation(false);
     };
 
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

    const handleResponseError = (response) => {
        if (response && response.status === 400) {
            const validationErrors = response.data.errors || [];
            setError({ validation: validationErrors });
        } else {
            setError({ general: "An unexpected error occurred. Please try again." });
        }
        setShowError(true); // Show error modal or message
    };

    //notification after creating
    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false); // Hide the error after 2 seconds
                // setShowCreateHotelRegistrationModal(false); // Close the modal
                // window.location.reload();
            }, 3000); // Change this value to adjust the duration
            // window.location.reload();
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [showSuccess]); // Only run effect if showError changes


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
                            <div className="ibox-title">Khách Sạn: {hotel.hotelName}</div>

                        </div>
                        <div className="ibox-body">
                            <table className="table table-borderless table-hover table-wrap table-centered m-0">
                                <tbody>
                                    <tr>
                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Hình ảnh:</th>
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
                                                        <>
                                                            <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                        </>
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
                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Mã số:</th>
                                        <td>{hotel.code}</td>
                                    </tr>
                                    <tr>
                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Tên khách sạn:</th>
                                        <td>{hotel.hotelName}</td>
                                    </tr>
                                    <tr>
                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Số điện thoại:</th>
                                        <td>{hotel.phone}</td>
                                    </tr>
                                    <tr>
                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Email:</th>
                                        <td>{hotel.email}</td>
                                    </tr>
                                    <tr>
                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Chủ sở hữu:</th>
                                        <td>
                                            <Link onClick={() => openUserModal(hotel.ownerId)}>{hotel.owner?.name}</Link>
                                        </td>
                                    </tr>
                                    <tr >
                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Giấy tờ khách sạn:</th>
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
                                                        <>
                                                            <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                        </>
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
                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Quận/Huyện:</th>
                                        <td>{hotel && hotel.district?.districtName ? hotel.district?.districtName : 'Unknown District'}</td>
                                    </tr>
                                    <tr>
                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Thành phố:</th>
                                        <td>{hotel && hotel.district?.city?.cityName ? hotel.district?.city?.cityName : 'Unknown City'}</td>
                                    </tr>
                                    <tr>
                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Trạng thái:</th>
                                        <td>
                                            {hotel.isActive ? (
                                                <span className="badge label-table badge-success">Đang hoạt động</span>
                                            ) : (
                                                <span className="badge label-table badge-danger">Chưa kích hoạt</span>
                                            )}</td>
                                    </tr>
                                    <tr>
                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Ngày tạo:</th>
                                        <td>
                                            {new Date(hotel.createdDate).toLocaleString('en-US')}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Ngày cập nhật:</th>
                                        <td>
                                            {new Date(hotel.updatedDate).toLocaleString('en-US')}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Tiện nghi:</th>
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
                                                        <>
                                                            <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                        </>
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
                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Mô tả:</th>
                                        <td
                                            dangerouslySetInnerHTML={{ __html: hotel.description }}
                                            style={{
                                                wordWrap: 'break-word',
                                                whiteSpace: 'pre-wrap',
                                                maxWidth: '300px' // Adjust width as needed
                                            }}
                                            className="wordwrap"
                                        ></td>

                                    </tr>
                                </tbody>
                            </table>
                            <hr />

                            <div className="form-group d-flex align-items-center justify-content-between">
                                <h4 style={{ fontWeight: 'bold' }}>Các loại phòng của khách sạn</h4>
                                {
                                    loginUser.role?.roleName === "Hotel Manager" && (
                                        <>
                                            <button
                                                className="btn btn-primary ml-auto btn-sm"
                                                onClick={openCreateRoomTypeModal}
                                            >
                                                <i class="fa fa-plus-square" aria-hidden="true"></i> Tạo loại phòng
                                            </button>
                                        </>
                                    )
                                }
                            </div>


                            <div className="table-responsive">
                                <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                    <thead className="thead-light">
                                        <tr>
                                            <th><span>STT</span></th>
                                            <th data-hide="phone"><span>Loại phòng</span></th>
                                            <th><span>Diện tích phòng</span></th>
                                            <th><span>Giá hôm nay</span></th> {/* Add a new column for the price */}
                                            <th data-toggle="true"><span>Trạng thái</span></th>
                                            <th><span>Hành động</span></th>
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
                                                                ? `${roomPrices[item.roomTypeId]} (VND)` // Show price if available
                                                                : "Loading..." // Show loading message while fetching price
                                                        }
                                                    </td>
                                                    <td>
                                                        {item.isActive ? (
                                                            <span className="badge label-table badge-success">Đang hoạt động</span>
                                                        ) : (
                                                            <span className="badge label-table badge-danger">Chưa kích hoạt</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-default btn-xs m-r-5"
                                                            data-toggle="tooltip" data-original-title="Edit">
                                                            <i className="fa fa-pencil font-14"
                                                                onClick={() => openRoomTypeModal(item.roomTypeId)} />
                                                        </button>
                                                        <button className="btn btn-default btn-xs m-r-5"
                                                            data-toggle="tooltip" data-original-title="Edit">
                                                            <i className="fa fa-eye font-14"
                                                                onClick={() => openReservationByRoomTypeModal(item.roomTypeId)} />
                                                        </button>
                                                        {

                                                            loginUser.role?.roleName === "Hotel Manager" && (
                                                                <>
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
                                                                </>
                                                            )
                                                        }

                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                {
                                    roomTypeList.length === 0 && (
                                        <>
                                            <p className='text-center mt-3' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                        </>
                                    )
                                }
                            </div> {/* end .table-responsive */}

                            <hr />
                            <div className="form-group d-flex align-items-center justify-content-between">
                                <h4 style={{ fontWeight: 'bold' }}>Nhân viên của khách sạn</h4>
                            </div>


                            <div className="table-responsive">
                                <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                    <thead>
                                        <tr>
                                            <th><span>STT</span></th>
                                            <th><span>Họ và tên</span></th>
                                            <th><span>Email</span></th>
                                            <th><span>Chức vụ</span></th>
                                            <th><span>Trạng thái</span></th>
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
                                                        {
                                                            item.user?.role?.roleName === "Admin" && (
                                                                <>
                                                                    <td>Admin</td>
                                                                </>
                                                            )
                                                        }
                                                        {
                                                            item.user?.role?.roleName === "Hotel Manager" && (
                                                                <>
                                                                    <td>Chủ Khách Sạn</td>
                                                                </>
                                                            )
                                                        }
                                                        {
                                                            item.user?.role?.roleName === "Manager" && (
                                                                <>
                                                                    <td>Quản Lý</td>
                                                                </>
                                                            )
                                                        }
                                                        {
                                                            item.user?.role?.roleName === "Receptionist" && (
                                                                <>
                                                                    <td>Lễ Tân</td>
                                                                </>
                                                            )
                                                        }
                                                        {
                                                            item.user?.role?.roleName === "Room Attendant" && (
                                                                <>
                                                                    <td>Nhân Viên Dọn Phòng</td>
                                                                </>
                                                            )
                                                        }
                                                        <td>
                                                            {item.user?.isActive ? (
                                                                <span className="badge label-table badge-success">Đang hoạt động</span>
                                                            ) : (
                                                                <span className="badge label-table badge-danger">Chưa kích hoạt</span>
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
                                        <>
                                            <p className='text-center mt-3' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                        </>
                                    )
                                }
                            </div> {/* end .table-responsive */}
                            <hr />
                            <div className="form-group d-flex align-items-center justify-content-between">
                                <h4 style={{ fontWeight: 'bold' }}>Đánh giá gần đây</h4>
                            </div>

                            <div className="table-responsive">
                                <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                    <thead className="thead-light">
                                        <tr>
                                            <th><span>STT</span></th>
                                            <th data-hide="phone"><span>Khách hàng</span></th>
                                            <th><span>Đánh giá</span></th>
                                            <th><span>Sao</span></th> {/* Add a new column for the price */}
                                            <th><span>Loại phòng</span></th> {/* Add a new column for the price */}
                                            <th><span>Ngày đánh giá</span></th> {/* Add a new column for the price */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            feedbackList.length > 0 && feedbackList.map((item, index) => (
                                                <tr key={item.roomTypeId}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.reservation?.customer?.name}</td>
                                                    <td>{item.comment}</td>
                                                    <td>{item.hotelRating} <i className="fa fa-star text-warning" aria-hidden="true"></i>
                                                    </td>
                                                    <td>{item.reservation?.roomType?.type?.typeName}</td>
                                                    <td> {new Date(item.createdDate).toLocaleString('en-US')}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                {
                                    feedbackList.length === 0 && (
                                        <>
                                            <p className='text-center mt-3' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                        </>
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
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Thông Tin Loại Phòng</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalRoomType}>
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
                                                <div>
                                                    <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                </div>
                                            )
                                        }


                                        {
                                            loginUser.role?.roleName === "Hotel Manager" && (
                                                <>
                                                    <div className="form-group mt-3">
                                                        <input type="file" onChange={handleFileChange} />
                                                        <button type="button" className="btn btn-success mt-2 btn-sm" onClick={handleUploadAndPost}>
                                                            + Tải lên
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
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Loại phòng:</th>
                                                    <td>{roomType.type?.typeName}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Diện tích:</th>
                                                    <td>{roomType.roomSize} m²</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Số lượng phòng:</th>
                                                    <td>{roomType.totalRooms} phòng</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Số phòng còn trống:</th>
                                                    <td>{roomType.availableRooms} phòng</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Mô tả:</th>
                                                    <td
                                                        dangerouslySetInnerHTML={{ __html: roomType.description }}
                                                        style={{
                                                            wordWrap: 'break-word',
                                                            whiteSpace: 'pre-wrap',
                                                            maxWidth: '300px' // Adjust width as needed
                                                        }}
                                                        className="wordwrap"
                                                    ></td>
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
                                                                    '#E4A11B'
                                                        }}
                                                    >
                                                        <p>{room.roomNumber}</p>
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
                                                        <div key={index} style={{ position: 'relative', textAlign: 'center', flex: '0 1 auto', margin: '5px' }}>
                                                            <span className="badge label-table badge-danger">{item.facility?.facilityName}</span>
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
                                                                            onClick={() => handleDeleteRoomFacility(item.roomFacilityId)}
                                                                        >
                                                                            &times; {/* This represents the delete icon (X symbol) */}
                                                                        </button>
                                                                    </>
                                                                )
                                                            }

                                                        </div>
                                                    ))
                                                        : (
                                                            <>
                                                                <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                            </>
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
                                            <Link type="button" className="btn btn-custom btn-sm" to={`/edit-hotel/${hotel.hotelId}`}>Edit</Link>
                                        </>
                                    )
                                }
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalRoomType} >Đóng</button>
                            </div>

                        </div>
                    </div>
                </div>
            )
            }

            {
                showModalCreateRoomType && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-dialog-scrollable modal-xl" role="document">

                            <div className="modal-content">
                                <form
                                    method="post"
                                    id="myAwesomeDropzone"
                                    data-plugin="dropzone"
                                    data-previews-container="#file-previews"
                                    data-upload-preview-template="#uploadPreviewTemplate"
                                    data-parsley-validate
                                    onSubmit={(e) => submitCreateRoomType(e)}
                                    style={{ textAlign: "left" }}
                                >
                                    <div className="modal-header bg-dark text-light">
                                        <h5 className="modal-title">Tạo Loại Phòng</h5>

                                        <button
                                            type="button"
                                            className="close text-light"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                            onClick={closeModalCreateRoomType}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    {/* Display error message */}
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

                                    {/* Modal Body with scrollable content */}
                                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>

                                        {/* Form Fields */}
                                        <h4 className="header-title ">Thông Tin</h4>
                                        <div className="form-row">
                                            <div className="form-group  col-md-6">
                                                <label htmlFor="hotelName">Loại phòng * :</label>
                                                <select
                                                    name="typeId"
                                                    className="form-control"
                                                    value={createRoomType.typeId}
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                >
                                                    <option value="">Chọn loại</option>
                                                    {typeList.map((type) => (
                                                        <option key={type.typeId} value={type.typeId}>
                                                            {type.typeName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group  col-md-6">
                                                <label htmlFor="size">Diện tích * :</label>
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
                                                <label htmlFor="maxOccupancy">Số lượng phòng * :</label>
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
                                                <label htmlFor="description">Mô tả * :</label>
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
                                            <div className="form-group col-md-12">
                                                <label htmlFor="">Thêm hình ảnh * :</label>

                                                {/* Container for images */}
                                                <Dropzone
                                                    onDrop={(acceptedFiles) => handleFileDropRoomImage(acceptedFiles)}
                                                    accept="image/*"
                                                    multiple={false}
                                                    maxSize={5000000}
                                                >
                                                    {({ getRootProps, getInputProps }) => (
                                                        <div {...getRootProps()} className="fallback">
                                                            <input {...getInputProps()} />
                                                            <div className="dz-message needsclick">
                                                                <i className="h1 text-muted dripicons-cloud-upload" />
                                                                <h5>Chọn file.</h5>
                                                            </div>
                                                            {imagePreviewsRoomImage.length > 0 && (
                                                                <div className="image-previews">
                                                                    {imagePreviewsRoomImage.map((preview, index) => (
                                                                        <img
                                                                            key={index}
                                                                            src={preview}
                                                                            alt={`Preview ${index}`}
                                                                            style={{
                                                                                maxWidth: "70%",
                                                                                maxHeight: "60px",
                                                                                marginTop: "10px",
                                                                                cursor: "pointer",
                                                                                border: selectedImageIndexRoomImage === index ? '2px solid blue' : 'none' // Highlight selected image
                                                                            }}
                                                                            onClick={() => setSelectedImageIndexRoomImage(index)} // Change selected image on click
                                                                        />
                                                                    ))}
                                                                </div>
                                                            )}

                                                        </div>
                                                    )}
                                                </Dropzone>

                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="">Thêm tiện ích * :</label>
                                                <div className='ml-4' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                    <i className="fa fa-check-square" aria-hidden="true"
                                                        onClick={handleSelectAllFacility}>
                                                        {selectedFacilities.length === facilityList.length ? ' Bỏ chọn tất cả' : ' Chọn tất cả'}
                                                    </i>
                                                    {facilityList.length > 0 && facilityList.map((item, index) => (
                                                        <>

                                                            <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedFacilities.includes(item.facilityId)} // Check if this facility is selected
                                                                    onChange={() => handleFacilitySelect(item.facilityId)} // Toggle selection
                                                                    style={{ marginRight: '10px' }} // Add space between checkbox and text
                                                                />
                                                                <span className="badge label-table badge-danger">{item.facilityName}</span>
                                                                {/* <h3 style={{ margin: 0 }}>{item.facilityName}</h3> */}
                                                            </div>
                                                        </>


                                                    ))}
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    {/* Modal Footer */}
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-custom btn-sm" disabled={formSubmitted}><i class="fa fa-floppy-o" aria-hidden="true"></i> Lưu</button>
                                        <button type="button" className="btn btn-dark btn-sm" onClick={closeModalCreateRoomType}>Đóng</button>
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
                                    <div className="modal-header bg-dark text-light">
                                        <h5 className="modal-title">Thêm Tiện Nghi</h5>

                                        <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalCreateHotelAmenity}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                        <div className="row">

                                            <div className="col-md-12" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                <button type="button" className="btn btn-success btn-sm mr-2" >
                                                    <i className="fa fa-check-square" aria-hidden="true"
                                                        onClick={handleSelectAllAmenity}>
                                                        {selectedAmenities.length === amenityList.length ? '' : ''}
                                                    </i>
                                                </button>

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
                                                <button type="submit" className="btn btn-custom btn-sm"><i class="fa fa-floppy-o" aria-hidden="true"></i> Lưu</button>
                                            )
                                        }
                                        <button type="button" className="btn btn-dark btn-sm" onClick={closeModalCreateHotelAmenity}>Đóng</button>
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
                                    <div className="modal-header bg-dark text-light">
                                        <h5 className="modal-title">Thêm Tiện Nghi</h5>
                                        <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalCreateRoomFacility}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                        <div className="row">
                                            <div className='ml-4' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                <i className="fa fa-check-square" aria-hidden="true"
                                                    onClick={handleSelectAllFacility}>
                                                    {selectedFacilities.length === facilityList.length ? ' Bỏ Chọn Tất Cả' : ' Chọn Tất Cả'}
                                                </i>
                                                {facilityList.length > 0 && facilityList.map((item, index) => (
                                                    <>

                                                        <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedFacilities.includes(item.facilityId)} // Check if this facility is selected
                                                                onChange={() => handleFacilitySelect(item.facilityId)} // Toggle selection
                                                                style={{ marginRight: '10px' }} // Add space between checkbox and text
                                                            />
                                                            <span className="badge label-table badge-danger">{item.facilityName}</span>
                                                            {/* <h3 style={{ margin: 0 }}>{item.facilityName}</h3> */}
                                                        </div>
                                                    </>


                                                ))}
                                            </div>


                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        {
                                            loginUser.role?.roleName === "Hotel Manager" && (
                                                <button type="submit" className="btn btn-custom btn-sm">Lưu</button>
                                            )
                                        }
                                        <button type="button" className="btn btn-dark btn-sm" onClick={closeModalCreateRoomFacility}>Đóng</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div >
                )
            }

            {showModalCreateHotelImage && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Thêm Hình Ảnh Khách Sạn</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalCreateHotelImage}>
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
                                                <>
                                                    <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                </>
                                            )
                                        }
                                        {
                                            loginUser.role?.roleName === "Hotel Manager" && (
                                                <>
                                                    <div className="form-group mt-3">
                                                        <input type="file" onChange={handleFileChange3} />
                                                        <button type="button" className="btn btn-success mt-2" onClick={handleUploadAndPost3}>
                                                            + Tải lên
                                                        </button>
                                                    </div>
                                                </>
                                            )
                                        }

                                    </div>

                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalCreateHotelImage} >Đóng</button>
                            </div>

                        </div>
                    </div>
                </div>
            )
            }

            {showModalCreateHotelDocument && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Upload Giấy Tờ Khách Sạn</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalCreateHotelDocument}>
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
                                                <>
                                                    <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                </>
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
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalCreateHotelDocument} >Đóng</button>
                            </div>

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
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Hình Ảnh</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={handleCloseImageLargeModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                <div className="row">
                                    {selectedImageLarger && <img src={selectedImageLarger} alt="Large preview" style={{ width: '100%' }} />}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark btn-sm" onClick={handleCloseImageLargeModal} >Đóng</button>
                            </div>

                        </div>
                    </div>
                </div>
            )
            }
            {showModalUser && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Thông Tin Tài Khoản</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalUser}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', }}>
                                <div className="row">
                                    <div className="col-md-4 d-flex align-items-center flex-column">
                                        <img src={user.image} alt="avatar" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} className="mt-3" />
                                    </div>
                                    <div className="col-md-8">
                                        <table className="table table-borderless table-hover table-centered mt-3" style={{ width: '100%' }}>
                                            <tbody>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Họ và tên:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{user.name}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Email:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{user.email}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Số điện thoại:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{user && user.phoneNumber ? user.phoneNumber : 'Không tìm thấy Số Điện Thoại'}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Địa chỉ:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{user && user.address ? user.address : 'Không tìm thấy Địa Chỉ'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>


                                    <div className="col-md-12" style={{ textAlign: 'left' }}>
                                        <h4 style={{ fontWeight: 'bold' }}>Danh sách khách sạn</h4>
                                        <div className="ibox-body">
                                            <div className="table-responsive">
                                                <table className="table table-borderless table-hover table-wrap table-centered">
                                                    <thead>
                                                        <tr>
                                                            <th><span>STT</span></th>
                                                            <th><span>Mã số</span></th>
                                                            <th><span>Tên khách sạn</span></th>
                                                            <th><span>Chủ sở hữu</span></th>
                                                            <th><span>Quận</span></th>
                                                            <th><span>Thành phố</span></th>
                                                            <th><span>Trạng thái</span></th>
                                                            <th><span>Hành động</span></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            hotelList.length > 0 && hotelList.map((item, index) => (
                                                                <>
                                                                    <tr>
                                                                        <td>{index + 1}</td>

                                                                        <td>{item.code}</td>
                                                                        <td>{item.hotelName}</td>
                                                                        <td>{item.owner?.name}</td>
                                                                        <td>{item.district?.districtName}</td>
                                                                        <td>{item.district?.city?.cityName}</td>
                                                                        <td>
                                                                            {item.isActive ? (
                                                                                <span className="badge label-table badge-success">Đang hoạt động</span>
                                                                            ) : (
                                                                                <span className="badge label-table badge-danger">Chưa kích hoạt</span>
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            <Link className="btn btn-default btn-xs m-r-5" data-toggle="tooltip"
                                                                                to={`/edit-hotel/${item.hotelId}`}><i className="fa fa-pencil font-14" /></Link>
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
                                </div>


                            </div>
                            <div className="modal-footer">
                                {/* <button type="button" className="btn btn-custom">Save</button> */}
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalUser} >Đóng</button>
                            </div>

                        </div>
                    </div >
                </div >
            )}

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
                                                <th><span>Hành động</span></th>
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
                                                            </td>
                                                            <td>
                                                                <button className="btn btn-default btn-xs m-r-5"
                                                                    data-toggle="tooltip" data-original-title="Edit">
                                                                    <i className="fa fa-pencil font-14"
                                                                        onClick={() => openReservationModal(item.reservationId)} /></button>
                                                            </td>
                                                        </tr>
                                                    </>
                                                ))
                                            }


                                        </tbody>
                                    </table>
                                    {
                                        currentReservations.length === 0 && (
                                            <>
                                                <p className='text-center mt-3' style={{color: 'gray', fontStyle: 'italic'}}>Không có</p>
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
            {showModalReservation && (
                <div
                    className="modal fade show"
                    tabIndex="-1"
                    role="dialog"
                    style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}
                >
                    <div className="modal-dialog modal-dialog-centered custom-modal-xl" role="document">
                        <div className="modal-content shadow-lg rounded">
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Chi Tiết Đặt Phòng</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalReservation}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto', textAlign: 'left' }}>
                                {/* Section: Customer Information */}
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
                                                </>
                                            )}
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
                                            </p>
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
                                            <h5><i className="fa fa-clock-o text-primary" aria-hidden="true"></i> Tiền phòng: <span style={{ fontWeight: 'bold' }}>{reservation.totalAmount}</span></h5>
                                        </div>
                                        {/* Divider */}
                                        <div className="col-md-12">
                                            <hr />
                                        </div>
                                        <div className="col-md-12" style={{ textAlign: 'left' }}>
                                            <h5><i className="fa fa-life-ring text-danger" aria-hidden="true"></i> Tiền dịch vụ: <span style={{ fontWeight: 'bold' }}>{orderDetailList.reduce((total, item) => total + (item.order?.totalAmount || 0), 0)
                                            }</span></h5>
                                            <div className="table-responsive">
                                                <table className="table table-borderless table-hover table-wrap table-centered">
                                                    <thead>
                                                        <tr>
                                                            <th><span>STT</span></th>
                                                            <th><span>Hình ảnh</span></th>
                                                            <th><span>Tên dịch vụ</span></th>
                                                            <th><span>Số lượng</span></th>
                                                            <th><span>Loại dịch vụ</span></th>
                                                            <th><span>Giá (VND)</span></th>
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
                                                                                <td>{item.order?.totalAmount}</td>
                                                                            </>
                                                                        )
                                                                    }
                                                                    {
                                                                        item.service?.serviceType?.serviceTypeName !== "Trả phòng muộn" && (
                                                                            <>
                                                                                <td>{item.order?.totalAmount}</td>
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

                                            {/* Calculate and display total amount */}
                                            <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                                <h5>
                                                    <span style={{ fontWeight: 'bold' }}>Tổng cộng: &nbsp;</span>
                                                    {orderDetailList.reduce((total, item) => total + (item.order?.totalAmount || 0), 0)
                                                        + (reservation.paymentStatus === "Not Paid" ? reservation.totalAmount : 0)} VND
                                                </h5>
                                            </div>
                                        </div>
                                        {/* Divider */}
                                        <div className="col-md-12">
                                            <hr />
                                        </div>
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
                                                            <th><span>Tổng số tiền</span></th>
                                                            <th><span>Trạng thái</span></th>
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
                                                                    <td>{billByReservation.totalAmount}</td>
                                                                    {
                                                                        billByReservation.billStatus === "Pending" && (
                                                                            <>
                                                                                <td><span className="badge label-table badge-danger">Đang chờ</span></td>
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
                                                                    {
                                                                        billByReservation.billStatus === "Paid" && (
                                                                            <>
                                                                                <td>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-default btn-xs m-r-5"
                                                                                        data-toggle="tooltip"
                                                                                        data-original-title="Activate"
                                                                                        onClick={() => openCreateBillTransactionImageModal(billByReservation.billId)}                                                                            >
                                                                                        <i class="fa fa-file-image-o text-warning" aria-hidden="true"></i>

                                                                                    </button>
                                                                                </td>

                                                                            </>
                                                                        )
                                                                    }

                                                                </tr>
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                                {
                                                    !billByReservation && (
                                                        <>
                                                            <p className='text-center' style={{color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                {/* <button type="button" className="btn btn-custom">Save</button> */}
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalReservation} >Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
             {showModalCreateBillTransactionImage && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Hình Ảnh Chuyển Tiền</h5>
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
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalCreateBillTransactionImage} >Đóng</button>
                            </div>

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

.wordwrap {
    white-space: pre-wrap; /* Preserves whitespace and wraps text as needed */
    word-break: break-word; /* Ensures long words break within the boundaries */
    overflow-wrap: break-word; /* For additional browser support */
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

export default EditHotel