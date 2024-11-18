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
    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING

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
    const [hotelsPerPage] = useState(10);


    useEffect(() => {
        userService
            .getAllHotelByUserId(loginUserId)
            .then((res) => {
                const sortedHotelList = [...res.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setHotelList(sortedHotelList);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [loginUserId]);


    const [selectedDistrictId, setSelectedDistrictId] = useState('');
    const uniqueDistricts = [...new Set(hotelList.map((hotel) => hotel.district?.districtName))]
        .filter(Boolean);

    const handleHotelSearch = (event) => {
        setHotelSearchTerm(event.target.value);
    };

    const filteredHotels = hotelList
        .filter((hotel) => {
            const matchesDistrict = selectedDistrictId ? hotel.district?.districtName === selectedDistrictId : true;
            const matchesSearchTerm = (
                hotel.code.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase()) ||
                hotel.hotelName.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase()) ||
                hotel.district?.city?.cityName.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase()) ||
                hotel.district?.districtName.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase())
            );
            return matchesDistrict && matchesSearchTerm;
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
                            <div className="ibox-title">Danh Sách Khách Sạn</div>
                            <div className="form-group d-flex align-items-center">
                                <select
                                    value={selectedDistrictId}
                                    onChange={(e) => setSelectedDistrictId(e.target.value)}
                                    className="form-control form-control-sm"
                                >
                                    <option value="">Tất cả quận</option>
                                    {uniqueDistricts.map((districtName, index) => (
                                        <option key={index} value={districtName}>{districtName}</option>
                                    ))}
                                </select>
                                <div className="search-bar ml-3">
                                    <i className="fa fa-search search-icon" aria-hidden="true"></i>
                                    <input
                                        id="demo-foo-search"
                                        type="text"
                                        placeholder="Tìm kiếm"
                                        className="form-control form-control-sm "
                                        autoComplete="on"
                                        value={hotelSearchTerm}
                                        onChange={handleHotelSearch}
                                    />
                                </div>

                                <button
                                    className="btn btn-primary ml-3 btn-sm"
                                    onClick={handleOpenHotelRegistrationModal} // This will trigger the modal for creating a new hotel
                                >
                                    <i class="fa fa-plus-square" aria-hidden="true"></i> Tạo khách sạn
                                </button>
                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table table-borderless table-hover table-wrap table-centered">
                                    <thead>
                                        <tr>
                                            <th><span>STT</span></th>
                                            <th><span>Mã số</span></th>
                                            <th><span>Tên khách sạn</span> </th>
                                            <th><span>Chủ sở hữu</span></th>
                                            <th><span>Quận</span></th>
                                            <th><span>Thành phố</span></th>
                                            <th><span>Trạng thái</span></th>
                                            <th><span>Hành động</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentHotels.length > 0 && currentHotels.map((item, index) => (
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
                                                            <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit"><i className="fa fa-pencil font-14 text-primary" onClick={() => openHotelModal(item.hotelId)} /></button>
                                                            {/* <button className="btn btn-default btn-xs" data-toggle="tooltip" data-original-title="Delete"><i className="fa fa-trash font-14" /></button> */}
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

                                <div className="modal-header bg-dark text-light">
                                    <h5 className="modal-title">Thông Tin Khách Sạn</h5>
                                    <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalHotel}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-5">
                                            <table className="table table-responsive table-hover mt-3">
                                                <tbody>
                                                    <tr>
                                                        <th>Hình ảnh:</th>
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
                                                        <th>Giấy tờ khách sạn:</th>
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
                                            <table className="table table-responsive table-hover mt-3" style={{fontSize: '20px'}}>
                                                <tbody>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Tên khách sạn:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{hotel.hotelName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Email:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{hotel.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Số điện thoại:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.phone ? hotel.phone : 'Không tìm thấy'}</td>
                                                    </tr>

                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Quận:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.district?.districtName ? hotel.district?.districtName : 'Không tìm thấy'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Thành phố:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.district?.city?.cityName ? hotel.district?.city?.cityName : 'Không tìm thấy'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Địa chỉ:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.address ? hotel.address : 'Không tìm thấy'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Chủ sở hữu:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.ownerName ? hotel.ownerName : 'Không tìm thấy'}</td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>

                                    </div>


                                </div>
                                <div className="modal-footer">
                                    <Link type="button" className="btn btn-custom btn-sm" to={`/edit-hotel/${hotel.hotelId}`}><i class="fa fa-info-circle" aria-hidden="true"></i> Xem chi tiết</Link>
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
                                <div className="modal-header bg-dark text-light">
                                    <h5 className="modal-title">Tạo Khách Sạn</h5>
                                    <button type="button" className="close text-light" onClick={() => setShowCreateHotelRegistrationModal(false)}>
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
                                                    <label htmlFor="imageUrl">Upload hình ảnh khách sạn <span className='text-danger'>*</span> :</label>
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
                                                                    <h3>Tải file.</h3>
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
                                                    <label htmlFor="imageUrl">Upload giấy tờ khách sạn <span className='text-danger'>*</span> :</label>
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
                                                                    <h3>Tải file.</h3>
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
                                                        <label>Tên khách sạn <span className='text-danger'>*</span> :</label>
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
                                                        <label>Số điện thoại <span className='text-danger'>*</span> :</label>
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
                                                        <label>Email <span className='text-danger'>*</span> :</label>
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
                                                        <label>Thành phố <span className='text-danger'>*</span> :</label>
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
                                                        <label>Quận <span className='text-danger'>*</span> :</label>
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
                                                        <label>Địa chỉ <span className='text-danger'>*</span> :</label>
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
                                                    <label>Mô tả <span className='text-danger'>*</span> :</label>
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
                                    <button type="submit" className="btn btn-primary btn-sm"><i class="fa fa-paper-plane-o" aria-hidden="true"></i> Gửi yêu cầu</button>
                                    <button type="button" className="btn btn-dark btn-sm"
                                        onClick={(e) => setShowCreateHotelRegistrationModal(false)}>Đóng</button>
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

                .search-bar {
    position: relative;
    display: inline-block;
}

.search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
}

.search-bar input {
    padding-left: 30px; /* Adjust padding to make room for the icon */
    width: 150px
}


                                            `}
            </style>

        </>
    )
}

export default ListOwnerHotel