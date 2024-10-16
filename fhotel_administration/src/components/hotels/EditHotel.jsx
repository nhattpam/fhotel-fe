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

const EditHotel = () => {

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
                                        <th>Description:</th>
                                        <td>{hotel.description}</td>
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

                                </tbody>
                            </table>
                            <hr />
                            <h2 style={{ fontWeight: 'bold' }}>Room Types of Hotel</h2>
                            <div className="table-responsive">
                                <table id="demo-foo-filtering" className="table table-borderless table-hover table-wrap table-centered mb-0" data-page-size={7}>
                                    <thead className="thead-light">
                                        <tr>
                                            <th>No.</th>
                                            <th data-hide="phone">Name</th>
                                            <th>Room Size</th>
                                            <th data-toggle="true">Max Occupancy</th>
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
                                                    <td><button className="btn btn-default btn-xs m-r-5"
                                                        data-toggle="tooltip" data-original-title="Edit">
                                                        <i className="fa fa-pencil font-14" onClick={() => openRoomTypeModal(item.roomTypeId)} /></button></td>
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
                                                    </div>
                                                ))
                                            }

                                            <div className="form-group mt-3">
                                                <input type="file" onChange={handleFileChange} />
                                                <button type="button" className="btn btn-success mt-2" onClick={handleUploadAndPost}>
                                                    + Upload
                                                </button>
                                            </div>
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
                                                        <td>{roomType.roomSize} m2</td>
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
                                    <Link type="button" className="btn btn-custom" to={`/edit-hotel/${hotel.hotelId}`}>Edit</Link>
                                    <button type="button" className="btn btn-dark" onClick={closeModalRoomType} >Close</button>
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

                .custom-modal-xl {
    max-width: 90%;
    width: 90%;
}
    .btn-custom{
    background-color: #3498db;
    color: white
    }
                                            `}
            </style>

        </>
    )
}

export default EditHotel