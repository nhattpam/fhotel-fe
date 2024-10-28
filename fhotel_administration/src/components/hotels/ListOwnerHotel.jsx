import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import hotelService from '../../services/hotel.service';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import userService from '../../services/user.service';
import { Link } from 'react-router-dom';
import cityService from '../../services/city.service';
import documentService from '../../services/document.service';
import hotelImageService from '../../services/hotel-image.service';
import hotelDocumentService from '../../services/hotel-document.service';
import ReactQuill from 'react-quill';
import Dropzone from 'react-dropzone';
const ListOwnerHotel = () => {

    const loginUserId = sessionStorage.getItem('userId');
    const [loginUser, setLoginUser] = useState({
    });
    useEffect(() => {
        if (loginUserId) {
            userService
                .getUserById(loginUserId)
                .then((res) => {
                    setLoginUser(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, loginUserId);

    //call list hotel registration
    const [hotelList, setHotelList] = useState([]);
    const [hotelSearchTerm, setHotelSearchTerm] = useState('');
    const [currentHotelPage, setCurrentHotelPage] = useState(0);
    const [hotelsPerPage] = useState(5);


    useEffect(() => {
        userService
            .getAllHotelByUserId(loginUserId)
            .then((res) => {
                const sortedHotelList = [...res.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setHotelList(sortedHotelList);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [loginUserId]);


    const handleHotelSearch = (event) => {
        setHotelSearchTerm(event.target.value);
    };

    const filteredHotels = hotelList
        .filter((hotel) => {
            return (
                hotel.hotelName.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase()) ||
                hotel.city?.cityName.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase()) ||
                hotel.city?.country?.countryName.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase()) ||
                hotel.owner?.name.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase())
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

    });
    //list hotel amenities
    //
    const [hotelDocumentList, setHotelDocumentList] = useState([]);
    const [hotelImageList, setHotelImageList] = useState([]);
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
        }
    };

    const closeModalHotel = () => {
        setShowModalHotel(false);
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


    /////create new hotel
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
        address: "",
        phone: "",
        email: "",
        description: "",
        districtId: "",
        ownerId: ""
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
            // createHotel.ownerEmail = loginUser.email;
            // createHotel.ownerName = loginUser.name;
            // createHotel.ownerPhoneNumber = loginUser.phoneNumber;
            // createHotel.ownerIdentificationNumber = loginUser.identificationNumber;
            createHotel.ownerId = loginUser.userId;
            console.log(JSON.stringify(createHotel))
            // Post the hotel first
            const hotelResponse = await hotelService.saveHotel2(createHotel);

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

                setSuccess({ general: "Đã Gửi Yêu Cầu Thành Công!..." });
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
            setError({ general: response.data.message, validation: validationErrors });
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
                            <div className="ibox-title">Danh Sách Khách Sạn</div>
                            <div className="form-group d-flex align-items-center">
                                <input
                                    id="demo-foo-search"
                                    type="text"
                                    placeholder="Tìm Kiếm"
                                    className="form-control form-control-sm"
                                    autoComplete="on"
                                    value={hotelSearchTerm}
                                    onChange={handleHotelSearch}
                                />
                                <button
                                    className="btn btn-primary ml-3 btn-sm"
                                    onClick={handleOpenHotelRegistrationModal} // This will trigger the modal for creating a new hotel
                                >
                                    Tạo Khách Sạn
                                </button>
                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table table-borderless table-hover table-wrap table-centered">
                                    <thead>
                                        <tr>
                                            <th>STT.</th>
                                            <th>Tên Khách Sạn</th>
                                            <th>Chủ Sở Hữu</th>
                                            <th>Quận</th>
                                            <th>Thành Phố</th>
                                            <th>Trạng Thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentHotels.length > 0 && currentHotels.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.hotelName}</td>
                                                        <td>{item.owner?.name}</td>
                                                        <td>{item.district?.districtName}</td>
                                                        <td>{item.district?.city?.cityName}</td>
                                                        <td>
                                                            {item.isActive ? (
                                                                <span className="badge label-table badge-success">Đang Hoạt Động</span>
                                                            ) : (
                                                                <span className="badge label-table badge-danger">Chưa Kích Hoạt</span>
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
                                    <h5 className="modal-title">Thông Tin Khách Sạn</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalHotel}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-5">
                                            <table className="table table-responsive table-hover mt-3">
                                                <tbody>
                                                    <tr>
                                                        <th>Hình Ảnh:</th>
                                                        <td style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', margin: 0 }}>
                                                            {
                                                                hotelImageList.length > 0 ? hotelImageList.map((item, index) => (
                                                                    <div key={index} style={{ position: 'relative', textAlign: 'center', flex: '0 1 auto', margin: '5px' }}>
                                                                        <img src={item.image} alt="amenity" style={{ width: "150px", margin: '0 5px' }}
                                                                            onClick={() => handleImageLargerClick(item.image)}
                                                                        />

                                                                    </div>
                                                                ))
                                                                    : (
                                                                        <div style={{ textAlign: 'center', fontSize: '16px', color: 'gray' }}>
                                                                            Không Tìm Thấy.
                                                                        </div>
                                                                    )
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Giấy Tờ:</th>
                                                        <td style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', margin: 0 }}>
                                                            {
                                                                hotelDocumentList.length > 0 ? hotelDocumentList.map((item, index) => (
                                                                    <div key={index} style={{ position: 'relative', textAlign: 'center', flex: '0 1 auto', margin: '5px' }}>
                                                                        <img src={item.image} alt="amenity" style={{ width: "150px", margin: '0 5px' }}
                                                                            onClick={() => handleImageLargerClick(item.image)}
                                                                        />

                                                                    </div>
                                                                ))
                                                                    : (
                                                                        <div style={{ textAlign: 'center', fontSize: '16px', color: 'gray' }}>
                                                                            Không Tìm Thấy.
                                                                        </div>
                                                                    )
                                                            }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>

                                        <div className="col-md-7">
                                            <table className="table table-responsive table-hover mt-3">
                                                <tbody>
                                                    <tr>
                                                        <th style={{ width: '30%' }}>Tên Khách Sạn:</th>
                                                        <td>{hotel.hotelName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Email:</th>
                                                        <td>{hotel.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Số Điện Thoại:</th>
                                                        <td>{hotel && hotel.phone ? hotel.phone : 'Không tìm thấy'}</td>
                                                    </tr>
                                                   
                                                    <tr>
                                                        <th>Quận:</th>
                                                        <td>{hotel && hotel.district?.districtName ? hotel.district?.districtName : 'Không tìm thấy'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Thành Phố:</th>
                                                        <td>{hotel && hotel.district?.city?.cityName ? hotel.district?.city?.cityName : 'Không tìm thấy'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Địa Chỉ:</th>
                                                        <td>{hotel && hotel.address ? hotel.address : 'Không tìm thấy'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Chủ Sở Hữu:</th>
                                                        <td>{hotel && hotel.ownerName ? hotel.ownerName : 'Không tìm thấy'}</td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>

                                    </div>


                                </div>
                                <div className="modal-footer">
                                    <Link type="button" className="btn btn-custom btn-sm" to={`/edit-hotel/${hotel.hotelId}`}>Xem Chi Tiết</Link>
                                    <button type="button" className="btn btn-dark btn-sm" onClick={closeModalHotel} >Đóng</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )}

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
                                    <button type="button" className="btn btn-dark btn-sm" onClick={handleCloseImageLargeModal} >Đóng</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )
            }
            {showCreateHotelRegistrationModal && (
                <form onSubmit={(e) => submitHotelRegistration(e)}>
                    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Tạo Khách Sạn</h5>
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
                                    <div className="border p-3 mt-2">
                                        <div className="row">
                                            <div className="col-md-5">
                                                <div className="form-group">
                                                    <label htmlFor="imageUrl">Upload Hình Ảnh * :</label>
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
                                                                    <h3>Tải File.</h3>
                                                                </div>
                                                                {imagePreviewsHotelImage.length > 0 && (
                                                                    <div className="image-previews">
                                                                        {imagePreviewsHotelImage.map((preview, index) => (
                                                                            <img
                                                                                key={index}
                                                                                src={preview}
                                                                                alt={`Preview ${index}`}
                                                                                style={{
                                                                                    maxWidth: "60%",
                                                                                    maxHeight: "50px",
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
                                                    <label htmlFor="imageUrl">Upload Giấy Tờ Khách Sạn * :</label>
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
                                                                    <h3>Tải File.</h3>
                                                                </div>
                                                                {imagePreviewsHotelDocument.length > 0 && (
                                                                    <div className="image-previews">
                                                                        {imagePreviewsHotelDocument.map((preview, index) => (
                                                                            <img
                                                                                key={index}
                                                                                src={preview}
                                                                                alt={`Preview ${index}`}
                                                                                style={{
                                                                                    maxWidth: "60%",
                                                                                    maxHeight: "50px",
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
                                                        <label>Tên Khách Sạn</label>
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
                                                        <label>Số Điện Thoại</label>
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
                                                        <label>Email</label>
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
                                                        <label>Thành Phố</label>
                                                        <select
                                                            className="form-control"
                                                            onChange={(e) => {
                                                                setSelectedCity(e.target.value); // Update selected city
                                                            }}
                                                            required
                                                        >
                                                            <option value="">Chọn Thành Phố</option>
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
                                                        <label>Quận</label>
                                                        <select
                                                            name="districtId"
                                                            className="form-control"
                                                            value={createHotel.districtId}
                                                            onChange={(e) => handleChange(e)}
                                                            required
                                                        >
                                                            <option value="">Chọn Quận/Huyện</option>
                                                            {districtList.map((district) => (
                                                                <option key={district.districtId} value={district.districtId}>
                                                                    {district.districtName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label>Địa Chỉ</label>
                                                        <textarea
                                                            name="address"
                                                            className="form-control"
                                                            value={createHotel.address}
                                                            onChange={(e) => handleChange(e)}
                                                            required
                                                        />
                                                    </div>
                                                </div>



                                                <div className="form-group">
                                                    <label>Mô Tả</label>
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
                                    <button type="button" className="btn btn-dark btn-sm" 
                                    onClick={(e) => setShowCreateHotelRegistrationModal(false)}>Đóng</button>
                                    <button type="submit" className="btn btn-primary btn-sm">Gửi</button>
                                </div>
                            </div>


                        </div>
                    </div>
                </form >
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

export default ListOwnerHotel