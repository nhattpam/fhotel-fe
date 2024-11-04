import React, { useEffect } from 'react'
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import hotelService from '../services/hotel.service';
import Dropzone from 'react-dropzone';
import cityService from '../services/city.service';
import districtService from '../services/district.service';
import hotelImageService from '../services/hotel-image.service';
import documentService from '../services/document.service';
import hotelDocumentService from '../services/hotel-document.service';


const Header = () => {

    const [showCreateHotelRegistrationModal, setShowCreateHotelRegistrationModal] = useState(false);


    const handleOpenHotelRegistrationModal = () => {
        setShowCreateHotelRegistrationModal(true);
    };


    // Cities
    const [cityList, setCityList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [selectedCity, setSelectedCity] = useState(''); // Add state for selected city
    const [documentList, setDocumentList] = useState([]);

    useEffect(() => {
        cityService
            .getAllCity()
            .then((res) => {
                setCityList(res.data);
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

    }, []); // Fetch cities only once when component mounts

    // Fetch districts when selectedCity changes
    useEffect(() => {
        if (selectedCity) {
            cityService
                .getAllDistrictByCityId(selectedCity)
                .then((res) => {
                    setDistrictList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            setDistrictList([]); // Clear district list if no city is selected
        }
    }, [selectedCity]);

    //create hotel
    const [createHotel, setCreateHotel] = useState({
        hotelName: "",
        ownerName: "",
        ownerEmail: "",
        ownerIdentificationNumber: "",
        ownerPhoneNumber: "",
        address: "",
        phone: "",
        email: "",
        description: "",
        districtId: ""
    });

    const [filesHotelImage, setFilesHotelImage] = useState([]); // Change to array for multiple images
    const [imagePreviewsHotelImage, setImagePreviewsHotelImage] = useState([]); // Array for previews
    const [selectedImageIndexHotelImage, setSelectedImageIndexHotelImage] = useState(0);
    const [success, setSuccess] = useState({});
    const [error, setError] = useState({});
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);


    const handleFileDropHotelImage = (acceptedFiles) => {
        const newImagePreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
        setImagePreviewsHotelImage((prev) => [...prev, ...newImagePreviews]);
        setFilesHotelImage((prev) => [...prev, ...acceptedFiles]); // Add this line
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCreateHotel(prevState => ({ ...prevState, [name]: value }));
    };

    const handleDescriptionChange = (value) => {
        setCreateHotel({ ...createHotel, description: value });
    };


    const [filesHotelDocument, setFilesHotelDocument] = useState([]); // Change to array for multiple images
    const [imagePreviewsHotelDocument, setImagePreviewsHotelDocument] = useState([]); // Array for previews
    const [selectedImageIndexHotelDocument, setSelectedImageIndexHotelDocument] = useState(0);

    const handleFileDropHotelDocument = (acceptedFiles) => {
        const newImagePreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
        setImagePreviewsHotelDocument((prev) => [...prev, ...newImagePreviews]);
        setFilesHotelDocument((prev) => [...prev, ...acceptedFiles]); // Add this line
    };

    const submitHotelRegistration = async (e) => {
        e.preventDefault();

        try {
            console.log(JSON.stringify(createHotel))
            // Post the hotel first
            const hotelResponse = await hotelService.saveHotel(createHotel);

            // Handle 201 success
            if (hotelResponse.status === 201) {
                console.log("Hotel registration response: ", hotelResponse.data);
                const hotelId = hotelResponse.data.hotelId;

                // Upload each hotel image
                for (let file of filesHotelImage) {
                    const imageData = new FormData();
                    imageData.append('file', file);

                    const imageResponse = await hotelImageService.uploadImage(imageData);
                    const imageUrl = imageResponse.data.link; // Assuming this gives you the URL
                    // Create hotel image object
                    const createHotelImageData = { hotelId, image: imageUrl, };

                    await hotelImageService.saveHotelImage(createHotelImageData);
                }

                // Upload each hotel document
                for (let file of filesHotelDocument) {
                    const document = documentList.find(doc => doc.documentName === "Hotel Registration");

                    const imageData = new FormData();
                    imageData.append('file', file);

                    const documentResponse = await hotelImageService.uploadImage(imageData);
                    const imageUrl = documentResponse.data.link; // Assuming this gives you the URL
                    if (document) {
                        const documentId = document.documentId; // Assuming documentId is the field that stores the ID
                        // Now you can use documentId
                        const createHotelDocumentData = { hotelId, image: imageUrl, documentId };
                        await hotelDocumentService.saveHotelDocument(createHotelDocumentData);

                    }
                    // Create hotel image object

                }

                setSuccess({ general: "Cảm ơn bạn đã tham gia với FHotel! Kiểm tra mail thường xuyên nhé..." });
                setShowSuccess(true); // Show success
            } else {
                handleResponseError(hotelResponse);
            }
        } catch (error) {
            console.error("Error during hotel registration: ", error.response?.data || error);
            handleResponseError(error.response);
        }
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
            <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
                <div className="container">
                    <a className="navbar-brand" href="index.html">FHotel</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="oi oi-menu" /> Menu
                    </button>
                    <div className="collapse navbar-collapse" id="ftco-nav">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item active"><a href="index.html" className="nav-link">Trang Chủ</a></li>
                            <li className="nav-item"><a href="about.html" className="nav-link">Về Chúng Tôi</a></li>
                            <li className="nav-item"><a href="services.html" className="nav-link">Dịch Vụ</a></li>
                            <li className="nav-item"><a className="nav-link" onClick={() => handleOpenHotelRegistrationModal()}>Tham Gia Ngay!</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            {/* END nav */}

            {showCreateHotelRegistrationModal && (
                <form onSubmit={(e) => submitHotelRegistration(e)}>
                    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" style={{ fontWeight: 'bold' }}>Đăng Ký Khách Sạn</h5>
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
                                    {showError && Object.entries(error).length > 0 && (
                                        <div className="error-messages" style={{ position: 'absolute', top: '10px', right: '10px', background: 'red', color: 'white', padding: '10px', borderRadius: '5px' }}>
                                            {Object.entries(error).map(([key, message]) => (
                                                <p key={key} style={{ margin: '0' }}>{message}</p>
                                            ))}
                                        </div>
                                    )}


                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', textAlign: "left" }}>
                                    <div className="form-row mb-3">
                                        <div className="form-group col-md-6">
                                            <label>Họ và tên chủ sở hữu</label> <span className='text-danger'>*</span>
                                            <input
                                                name='ownerName'
                                                type="text"
                                                className="form-control"
                                                value={createHotel.ownerName}
                                                onChange={(e) => handleChange(e)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label>Email chủ sở hữu</label> <span className='text-danger'>*</span>
                                            <input
                                                name='ownerEmail'
                                                type="email"
                                                className="form-control"
                                                value={createHotel.ownerEmail}
                                                onChange={(e) => handleChange(e)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label>Số căn cước chủ sở hữu</label> <span className='text-danger'>*</span>
                                            <input
                                                name='ownerIdentificationNumber'
                                                type="text"
                                                className="form-control"
                                                value={createHotel.ownerIdentificationNumber}
                                                onChange={(e) => handleChange(e)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label>Số điện thoại chủ sở hữu</label> <span className='text-danger'>*</span>
                                            <input
                                                name='ownerPhoneNumber'
                                                type="text"
                                                className="form-control"
                                                value={createHotel.ownerPhoneNumber}
                                                onChange={(e) => handleChange(e)}
                                                required
                                            />
                                        </div>

                                    </div>


                                    <div className="border p-3 mt-2">
                                        <div className="row">
                                            <div className="col-md-5">
                                                <div className="form-group">
                                                    <label htmlFor="imageUrl">Upload hình ảnh khách sạn:</label> <span className='text-danger'>*</span>
                                                    <Dropzone
                                                        onDrop={(acceptedFiles) => handleFileDropHotelImage(acceptedFiles)}
                                                        accept="image/*"
                                                        multiple={false}
                                                        maxSize={5000000}
                                                    >
                                                        {({ getRootProps, getInputProps }) => (
                                                            <div {...getRootProps()} className="fallback">
                                                                <input {...getInputProps()} />
                                                                <div className="dz-message needsclick">
                                                                    <i className="h1 text-muted dripicons-cloud-upload" />
                                                                    <h5>Tải File.</h5>
                                                                </div>
                                                                {imagePreviewsHotelImage.length > 0 && (
                                                                    <div className="image-previews">
                                                                        {imagePreviewsHotelImage.map((preview, index) => (
                                                                            <img
                                                                                key={index}
                                                                                src={preview}
                                                                                alt={`Preview ${index}`}
                                                                                style={{
                                                                                    maxWidth: "70%",
                                                                                    maxHeight: "80px",
                                                                                    marginTop: "10px",
                                                                                    cursor: "pointer",
                                                                                    border: selectedImageIndexHotelImage === index ? '2px solid blue' : 'none' // Highlight selected image
                                                                                }}
                                                                                onClick={() => setSelectedImageIndexHotelImage(index)} // Change selected image on click
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                )}

                                                            </div>
                                                        )}
                                                    </Dropzone>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="imageUrl">Upload giấy tờ liên quan của khách sạn:</label> <span className='text-danger'>*</span>
                                                    <Dropzone
                                                        onDrop={(acceptedFiles) => handleFileDropHotelDocument(acceptedFiles)}
                                                        accept="image/*"
                                                        multiple={false}
                                                        maxSize={5000000}
                                                    >
                                                        {({ getRootProps, getInputProps }) => (
                                                            <div {...getRootProps()} className="fallback">
                                                                <input {...getInputProps()} />
                                                                <div className="dz-message needsclick">
                                                                    <i className="h1 text-muted dripicons-cloud-upload" />
                                                                    <h5>Tải File.</h5>
                                                                </div>
                                                                {imagePreviewsHotelDocument.length > 0 && (
                                                                    <div className="image-previews">
                                                                        {imagePreviewsHotelDocument.map((preview, index) => (
                                                                            <img
                                                                                key={index}
                                                                                src={preview}
                                                                                alt={`Preview ${index}`}
                                                                                style={{
                                                                                    maxWidth: "70%",
                                                                                    maxHeight: "100px",
                                                                                    marginTop: "10px",
                                                                                    cursor: "pointer",
                                                                                    border: selectedImageIndexHotelDocument === index ? '2px solid blue' : 'none' // Highlight selected image
                                                                                }}
                                                                                onClick={() => setSelectedImageIndexHotelDocument(index)} // Change selected image on click
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                )}

                                                            </div>
                                                        )}
                                                    </Dropzone>
                                                </div>
                                            </div>
                                            <div className="col-md-7">
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <label>Tên khách sạn</label> <span className='text-danger'>*</span>
                                                        <input
                                                            type="text"
                                                            name="hotelName"
                                                            className="form-control"
                                                            value={createHotel.hotelName}
                                                            onChange={(e) => handleChange(e)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label>Số điện thoại</label> <span className='text-danger'>*</span>
                                                        <input
                                                            type="number"
                                                            name="phone"
                                                            className="form-control"
                                                            value={createHotel.phone}
                                                            onChange={(e) => handleChange(e)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <label>Email</label> <span className='text-danger'>*</span>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            className="form-control"
                                                            value={createHotel.email}
                                                            onChange={(e) => handleChange(e)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label>Thành phố</label> <span className='text-danger'>*</span>
                                                        <select
                                                            className="form-control"
                                                            onChange={(e) => {
                                                                setSelectedCity(e.target.value); // Update selected city
                                                            }}
                                                            required
                                                        >
                                                            <option value="">Chọn thành phố</option>
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
                                                        <label>Quận/Huyện</label> <span className='text-danger'>*</span>
                                                        <select
                                                            name="districtId"
                                                            className="form-control"
                                                            value={createHotel.districtId}
                                                            onChange={(e) => handleChange(e)}
                                                            required
                                                        >
                                                            <option value="">Chọn Quận</option>
                                                            {districtList.map((district) => (
                                                                <option key={district.districtId} value={district.districtId}>
                                                                    {district.districtName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label>Địa chỉ</label> <span className='text-danger'>*</span>
                                                        <input
                                                            name="address"
                                                            className="form-control"
                                                            value={createHotel.address}
                                                            onChange={(e) => handleChange(e)}
                                                            required
                                                        />
                                                    </div>
                                                </div>



                                                <div className="form-group">
                                                    <label>Mô tả</label> <span className='text-danger'>*</span>
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={createHotel.description}
                                                        onChange={handleDescriptionChange}
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
                                                        style={{ height: '300px', marginBottom: '50px' }}

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary btn-sm">Gửi</button>
                                    <button type="button" className="btn btn-dark btn-sm" onClick={(e) => setShowCreateHotelRegistrationModal(false)}>Đóng</button>
                                </div>
                            </div>


                        </div>
                    </div>
                </form >
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