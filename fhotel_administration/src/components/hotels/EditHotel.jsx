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
                setRoomTypeList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, hotelId);

    //detail room type modal 
    const [roomImageList, setRoomImageList] = useState([]);

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
        typeName: "",
        description: "",
        roomSize: 0,
        basePrice: 0,
        maxOccupancy: 0,
        totalRooms: 0,
        availableRooms: 0

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
        if (!createRoomType.typeName.trim()) {
            errors.typeName = "Type Name is required";
        }

        // Room Size validation
        if (createRoomType.roomSize <= 0) {
            errors.roomSize = "Room Size must be greater than 0";
        }

        // Base Price validation
        if (createRoomType.basePrice <= 0) {
            errors.basePrice = "Base Price must be greater than 0";
        }

        // Max Occupancy validation
        if (!createRoomType.maxOccupancy) {
            errors.maxOccupancy = "Max Occupancy is required";
        }

        // Total Rooms validation
        if (!createRoomType.totalRooms) {
            errors.totalRooms = "Total Rooms is required";
        }

        // Available Rooms validation
        if (!createRoomType.availableRooms) {
            errors.availableRooms = "Available Rooms is required";
        }

        // Check if availableRooms is greater than totalRooms
        if (createRoomType.availableRooms > createRoomType.totalRooms) {
            errors.availableRooms = "Available Rooms cannot exceed Total Rooms";
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
                window.alert("Update successful!");
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
                            <div className="ibox-title">Hotel: {hotel.hotelName}</div>

                        </div>
                        <div className="ibox-body">
                            <table className="table table-borderless table-hover table-wrap table-centered m-0">
                                <tbody>
                                    <tr>
                                        <th>Image:</th>
                                        <td>
                                            <img src={hotel.image} alt="avatar" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Hotel Name:</th>
                                        <td>{hotel.hotelName}</td>
                                    </tr>
                                    <tr>
                                        <th>Phone number:</th>
                                        <td>{hotel.phone}</td>
                                    </tr>
                                    <tr>
                                        <th>Email:</th>
                                        <td>{hotel.email}</td>
                                    </tr>

                                    <tr>
                                        <th>Star:</th>
                                        <td>{hotel.star}</td>
                                    </tr>
                                    <tr>
                                        <th>Business License Number:</th>
                                        <td>{hotel.businessLicenseNumber}</td>
                                    </tr>
                                    <tr>
                                        <th>Tax Identification Number:</th>
                                        <td>{hotel.taxIdentificationNumber}</td>
                                    </tr>
                                    <tr>
                                        <th>City:</th>
                                        <td>{hotel.city?.cityName}</td>
                                    </tr>
                                    <tr>
                                        <th>Status:</th>
                                        <td>
                                            {hotel.isActive ? (
                                                <span className="badge label-table badge-success">Active</span>
                                            ) : (
                                                <span className="badge label-table badge-danger">Inactive</span>
                                            )}</td>
                                    </tr>
                                    <tr>
                                        <th>Created Date:</th>
                                        <td>
                                            {new Date(hotel.createdDate).toLocaleString('en-US')}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Updated Date:</th>
                                        <td>
                                            {new Date(hotel.updatedDate).toLocaleString('en-US')}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Amenities:</th>
                                        <td style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                            {
                                                hotelAmenityList.length > 0 && hotelAmenityList.map((item, index) => (
                                                    <div key={index} style={{ textAlign: 'center', flex: '1 1 20%' }}>
                                                        <img src={item.image} alt="avatar" style={{ width: "40px" }} />
                                                    </div>
                                                ))
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Description:</th>
                                        <td dangerouslySetInnerHTML={{ __html: hotel.description }}>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <hr />

                            <div className="form-group d-flex align-items-center justify-content-between">
                                <h2 style={{ fontWeight: 'bold' }}>Room Types of Hotel</h2>
                                {
                                    loginUser.role?.roleName === "Hotel Manager" && (
                                        <>
                                            <button
                                                className="btn btn-primary ml-auto"
                                                onClick={openCreateRoomTypeModal}
                                            >
                                                Create New Room Type
                                            </button>
                                        </>
                                    )
                                }
                            </div>




                            <div className="table-responsive">
                                <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                    <thead className="thead-light">
                                        <tr>
                                            <th>No.</th>
                                            <th data-hide="phone">Name</th>
                                            <th>Room Size</th>
                                            <th data-toggle="true">Max Occupancy</th>
                                            <th data-toggle="true">Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            roomTypeList.length > 0 && roomTypeList.map((item, index) => (
                                                <tr key={item.roomTypeId}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.typeName}</td>
                                                    <td>{item.roomSize}</td>
                                                    <td>{item.maxOccupancy}</td>
                                                    <td>
                                                        {item.isActive ? (
                                                            <span className="badge label-table badge-success">Active</span>
                                                        ) : (
                                                            <span className="badge label-table badge-danger">Inactive</span>
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
                                                            onSubmit={(e) => submitUpdateRoomTypeStatus(e, item.roomTypeId, updateRoomTypeStatus.isActive)} // Use isActive from the local state
                                                            className="d-inline"
                                                        >
                                                            <button
                                                                type="submit"
                                                                className="btn btn-default btn-xs m-r-5"
                                                                data-toggle="tooltip"
                                                                data-original-title="Activate"
                                                                onClick={() => setUpdateRoomTypeStatus({ ...updateRoomTypeStatus, isActive: true })} // Activate
                                                            >
                                                                <i className="fa fa-check font-14 text-success" />
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                className="btn btn-default btn-xs"
                                                                data-toggle="tooltip"
                                                                data-original-title="Deactivate"
                                                                onClick={() => setUpdateRoomTypeStatus({ ...updateRoomTypeStatus, isActive: false })} // Deactivate
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
                            </div> {/* end .table-responsive*/}
                        </div>

                    </div>
                    {/* end ibox */}

                </div>

            </div>

            {showModalRoomType && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <form>

                                <div className="modal-header">
                                    <h5 className="modal-title">Room Type Information</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalRoomType}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-5" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {
                                                roomImageList.length > 0 && roomImageList.map((item, index) => (
                                                    <div key={index} style={{ flex: '1 0 50%', textAlign: 'center', margin: '10px 0', position: 'relative' }}>
                                                        <img src={item.image} alt="avatar" style={{ width: "250px", height: "200px" }} />
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
                                                        <th style={{ width: '30%' }}>Name:</th>
                                                        <td>{roomType.typeName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Room Size:</th>
                                                        <td>{roomType.roomSize} m²</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Base Price:</th>
                                                        <td>{roomType.basePrice} VND</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Max Occupancy:</th>
                                                        <td>{roomType.maxOccupancy}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Total Rooms:</th>
                                                        <td>{roomType.totalRooms}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Available Rooms:</th>
                                                        <td>{roomType.availableRooms}</td>
                                                    </tr>


                                                </tbody>
                                            </table>

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
                                    <button type="button" className="btn btn-dark" onClick={closeModalRoomType} >Close</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )}

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
                                        <h5 className="modal-title">Create a Room Type</h5>

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
                                        <h4 className="header-title ">Information</h4>
                                        <div className="form-row">
                                            <div className="form-group  col-md-6">
                                                <label htmlFor="hotelName">Type Name * :</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="typeName"
                                                    id="typeName"
                                                    value={createRoomType.typeName}
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                    disabled={formSubmitted} // Disable if form submitted

                                                />
                                            </div>

                                            <div className="form-group  col-md-6">
                                                <label htmlFor="size">Size * :</label>
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
                                                <label htmlFor="email">Base Price * :</label>
                                                <div className="input-group">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="basePrice"
                                                        id="basePrice"
                                                        value={createRoomType.basePrice}
                                                        onChange={(e) => handleChange(e)}
                                                        placeholder="Enter the base price"
                                                        min="0"
                                                        required
                                                        disabled={formSubmitted} // Disable if form submitted

                                                        aria-describedby="basePriceHelp"
                                                    />
                                                    <div className="input-group-append">
                                                        <span className="input-group-text custom-append">VND</span>
                                                    </div>
                                                </div>
                                                <small id="basePriceHelp" className="form-text text-muted">
                                                    Enter the price in Viet Nam Dong.
                                                </small>
                                            </div>


                                            <div className="form-group col-md-6">
                                                <label htmlFor="maxOccupancy">Max Occupancy * :</label>
                                                <select
                                                    className="form-control"
                                                    id="maxOccupancy"
                                                    name="maxOccupancy"
                                                    value={createRoomType.maxOccupancy}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={formSubmitted} // Disable if form submitted

                                                >
                                                    <option value="">Select</option>
                                                    {[...Array(3).keys()].map((_, index) => (
                                                        <option key={index + 1} value={index + 1}>
                                                            {index + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>


                                            <div className="form-group col-md-6">
                                                <label htmlFor="maxOccupancy">Total Rooms * :</label>
                                                <select
                                                    className="form-control"
                                                    id="totalRooms"
                                                    name="totalRooms"
                                                    value={createRoomType.totalRooms}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={formSubmitted} // Disable if form submitted

                                                >
                                                    <option value="">Select</option>
                                                    {[...Array(10).keys()].map((_, index) => (
                                                        <option key={index + 1} value={index + 1}>
                                                            {index + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group col-md-6">
                                                <label htmlFor="maxOccupancy">Available Rooms * :</label>
                                                <select
                                                    className="form-control"
                                                    id="availableRooms"
                                                    name="availableRooms"
                                                    value={createRoomType.availableRooms}
                                                    onChange={handleChange}
                                                    required
                                                    disabled={formSubmitted} // Disable if form submitted

                                                >
                                                    <option value="">Select</option>
                                                    {[...Array(10).keys()].map((_, index) => (
                                                        <option key={index + 1} value={index + 1}>
                                                            {index + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="description">Description * :</label>
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
                                                    <label htmlFor="">Add Room Images * :</label>

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
                                        <button type="submit" className="btn btn-custom" disabled={formSubmitted}>Save</button>
                                        <button type="button" className="btn btn-dark" onClick={closeModalCreateRoomType}>Close</button>
                                    </div>

                                </form>


                            </div>
                        </div>
                    </div >

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

                                            `}
            </style>

        </>
    )
}

export default EditHotel