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

const ListHotel = () => {


    //call list hotel registration
    const [hotelList, setHotelRegistrationList] = useState([]);
    const [hotelSearchTerm, setHotelSearchTerm] = useState('');
    const [currentHotelPage, setCurrentHotelPage] = useState(0);
    const [hotelsPerPage] = useState(5);


    useEffect(() => {
        hotelService
            .getAllHotel()
            .then((res) => {
                const sortedHotelList = [...res.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setHotelRegistrationList(sortedHotelList);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    const handleHotelSearch = (event) => {
        setHotelSearchTerm(event.target.value);
    };

    const filteredHotels = hotelList
        .filter((hotel) => {
            return (
                hotel.hotelName.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase()) ||
                hotel.city?.cityName.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase()) ||
                hotel.city?.country?.countryName.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase()) ||
                hotel.owner?.firstName.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase())
            );
        });

    const pageHotelRegistrationCount = Math.ceil(filteredHotels.length / hotelsPerPage);

    const handleHotelPageClick = (data) => {
        setCurrentHotelPage(data.selected);
    };

    const offsetHotel = currentHotelPage * hotelsPerPage;
    const currentHotels = filteredHotels.slice(offsetHotel, offsetHotel + hotelsPerPage);



    //detail hotel modal 
    const [showModalHotel, setShowModalHotel] = useState(false);

    const [hotel, setHotel] = useState({
        numberOfRooms: "",
        description: ""
    });


    const openHotelModal = (hotelId) => {
        setShowModalHotel(true);
        if (hotelId) {
            hotelService
                .getHotelById(hotelId)
                .then((res) => {
                    setHotel(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const closeModalHotel = () => {
        setShowModalHotel(false);
    };

    //create hotel modal

    //list city & owner
    const [cityList, setCityList] = useState([]);
    const [ownerList, setOwnerList] = useState([]);

    useEffect(() => {
        cityService
            .getAllCity()
            .then((res) => {
                setCityList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
        userService
            .getAllUser()
            .then((res) => {
                const hotelManagers = res.data.filter((owner) => owner.role?.roleName === "Hotel Manager");
                setOwnerList(hotelManagers);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);



    const [createHotel, setCreateHotel] = useState({
        hotelName: "",
        address: "",
        phone: "",
        email: "",
        description: "",
        image: "",
        star: 0,
        cityId: "",
        ownerId: "",
    });
    const [showModalCreateHotel, setShowModalCreateHotel] = useState(false);

    const openCreateHotelModal = () => {
        setShowModalCreateHotel(true);

    };

    const closeModalCreateHotel = () => {
        setShowModalCreateHotel(false);
    };

    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const handleFileDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);

            // Set the image preview URL
            const previewUrl = URL.createObjectURL(acceptedFiles[0]);
            setImagePreview(previewUrl);
        }
    };

    const [error, setError] = useState({}); // State to hold error messages
    const [showError, setShowError] = useState(false); // State to manage error visibility

    const handleChange = (e) => {
        const value = e.target.value;
        setCreateHotel({ ...createHotel, [e.target.name]: value });
    };

    const validateForm = () => {
        let isValid = true;
        const newError = {}; // Create a new error object

        // Validate Hotel Name
        if (createHotel.hotelName.trim() === "") {
            newError.hotelName = "Hotel Name is required";
            isValid = false;
        }

        // Validate Address
        if (createHotel.address.trim() === "") {
            newError.address = "Address is required";
            isValid = false;
        }

        // Validate Image
        if (createHotel.image.trim() === "") {
            newError.image = "Image is required";
            isValid = false;
        }

        // Validate Phone
        if (createHotel.phone.trim() === "") {
            newError.phone = "Phone number is required";
            isValid = false;
        } else if (!/^\d{10}$/.test(createHotel.phone.trim())) {
            newError.phone = "Phone number must be exactly 10 digits";
            isValid = false;
        }

        // Validate Email
        if (createHotel.email.trim() === "") {
            newError.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createHotel.email)) {
            newError.email = "Email is not valid";
            isValid = false;
        }

        // Validate Description
        if (createHotel.description.trim() === "") {
            newError.description = "Description is required";
            isValid = false;
        }

        // Validate Star Rating
        if (createHotel.star === 0) {
            newError.star = "Star rating is required";
            isValid = false;
        } else if (isNaN(createHotel.star) || createHotel.star < 1 || createHotel.star > 5) {
            newError.star = "Star rating must be between 1 and 5";
            isValid = false;
        }

        // Validate City ID
        if (createHotel.cityId.trim() === "") {
            newError.cityId = "City ID is required";
            isValid = false;
        }

        // Validate Owner ID
        if (createHotel.ownerId.trim() === "") {
            newError.ownerId = "Owner ID is required";
            isValid = false;
        }

        setError(newError); // Set the new error object
        setShowError(Object.keys(newError).length > 0); // Show error if there are any
        return isValid;
    };

    const submitHotel = async (e) => {
        e.preventDefault();
        setError({}); // Reset any previous errors
        setShowError(false); // Hide error before validation

        if (validateForm()) {
            try {
                let image = createHotel.image;
                console.log(JSON.stringify(createHotel));

                if (file) {
                    const imageData = new FormData();
                    imageData.append("file", file);
                    const imageResponse = await hotelService.uploadImage(imageData);
                    if (imageResponse.status === 200) {
                        image = imageResponse.data.link;
                    } else {
                        window.alert("Failed to create image."); // Set error message
                        return; // Stop further execution if image upload fails
                    }
                }

                const hotelData = { ...createHotel, image };

                const hotelResponse = await hotelService.saveHotel(hotelData);

                if (hotelResponse.status === 201) {
                    window.alert("Hotel created successfully!");
                    window.location.reload();
                } else {
                    setError({ general: "Failed to create hotel." }); // Set error message
                    setShowError(true); // Show error
                    return;
                }

            } catch (error) {
                console.log(error);
                setError({ general: "An unexpected error occurred. Please try again." }); // Set generic error message
                setShowError(true); // Show error
            }
        }


    };
    // Effect to handle error message visibility
    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => {
                setShowError(false); // Hide the error after 2 seconds
            }, 2000); // Change this value to adjust the duration
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [showError]); // Only run effect if showError changes


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
                            <div className="ibox-title">List of Hotels</div>
                            <div className="form-group d-flex align-items-center">
                                <input
                                    id="demo-foo-search"
                                    type="text"
                                    placeholder="Search"
                                    className="form-control form-control-sm"
                                    autoComplete="on"
                                    value={hotelSearchTerm}
                                    onChange={handleHotelSearch}
                                />
                                <button
                                    className="btn btn-primary ml-3"
                                    onClick={openCreateHotelModal} // This will trigger the modal for creating a new hotel
                                >
                                    Create New Hotel
                                </button>
                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Owner</th>
                                            <th>City</th>
                                            <th>Country</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentHotels.length > 0 && currentHotels.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <img src={item.image} alt="avatar" style={{ width: "100px" }} />

                                                        </td>
                                                        <td>{item.hotelName}</td>
                                                        <td>{item.owner?.firstName}</td>
                                                        <td>{item.city?.cityName}</td>
                                                        <td>{item.city?.country?.countryName}</td>
                                                        <td>
                                                            {item.isActive ? (
                                                                <span className="badge label-table badge-success">Active</span>
                                                            ) : (
                                                                <span className="badge label-table badge-danger">Inactive</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit"><i className="fa fa-pencil font-14" onClick={() => openHotelModal(item.hotelId)} /></button>
                                                            <button className="btn btn-default btn-xs" data-toggle="tooltip" data-original-title="Delete"><i className="fa fa-trash font-14" /></button>
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
                                pageCount={pageHotelRegistrationCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handleHotelPageClick}
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
            {showModalHotel && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <form>

                                <div className="modal-header">
                                    <h5 className="modal-title">Hotel Information</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalHotel}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-5">
                                            <img src={hotel.image} alt="avatar" style={{ width: '100%' }} />

                                        </div>
                                        <div className="col-md-7">
                                            <table className="table table-responsive table-hover mt-3">
                                                <tbody>
                                                    <tr>
                                                        <th style={{ width: '30%' }}>Name:</th>
                                                        <td>{hotel.hotelName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Email:</th>
                                                        <td>{hotel.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Phone Number:</th>
                                                        <td>{hotel && hotel.phone ? hotel.phone : 'Unknown Phone Number'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Address:</th>
                                                        <td>{hotel && hotel.address ? hotel.address : 'Unknown Address'}</td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>


                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-custom"  >Save</button>
                                    <button type="button" className="btn btn-dark" onClick={closeModalHotel} >Close</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )}

            {showModalCreateHotel && (
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
                                onSubmit={(e) => submitHotel(e)}
                                style={{ textAlign: "left" }}
                            >
                                <div className="modal-header">
                                    <h5 className="modal-title">Create a Hotel</h5>

                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                        onClick={closeModalCreateHotel}
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
                                <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>



                                    <label htmlFor="image">Image * :</label>
                                    <Dropzone
                                        onDrop={handleFileDrop}
                                        accept="image/*"
                                        multiple={false}
                                        maxSize={5000000} // Maximum file size (5MB)
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps()} className="fallback">
                                                <input {...getInputProps()} />
                                                <div className="dz-message needsclick">
                                                    <i className="h1 text-muted dripicons-cloud-upload" />
                                                    <h3>Drop files here or click to upload.</h3>
                                                </div>
                                                {imagePreview && (
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        style={{
                                                            maxWidth: "100%",
                                                            maxHeight: "200px",
                                                            marginTop: "10px",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </Dropzone>

                                    {/* Preview */}
                                    <div className="dropzone-previews mt-3" id="file-previews" />

                                    {/* Form Fields */}
                                    <h4 className="header-title mt-4">Information</h4>
                                    <div className="form-group">
                                        <label htmlFor="hotelName">Hotel Name * :</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="hotelName"
                                            id="hotelName"
                                            value={createHotel.hotelName}
                                            onChange={(e) => handleChange(e)}
                                            required
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="email">Email * :</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                id="email"
                                                value={createHotel.email}
                                                onChange={(e) => handleChange(e)}
                                                required
                                            />
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="cityId">City * :</label>
                                            <select
                                                className="form-control"
                                                id="cityId"
                                                name="cityId"
                                                value={createHotel.cityId}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select City</option>
                                                {cityList.map((item) => (
                                                    <option key={item.cityId} value={item.cityId}>
                                                        {item ? item.cityName : "Unknown City"}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="star">Star * :</label>
                                            <div className="input-group">
                                                <input
                                                    type="number"
                                                    id="star"
                                                    className="form-control"
                                                    name="star"
                                                    value={createHotel.star}
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                    min="1"
                                                    max="5"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="ownerId">Owner * :</label>
                                            <select
                                                className="form-control"
                                                id="ownerId"
                                                name="ownerId"
                                                value={createHotel.ownerId}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Owner</option>
                                                {ownerList.map((item) => (
                                                    <option key={item.userId} value={item.userId}>
                                                        {item ? item.firstName : "Unknown Name"}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="address">Address * :</label>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    id="address"
                                                    className="form-control"
                                                    name="address"
                                                    value={createHotel.address}
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group col-md-6">
                                            <label htmlFor="address">Phone * :</label>
                                            <div className="input-group">
                                                <input
                                                    type="number"
                                                    id="phone"
                                                    className="form-control"
                                                    name="phone"
                                                    value={createHotel.phone}
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                    </div>


                                    <div className="form-group">
                                        <label htmlFor="description">Description * :</label>
                                        <textarea
                                            id="description"
                                            className="form-control"
                                            name="description"
                                            value={createHotel.description}
                                            onChange={(e) => handleChange(e)}
                                            required
                                            minLength="20"
                                            maxLength="100"
                                        />
                                    </div>

                                </div>

                                {/* Modal Footer */}
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-custom">Save</button>
                                    <button type="button" className="btn btn-dark" onClick={closeModalCreateHotel}>Close</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div >

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

export default ListHotel