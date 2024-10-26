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
import { Link } from 'react-router-dom';
import roleService from '../../services/role.service';

const ListHotel = () => {


    //call list hotel registration
    const [hotelList, setHotelRegistrationList] = useState([]);
    //assign hotel maanager to hotel
    const [hotelManagerList, setHotelManagerList] = useState([]);
    const [hotelSearchTerm, setHotelSearchTerm] = useState('');
    const [currentHotelPage, setCurrentHotelPage] = useState(0);
    const [hotelsPerPage] = useState(5);


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
            })
            .catch((error) => {
                console.log(error);
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

    });
    //list hotel amenities
    const [hotelAmenityList, setHotelAmenityList] = useState([]);
    const [roleList, setRoleList] = useState([]);

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
            roleService
                .getAllRole()
                .then((res) => {
                    setRoleList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const closeModalHotel = () => {
        setShowModalHotel(false);
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
                window.alert("Update FAILED!");
            }
        } catch (error) {
            console.log(error);
            window.alert("An error occurred during the update.");
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
                setSuccess({ general: "Update successfully!" });
                setShowSuccess(true); // Show error
                // Refresh the list after update
                const updatedHotels = await hotelService.getAllHotel();
                const sortedHotelList = [...updatedHotels.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setHotelRegistrationList(sortedHotelList);
            } else {
                setError({ general: "An error occurred during the update." }); // Set generic error message
                setShowError(true); // Show error
            }
        } catch (error) {
            console.log(error);
            setError({ general: "An error occurred during the update." }); // Set generic error message
            setShowError(true); // Show error
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
                window.alert("User created successfully!");
                hotel.ownerId = userResponse.data.userId;
                hotel.isActive = true;
                const updateRes = await hotelService.updateHotel(hotel.hotelId, hotel);
                window.location.reload();
            } else {
                setError({ general: "Failed to create user." }); // Set error message
                setShowError(true); // Show error
                return;
            }

        } catch (error) {
            console.log(error);
            setError({ general: "An unexpected error occurred. Please try again." }); // Set generic error message
            setShowError(true); // Show error
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
                                    placeholder="Search"
                                    className="form-control form-control-sm"
                                    autoComplete="on"
                                    value={hotelSearchTerm}
                                    onChange={handleHotelSearch}
                                />
                            </div>
                        </div>

                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table">
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
                                                        {/* <td>
                                                            <img src={item.image} alt="avatar" style={{ width: "100px" }} />

                                                        </td> */}
                                                        <td>{item.hotelName}</td>
                                                        <td>{item.ownerName}</td>
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
                                                                    className="btn btn-default btn-xs"
                                                                    data-toggle="tooltip"
                                                                    data-original-title="Deactivate"
                                                                    onClick={() => setUpdateHotel({ ...updateHotel, isActive: false })} // Deactivate
                                                                >
                                                                    <i className="fa fa-times font-14 text-danger" />
                                                                </button>
                                                            </form>
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

                                <div className="modal-header">
                                    <h5 className="modal-title">Thông Tin Khách Sạn</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalHotel}>
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
                                                                            No hotel images available.
                                                                        </div>
                                                                    )
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Tài Liệu:</th>
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
                                                                            Không có tài liệu khách sạn.
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
                                                        <th style={{ width: '30%' }}>Tên:</th>
                                                        <td>{hotel.hotelName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Email:</th>
                                                        <td>{hotel.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Số Điện Thoại:</th>
                                                        <td>{hotel && hotel.phone ? hotel.phone : 'Unknown Phone Number'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Quận:</th>
                                                        <td>{hotel && hotel.district?.districtName ? hotel.district?.districtName : 'Unknown District'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Thành Phố:</th>
                                                        <td>{hotel && hotel.district?.city?.cityName ? hotel.district?.city?.cityName : 'Unknown City'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Địa Chỉ:</th>
                                                        <td>{hotel && hotel.address ? hotel.address : 'Unknown Address'}</td>
                                                    </tr>

                                                    <tr>
                                                        <th>Chủ Sở Hữu:</th>
                                                        <td>{hotel && hotel.ownerName ? hotel.ownerName : 'Unknown Owner'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Email Chủ Sở Hữu:</th>
                                                        <td>{hotel && hotel.ownerEmail ? hotel.ownerEmail : 'Unknown owner Email'}</td>
                                                    </tr>


                                                </tbody>
                                            </table>

                                        </div>
                                    </div>


                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-success" onClick={handleCreateHotelManager}>Tạo tài khoản</button>
                                    <Link type="button" className="btn btn-custom" to={`/edit-hotel/${hotel.hotelId}`}>Xem Chi Tiết</Link>
                                    <button type="button" className="btn btn-dark" onClick={closeModalHotel} >Đóng</button>
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
                                    <h5 className="modal-title">Image</h5>
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
                                    <button type="button" className="btn btn-dark" onClick={handleCloseImageLargeModal} >Close</button>
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