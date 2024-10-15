import React, { useEffect } from 'react'
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import hotelService from '../services/hotel.service';
import Dropzone from 'react-dropzone';
import cityService from '../services/city.service';


const Header = () => {

    const [showCreateHotelRegistrationModal, setShowCreateHotelRegistrationModal] = useState(false);
    const [ownerName, setOwnerName] = useState(''); // Owner Name - single input
    const [ownerEmail, setOwnerEmail] = useState(''); // Owner Email - single input
    const [hotels, setHotels] = useState([{
        hotelName: '',
        address: '',
        phone: '',
        email: '',
        description: '',
        businessLicenseNumber: '',
        taxIdentificationNumber: '',
        image: '', // This will hold the uploaded image URL
        cityId: ''
    }]);
    const [expandedHotels, setExpandedHotels] = useState([true]);
    const [imagePreviews, setImagePreviews] = useState(['']); // Separate state for image previews

    const handleOpenHotelRegistrationModal = () => {
        setShowCreateHotelRegistrationModal(true);
    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const newHotels = [...hotels];
        newHotels[index][name] = value;
        setHotels(newHotels);
    };

    // Handle file uploads
    const handleFileDrop = (acceptedFiles, index) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const newHotels = [...hotels];
            newHotels[index].image = acceptedFiles[0]; // Store the file object
            setHotels(newHotels);

            // Preview URL for the dropped file
            const previewUrl = URL.createObjectURL(acceptedFiles[0]);
            const newImagePreviews = [...imagePreviews];
            newImagePreviews[index] = previewUrl; // Store the preview URL separately
            setImagePreviews(newImagePreviews);
        }
    };

    // Cities
    const [cityList, setCityList] = useState([]);

    useEffect(() => {
        cityService
            .getAllCity()
            .then((res) => {
                setCityList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const addNewHotel = () => {
        setHotels([...hotels, {
            hotelName: '',
            address: '',
            phone: '',
            email: '',
            description: '',
            businessLicenseNumber: '',
            taxIdentificationNumber: '',
            image: '',
            cityId: ''
        }]);
        setImagePreviews([...imagePreviews, '']); // Add an empty string for the new hotel's image preview
        setExpandedHotels([...expandedHotels, true]);
    };

    const toggleHotelExpansion = (index) => {
        const newExpandedHotels = [...expandedHotels];
        newExpandedHotels[index] = !newExpandedHotels[index];
        setExpandedHotels(newExpandedHotels);
    };

    const submitHotelRegistration = async (e) => {
        e.preventDefault();

        try {
            for (const hotel of hotels) {
                let imageUrl = '';

                // Handle image upload if there's an image
                if (hotel.image) {
                    const imageData = new FormData();
                    imageData.append("file", hotel.image); // Upload image
                    const imageResponse = await hotelService.uploadImage(imageData);
                    imageUrl = imageResponse.data.link; // Retrieve image URL from response
                }

                // Add owner info to each hotel object
                const hotelWithOwnerInfo = {
                    ...hotel,
                    ownerName,
                    ownerEmail,
                    image: imageUrl
                };

                // Post each hotel one by one
                const hotelResponse = await hotelService.saveHotel(hotelWithOwnerInfo); // Send individual hotel request
                if (hotelResponse.status == 201) {
                    console.log("Hotel registration response: ", hotelResponse.data);
                    setSuccess({ general: "Thanks for joining FHotel! Check your mail later..." }); // Set generic error message
                    setShowSuccess(true); // Show error
    
                } else {
                    console.log("Hotel registration response: ", hotelResponse.data);
                    setError({ general: "An unexpected error occurred. Please try again." }); // Set generic error message
                    setShowError(true); // Show error
    
                }
            }

            // Reset form and states after all hotels are registered
            // setShowCreateHotelRegistrationModal(false);
            // Additional reset logic...
        } catch (error) {
            console.error("Error during hotel registration: ", error.response?.data || error);
            // Handle error...
            setSuccess({ general: "An unexpected error occurred. Please try again." }); // Set generic error message
            setShowError(true); // Show error

        }
    };


    const [success, setSuccess] = useState({}); // State to hold error messages
    const [showSuccess, setShowSuccess] = useState(false); // State to manage error visibility
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
            <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
                <div className="container">
                    <a className="navbar-brand" href="index.html">FHotel</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="oi oi-menu" /> Menu
                    </button>
                    <div className="collapse navbar-collapse" id="ftco-nav">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item active"><a href="index.html" className="nav-link">Home</a></li>
                            <li className="nav-item"><a href="about.html" className="nav-link">About</a></li>
                            <li className="nav-item"><a href="services.html" className="nav-link">Services</a></li>
                            <li className="nav-item"><a href="agent.html" className="nav-link">Agent</a></li>
                            <li className="nav-item"><a href="properties.html" className="nav-link">Listing</a></li>
                            <li className="nav-item"><a href="blog.html" className="nav-link">Blog</a></li>
                            <li className="nav-item"><a className="nav-link" onClick={() => handleOpenHotelRegistrationModal()}>Join with us!</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            {/* END nav */}

            {showCreateHotelRegistrationModal && (
                <form id="hotel-registration-form" onSubmit={submitHotelRegistration}>
                    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Hotel Registration</h5>
                                    <button type="button" className="close" onClick={() => setShowCreateHotelRegistrationModal(false)}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    {showSuccess && Object.entries(success).length > 0 && (
                                        <div className="success-messages" style={{ position: 'absolute', top: '10px', right: '10px', background: 'green', color: 'white', padding: '10px', borderRadius: '5px' }}>
                                            {Object.entries(success).map(([key, message]) => (
                                                <p key={key} style={{ margin: '0' }}>{message}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', textAlign: "left" }}>
                                    {/* Display success message */}
                                    
                                    {/* Owner Information Inputs */}
                                    <div className="form-row mb-3">
                                        <div className="form-group col-md-6">
                                            <label>Owner Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={ownerName}
                                                onChange={(e) => setOwnerName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label>Owner Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={ownerEmail}
                                                onChange={(e) => setOwnerEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Render all hotel entries */}
                                    {hotels.map((hotel, index) => (
                                        <div key={index} className="mb-3">
                                            <button
                                                type="button"
                                                className="btn btn-link"
                                                onClick={() => toggleHotelExpansion(index)}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                {expandedHotels[index] ? 'Collapse' : 'Expand'} Hotel {index + 1}
                                            </button>
                                            {expandedHotels[index] && (
                                                <div className="border p-3 mt-2">
                                                    <div className="row">
                                                        <div className="col-md-5">
                                                            <div className="form-group">
                                                                <label htmlFor="imageUrl">Image * :</label>
                                                                <Dropzone
                                                                    onDrop={(acceptedFiles) => handleFileDrop(acceptedFiles, index)}
                                                                    accept="image/*"
                                                                    multiple={false}
                                                                    maxSize={5000000}
                                                                >
                                                                    {({ getRootProps, getInputProps }) => (
                                                                        <div {...getRootProps()} className="fallback">
                                                                            <input {...getInputProps()} />
                                                                            <div className="dz-message needsclick">
                                                                                <i className="h1 text-muted dripicons-cloud-upload" />
                                                                                <h3>Drop files here or click to upload.</h3>
                                                                            </div>
                                                                            {imagePreviews[index] && (
                                                                                <img
                                                                                    src={imagePreviews[index]}
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
                                                            </div>
                                                        </div>
                                                        <div className="col-md-7">
                                                            <div className="form-row">
                                                                <div className="form-group col-md-6">
                                                                    <label>Hotel Name</label>
                                                                    <input
                                                                        type="text"
                                                                        name="hotelName"
                                                                        className="form-control"
                                                                        value={hotel.hotelName}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        required
                                                                    />
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <label>Phone</label>
                                                                    <input
                                                                        type="number"
                                                                        name="phone"
                                                                        className="form-control"
                                                                        value={hotel.phone}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-md-6">
                                                                    <label>Email</label>
                                                                    <input
                                                                        type="email"
                                                                        name="email"
                                                                        className="form-control"
                                                                        value={hotel.email}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        required
                                                                    />
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <label>City</label>
                                                                    <select
                                                                        name="cityId"
                                                                        className="form-control"
                                                                        value={hotel.cityId}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        required
                                                                    >
                                                                        <option value="">Select City</option>
                                                                        {cityList.map((city) => (
                                                                            <option key={city.cityId} value={city.cityId}>
                                                                                {city.cityName}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-md-6">
                                                                    <label>Business Lincense Number</label>
                                                                    <input
                                                                        type="text"
                                                                        name="businessLicenseNumber"
                                                                        className="form-control"
                                                                        value={hotel.businessLicenseNumber}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        required
                                                                    />
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <label>Tax Identification Number</label>
                                                                    <input
                                                                        type="text"
                                                                        name="taxIdentificationNumber"
                                                                        className="form-control"
                                                                        value={hotel.taxIdentificationNumber}
                                                                        onChange={(e) => handleInputChange(e, index)}
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Address</label>
                                                                <textarea
                                                                    name="address"
                                                                    className="form-control"
                                                                    value={hotel.address}
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Description</label>
                                                                <textarea
                                                                    name="description"
                                                                    className="form-control"
                                                                    value={hotel.description}
                                                                    onChange={(e) => handleInputChange(e, index)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateHotelRegistrationModal(false)}>Close</button>
                                    <button type="button" className="btn btn-info" onClick={addNewHotel}>Add More</button>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}

            <style>
                {`
                    /* Add this CSS to ensure scrolling within modal body */
                    /* Add this CSS to ensure scrolling within modal body */
.modal-body {
  max-height: calc(100vh - 200px); /* Adjust the value (200px) as needed to accommodate the modal header and footer */
  overflow-y: auto; /* Enable vertical scrolling when content exceeds max height */
}

/* Add this CSS to create a sticky footer */
.modal-footer {
  position: sticky;
  bottom: 0;
  background-color: #fff; /* Optional: Set background color for footer */
  padding: 15px; /* Optional: Add padding to footer */
}

                    
                    /* Add this CSS to set a high z-index for modals */
                    .modal {
                      z-index: 9999; /* Set a high z-index value */
                    }
                    
                   .custom-modal-xl {
    max-width: 90%;
    width: 90%;
}

                    
                    
                    
                `}
            </style>

        </>
    )
}

export default Header