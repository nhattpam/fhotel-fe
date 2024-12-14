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
import { Link, useNavigate } from 'react-router-dom';
import roleService from '../../services/role.service';
import hotelVerificationService from '../../services/hotel-verification.service';

const ListHotel = () => {
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
    const [hotelList, setHotelRegistrationList] = useState([]);
    //assign hotel maanager to hotel
    const [hotelManagerList, setHotelManagerList] = useState([]);
    const [hotelSearchTerm, setHotelSearchTerm] = useState('');
    const [currentHotelPage, setCurrentHotelPage] = useState(0);
    const [hotelsPerPage] = useState(10);


    //
    const [hotelDocumentList, setHotelDocumentList] = useState([]);
    const [hotelImageList, setHotelImageList] = useState([]);

    useEffect(() => {
        hotelService
            .getAllHotel()
            .then((res) => {
                const sortedHotelList = [...res.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setHotelRegistrationList(sortedHotelList);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
        userService
            .getAllUser()
            .then((res) => {
                const hotelManagers = res.data.filter(user => user.role?.roleName === "Hotel Manager");

                const sortedUserList = [...hotelManagers].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setHotelManagerList(sortedUserList);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


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
                hotel.district?.districtName.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase()) ||
                hotel.owner?.name.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase())
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
    const [hotelAmenityList, setHotelAmenityList] = useState([]);
    const [hotelVerificationList, setHotelVerificationList] = useState([]);
    const [roleList, setRoleList] = useState([]);

    const openHotelModal = (hotelId) => {
        setShowModalHotel(true);
        if (hotelId) {
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
                .getAllHotelDocumentByHotelId(hotelId)
                .then((res) => {
                    setHotelDocumentList(res.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
            hotelService
                .getAllHotelImageByHotelId(hotelId)
                .then((res) => {
                    setHotelImageList(res.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
            roleService
                .getAllRole()
                .then((res) => {
                    setRoleList(res.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
            hotelService
                .getAllHotelVerificationByHotelId(hotelId)
                .then((res) => {
                    setHotelVerificationList(res.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
        }
    };

    const closeModalHotel = () => {
        setShowModalHotel(false);
        setHotelVerificationList([]);
        setHotelImageList([]);
        setHotelDocumentList([]);
    };


    const [updateHotel, setUpdateHotel] = useState({

    });

    //update hotel status
    const submitUpdateHotel = async (e, hotelId, isActive) => {
        e.preventDefault();

        try {
            // Fetch the user data
            const res = await hotelService.getHotelById(hotelId);
            const hotelData = res.data;

            // Update the local state with the fetched data and new isActive flag
            setUpdateHotel({ ...hotelData, isActive });

            // Make the update request
            const updateRes = await hotelService.updateHotel(hotelId, { ...hotelData, isActive });
            console.log(updateRes)
            if (updateRes.status === 200) {
                // window.alert("Update successful!");
                // Refresh the list after update
                const updatedHotels = await hotelService.getAllHotel();
                const sortedHotelList = [...updatedHotels.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setHotelRegistrationList(sortedHotelList);
            } else {
                handleResponseError(error.response);
            }
        } catch (error) {
            handleResponseError(error.response);
        }
    };


    //assign hotel manager to specific hotel
    const [updateHotelOwner, setUpdateHotelOwner] = useState({

    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateHotelOwner((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const submitUpdateHotelOwner = async (e, hotelId, ownerId) => {
        e.preventDefault();

        try {
            // Fetch the user data
            const res = await hotelService.getHotelById(hotelId);
            const hotelData = res.data;

            // Update the local state with the fetched data and new isActive flag
            setUpdateHotelOwner({ ...hotelData, ownerId });
            console.log(JSON.stringify(hotelData))
            // Make the update request
            const updateRes = await hotelService.updateHotel(hotelId, { ...hotelData, ownerId });
            console.log(updateRes)
            if (updateRes.status === 200) {
                setSuccess({ general: "Cập nhật thành công!" });
                setShowSuccess(true); // Show error
                // Refresh the list after update
                const updatedHotels = await hotelService.getAllHotel();
                const sortedHotelList = [...updatedHotels.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setHotelRegistrationList(sortedHotelList);
            } else {
                handleResponseError(error.response);
            }
        } catch (error) {
            console.log(error);
            handleResponseError(error.response);
        }
    };


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



    //create hotel manager
    const [createUser, setCreateUser] = useState({
        name: "",
        email: "",
        password: "",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTviPcm8hnra4ykrOsbYH2xoPqqI_9xb91Bdg&s",
        identificationNumber: "",
        phoneNumber: "",
        address: "None",
        roleId: "",
    });


    const handleCreateHotelManager = async (e) => {
        e.preventDefault();
        setError({}); // Reset any previous errors
        setShowError(false); // Hide error before validation

        try {
            // Find the role ID where role is "Hotel Manager"
            const hotelManagerRole = roleList.find(role => role.roleName === "Hotel Manager");

            if (hotelManagerRole) {
                createUser.roleId = hotelManagerRole.roleId; // Set roleId to the found role's ID
                createUser.email = hotel.ownerEmail; // Set roleId to the found role's ID
                createUser.name = hotel.ownerName; // Set roleId to the found role's ID
                createUser.password = "123456"; // Set roleId to the found role's ID
                createUser.phoneNumber = hotel.ownerPhoneNumber; // Set roleId to the found role's ID
                createUser.identificationNumber = hotel.ownerIdentificationNumber; // Set roleId to the found role's ID
                createUser.isActive = true;
            } else {
                setError({ general: "Role 'Hotel Manager' not found." });
                setShowError(true);
                return; // Stop execution if the role is not found
            }

            console.log(JSON.stringify(createUser))
            const userResponse = await userService.saveUser(createUser);

            if (userResponse.status === 201) {
                window.alert("Tạo tài khoản thành công!");
                hotel.ownerId = userResponse.data.userId;
                hotel.isActive = true;
                const updateRes = await hotelService.updateHotel(hotel.hotelId, hotel);
                window.location.reload();
            } else {
                handleResponseError(error.response);
                return;
            }

        } catch (error) {
            handleResponseError(error.response);
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


    //CREATE HOTEL VERIFICATION 
    const [showModalCreateHotelVerification, setShowModalCreateHotelVerification] = useState(false);

    const [createHotelVerification, setCreateHotelVerification] = useState({

    });
    //list hotel amenities
    const openCreateHotelVerificationModal = (hotelId, assignedManagerId) => {
        setShowModalCreateHotelVerification(true);
        setShowModalHotel(false);
        if (hotelId) {
            createHotelVerification.hotelId = hotelId;
            createHotelVerification.assignedManagerId = assignedManagerId;
        }
    };

    const closeModalCreateHotelVerification = () => {
        setShowModalCreateHotelVerification(false);
        setShowModalHotel(true);
    };


    const submitCreateHotelVerification = async (e) => {
        e.preventDefault();
        setError({}); // Reset any previous errors
        setShowError(false); // Hide error before validation

        try {

            console.log(JSON.stringify(createHotelVerification))
            const hotelVerificationResponse = await hotelVerificationService.saveHotelVerification(createHotelVerification);

            if (hotelVerificationResponse.status === 201) {
                setSuccess({ general: "Tạo Yêu Cầu Xác Minh Thành Công!." }); // Set error message
                setShowSuccess(true); // Show error
                return;
            } else {
                handleResponseError(error.response);
                return;
            }

        } catch (error) {
            handleResponseError(error.response);
        }


    };

    const [managerList, setManagerList] = useState([]);


    useEffect(() => {
        userService
            .getAllUser()
            .then((res) => {
                const hotelManagers = res.data.filter(user => user.role?.roleName === "Manager");

                const sortedUserList = [...hotelManagers].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setManagerList(sortedUserList);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleInputChangeManager = (e) => {
        const value = e.target.value;
        setCreateHotelVerification({ ...createHotelVerification, [e.target.name]: value });
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


    //FIX LINK
    const navigate = useNavigate();

    const goToEditHotel = (hotelId) => {
        navigate("/edit-hotel", { state: { hotelId } });
    };

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

                            </div>
                        </div>

                        <div className="ibox-body">
                            <div className="table-responsive ">
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
                                            <th><span>Xác minh</span></th>
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
                                                        <td>{item.ownerName}</td>
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
                                                            {item.verifyStatus === "Pending" && (
                                                                <span className="badge label-table ">
                                                                    <span className="badge label-table badge-warning">Đang chờ</span>
                                                                </span>
                                                            )}
                                                            {item.verifyStatus === "Verified" && (
                                                                <span className="badge label-table">
                                                                    <span className="badge label-table badge-success">Đã xác minh</span>
                                                                </span>
                                                            )}
                                                            {item.verifyStatus === "Rejected" && (
                                                                <span className="badge label-table">
                                                                    <span className="badge label-table badge-danger">Từ chối</span>
                                                                </span>)}
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit">
                                                                <i className="fa fa-pencil font-14 text-primary" onClick={() => openHotelModal(item.hotelId)} /></button>
                                                            {
                                                                loginUser.role?.roleName === "Admin" && (
                                                                    <>
                                                                        <form
                                                                            id="demo-form"
                                                                            onSubmit={(e) => submitUpdateHotel(e, item.hotelId, updateHotel.isActive)} // Use isActive from the local state
                                                                            className="d-inline"
                                                                        >
                                                                            <button
                                                                                type="submit"
                                                                                className="btn btn-default btn-xs m-r-5"
                                                                                data-toggle="tooltip"
                                                                                data-original-title="Activate"
                                                                                onClick={() => setUpdateHotel({ ...updateHotel, isActive: true })} // Activate
                                                                            >
                                                                                <i className="fa fa-check font-14 text-success" />
                                                                            </button>
                                                                            <button
                                                                                type="submit"
                                                                                className="btn btn-default btn-xs m-r-5"
                                                                                data-toggle="tooltip"
                                                                                data-original-title="Deactivate"
                                                                                onClick={() => setUpdateHotel({ ...updateHotel, isActive: false })} // Deactivate
                                                                            >
                                                                                <i className="fa fa-times font-14 text-danger" />
                                                                            </button>

                                                                        </form>
                                                                    </>
                                                                )
                                                            }

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
                            <form onSubmit={(e) => submitUpdateHotelOwner(e, hotel.hotelId, updateHotelOwner.ownerId)}>

                                <div className="modal-header  bg-dark text-light">
                                    <h5 className="modal-title">Thông Tin Khách Sạn</h5>
                                    <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalHotel}>
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
                                                                        <>
                                                                            <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                                        </>
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
                                                                        <>
                                                                            <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                                        </>
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
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Mã số:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{hotel.code}</td>
                                                    </tr>
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
                                                        <td style={{ textAlign: 'left', padding: '5px' }}> {hotel && hotel.phone ? hotel.phone : 'Unknown Phone Number'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Quận:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.district?.districtName ? hotel.district?.districtName : 'Unknown District'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Thành phố:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.district?.city?.cityName ? hotel.district?.city?.cityName : 'Unknown City'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Địa chỉ:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.address ? hotel.address : 'Unknown Address'}</td>
                                                    </tr>

                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Tên chủ sở hữu:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.ownerName ? hotel.ownerName : 'Unknown Owner'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Email chủ sở hữu:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.ownerEmail ? hotel.ownerEmail : 'Unknown owner Email'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Xác minh:</th>
                                                        <td style={{ textAlign: 'left', padding: '5px' }}>
                                                            {hotel.verifyStatus === "Pending" && (
                                                                <span className="badge label-table ">
                                                                    <span className="badge label-table badge-warning">Đang chờ</span>
                                                                </span>
                                                            )}
                                                            {hotel.verifyStatus === "Verified" && (
                                                                <span className="badge label-table">
                                                                    <span className="badge label-table badge-success">Đã xác minh</span>
                                                                </span>
                                                            )}
                                                            {hotel.verifyStatus === "Rejected" && (
                                                                <span className="badge label-table">
                                                                    <span className="badge label-table badge-danger">Từ chối</span>
                                                                </span>)}
                                                        </td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                            <div>
                                                <h4 className='text-primary' style={{ textAlign: 'left', fontWeight: 'bold' }}>Lịch sử xác minh</h4>
                                                <div className="table-responsive" style={{ textAlign: 'left' }}>
                                                    <table className="table table-borderless table-hover table-wrap table-centered">
                                                        <thead>
                                                            <tr>
                                                                <th><span>STT</span></th>
                                                                <th><span>Nhân viên xác minh</span></th>
                                                                <th><span>Ngày xác minh</span></th>
                                                                <th><span>Ghi chú</span></th>
                                                                <th><span>Trạng thái</span></th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                hotelVerificationList.length > 0 && hotelVerificationList.map((item, index) => (
                                                                    <>
                                                                        <tr>
                                                                            <td>{index + 1}</td>

                                                                            <td>{item.assignedManager?.name}</td>
                                                                            <td>{new Date(item.verificationDate).toLocaleString('en-US')}</td>
                                                                            <td className='wordwrap' dangerouslySetInnerHTML={{ __html: item.notes }}></td>
                                                                            <td>
                                                                                {item.verificationStatus === "Pending" && (
                                                                                    <span className="badge label-table ">
                                                                                        <span className="badge label-table badge-warning">Đang chờ</span>
                                                                                    </span>
                                                                                )}
                                                                                {item.verificationStatus === "Verified" && (
                                                                                    <span className="badge label-table">
                                                                                        <span className="badge label-table badge-success">Đã xác minh</span>
                                                                                    </span>
                                                                                )}
                                                                                {item.verificationStatus === "Rejected" && (
                                                                                    <span className="badge label-table">
                                                                                        <span className="badge label-table badge-danger">Từ chối</span>
                                                                                    </span>)}
                                                                            </td>

                                                                        </tr>
                                                                    </>
                                                                ))
                                                            }


                                                        </tbody>
                                                    </table>
                                                    {
                                                        hotelVerificationList.length === 0 && (
                                                            <>
                                                                <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </div>

                                        </div>
                                    </div>


                                </div>
                                <div className="modal-footer">
                                    {
                                        loginUser.role?.roleName === "Admin" && (
                                            <>
                                                {
                                                    hotel.verifyStatus !== "Done" && (
                                                        <>
                                                            <button type="button" className="btn btn-danger btn-sm"
                                                                onClick={() => openCreateHotelVerificationModal(hotel.hotelId)}><i class="fa fa-check-square-o" aria-hidden="true"></i> Xác minh ngay</button>
                                                        </>
                                                    )
                                                }

                                                <button type="button" className="btn btn-success btn-sm" onClick={handleCreateHotelManager}><i class="fa fa-user-plus" aria-hidden="true"></i> Tạo tài khoản</button>
                                            </>
                                        )
                                    }

                                    <a type="button" style={{color: 'white'}} className="btn btn-custom btn-sm" onClick={() => goToEditHotel(hotel.hotelId)}><i class="fa fa-info-circle" aria-hidden="true"></i> Xem chi tiết</a>
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
            {
                showModalCreateHotelVerification && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-dialog-scrollable " role="document">

                            <div className="modal-content">
                                <form
                                    method="post"
                                    id="myAwesomeDropzone"
                                    data-plugin="dropzone"
                                    data-previews-container="#file-previews"
                                    data-upload-preview-template="#uploadPreviewTemplate"
                                    data-parsley-validate
                                    onSubmit={(e) => submitCreateHotelVerification(e)}
                                    style={{ textAlign: "left" }}
                                >
                                    <div className="modal-header  bg-dark text-light">
                                        <h5 className="modal-title">Tạo Yêu Cầu Xác Minh</h5>

                                        <button
                                            type="button"
                                            className="close text-light"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                            onClick={closeModalCreateHotelVerification}
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
                                    {showSuccess && Object.entries(success).length > 0 && (
                                        <div className="success-messages" style={{ position: 'absolute', top: '10px', right: '10px', background: 'green', color: 'white', padding: '10px', borderRadius: '5px' }}>
                                            {Object.entries(success).map(([key, message]) => (
                                                <p key={key} style={{ margin: '0' }}>{message}</p>
                                            ))}
                                        </div>
                                    )}

                                    {/* Modal Body with scrollable content */}
                                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>

                                        {/* Form Fields */}
                                        <div className="form-row">
                                            <div className="col-md-12">
                                                <table className="table table-responsive table-hover mt-3">
                                                    <tbody>
                                                        <tr>
                                                            <th style={{ width: '30%' }}>Mã số:</th>
                                                            <td>{hotel.code}</td>
                                                        </tr>
                                                        <tr>
                                                            <th style={{ width: '30%' }}>Tên khách sạn:</th>
                                                            <td>{hotel.hotelName}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Email:</th>
                                                            <td>{hotel.email}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Số điện thoại:</th>
                                                            <td>{hotel && hotel.phone ? hotel.phone : 'Unknown Phone Number'}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Quận:</th>
                                                            <td>{hotel && hotel.district?.districtName ? hotel.district?.districtName : 'Unknown District'}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Thành phố:</th>
                                                            <td>{hotel && hotel.district?.city?.cityName ? hotel.district?.city?.cityName : 'Unknown City'}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Địa chỉ:</th>
                                                            <td>{hotel && hotel.address ? hotel.address : 'Unknown Address'}</td>
                                                        </tr>

                                                        <tr>
                                                            <th>Chủ sở hữu:</th>
                                                            <td>{hotel && hotel.ownerName ? hotel.ownerName : 'Unknown Owner'}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Email chủ sở hữu:</th>
                                                            <td>{hotel && hotel.ownerEmail ? hotel.ownerEmail : 'Unknown owner Email'}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Số điện thoại chủ sở hữu:</th>
                                                            <td>{hotel && hotel.ownerPhoneNumber ? hotel.ownerPhoneNumber : 'Unknown owner Phone'}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Nhân viên xác minh:</th>
                                                            <td>
                                                                <select
                                                                    name="assignedManagerId"
                                                                    className="form-control"
                                                                    value={createHotelVerification.assignedManagerId}
                                                                    onChange={(e) => handleInputChangeManager(e)}
                                                                    required
                                                                >
                                                                    <option value="">Chọn nhân viên</option>
                                                                    {managerList.map((manager) => (
                                                                        <option key={manager.userId} value={manager.userId}>
                                                                            {manager.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </td>
                                                        </tr>

                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-custom btn-sm"><i class="fa fa-floppy-o" aria-hidden="true"></i> Lưu</button>
                                        <button type="button" className="btn btn-dark btn-sm" onClick={closeModalCreateHotelVerification}>Đóng</button>
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

export default ListHotel