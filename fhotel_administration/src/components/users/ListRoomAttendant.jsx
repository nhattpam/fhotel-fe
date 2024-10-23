import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import userService from '../../services/user.service';
import roleService from '../../services/role.service';
import hotelService from '../../services/hotel.service';
import hotelAmenityService from '../../services/hotel-amenity.service';
import hotelStaffService from '../../services/hotel-staff.service';

const ListRoomAttendant = () => {

    //get user information
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
    }, [loginUserId]);

    //call list user registration
    const [userList, setUserList] = useState([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [currentUserPage, setCurrentUserPage] = useState(0);
    const [usersPerPage] = useState(5);


    useEffect(() => {
        userService
            .getAllStaffByOwnerId(loginUserId)
            .then((res) => {
                const roomAttendants = res.data.filter(item => item.user?.role?.roleName === "Room Attendant");

                const sortedUserList = [...roomAttendants].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setUserList(sortedUserList);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    const handleUserSearch = (event) => {
        setUserSearchTerm(event.target.value);
    };

    const filteredUsers = userList
        .filter((item) => {
            return (
                item.user?.name.toString().toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                item.user?.createdDate.toString().toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                item.user?.email.toString().toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                item.user?.address.toString().toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                item.user?.role?.roleName.toString().toLowerCase().includes(userSearchTerm.toLowerCase())
            );
        });

    const pageUserCount = Math.ceil(filteredUsers.length / usersPerPage);

    const handleUserPageClick = (data) => {
        setCurrentUserPage(data.selected);
    };

    const offsetUser = currentUserPage * usersPerPage;
    const currentUsers = filteredUsers.slice(offsetUser, offsetUser + usersPerPage);


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

        }
    };

    const closeModalUser = () => {
        setShowModalUser(false);
    };

    //create user manager modal
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

    const [createHotelStaff, setCreateHotelStaff] = useState({
        hotelId: "",
        userId: ""
    });
    const [showModalCreateUser, setShowModalCreateUser] = useState(false);

    const openCreateUserModal = () => {
        setShowModalCreateUser(true);
        if (loginUserId) {
            userService
                .getAllHotelByUserId(loginUserId)
                .then((res) => {
                    setHotelList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const closeModalCreateUser = () => {
        setShowModalCreateUser(false);
    };


    const [error, setError] = useState({}); // State to hold error messages
    const [showError, setShowError] = useState(false); // State to manage error visibility

    const handleChange = (e) => {
        const value = e.target.value;

        setCreateUser({ ...createUser, [e.target.name]: value });
    };

    const validateForm = () => {
        let isValid = true;
        const newError = {}; // Create a new error object

        // Validate Last Name
        if (createUser.name.trim() === "") {
            newError.name = "Full Name is required";
            isValid = false;
        }

     
        // Validate Phone
        if (createUser.phoneNumber.trim() === "") {
            newError.phoneNumber = "Phone number is required";
            isValid = false;
        } else if (!/^\d{10}$/.test(createUser.phoneNumber.trim())) {
            newError.phone = "Phone number must be exactly 10 digits";
            isValid = false;
        }

        // Validate Email
        if (createUser.email.trim() === "") {
            newError.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createUser.email)) {
            newError.email = "Email is not valid";
            isValid = false;
        }

        // Validate Hotel
        if (createHotelStaff.hotelId.trim() === "") {
            newError.hotelId = "Hotel is required";
            isValid = false;
        }

        setError(newError); // Set the new error object
        setShowError(Object.keys(newError).length > 0); // Show error if there are any
        return isValid;
    };

    const [roleList, setRoleList] = useState([]);
    useEffect(() => {
        roleService
            .getAllRole()
            .then((res) => {
                setRoleList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    // Make sure you have a function to handle changes in the hotel staff selection
    const handleInputChange = (e) => {
        const value = e.target.value;
        setCreateHotelStaff({ ...createHotelStaff, [e.target.name]: value });
    };

    const submitUser = async (e) => {
        e.preventDefault();
        setError({}); // Reset any previous errors
        setShowError(false); // Hide error before validation

        if (validateForm()) {
            try {
                // Find the role ID where role is "Hotel Manager"
                const roomAttendantRole = roleList.find(role => role.roleName === "Room Attendant");

                if (roomAttendantRole) {
                    createUser.roleId = roomAttendantRole.roleId; // Set roleId to the found role's ID
                } else {
                    setError({ general: "Role 'Room Attendant' not found." });
                    setShowError(true);
                    return; // Stop execution if the role is not found
                }

                createUser.sex = Boolean(createUser.sex); // This will convert "1" to 1 and "0" to 0

                console.log(JSON.stringify(createUser))
                const userResponse = await userService.saveUser(createUser);

                if (userResponse.status === 201) {
                    // Create hotel staff
                    createHotelStaff.userId = userResponse.data.userId; // Assuming the response contains the created user's ID
                    createHotelStaff.hotelId = createHotelStaff.hotelId; // Get the selected hotel ID from state

                    console.log(JSON.stringify(createHotelStaff))
                    // Make API call to create hotel staff
                    const staffResponse = await hotelStaffService.saveHotelStaff(createHotelStaff); // Replace with your actual service call

                    if (staffResponse.status === 201) {
                        setSuccess({ general: "User created successfully!" });
                        setShowSuccess(true); // Show success
                        userService
                            .getAllStaffByOwnerId(loginUserId)
                            .then((res) => {
                                const roomAttendants = res.data.filter(item => item.user?.role?.roleName === "Room Attendant");

                                const sortedUserList = [...roomAttendants].sort((a, b) => {
                                    // Assuming requestedDate is a string in ISO 8601 format
                                    return new Date(b.createdDate) - new Date(a.createdDate);
                                });
                                setUserList(sortedUserList);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    } else {
                        setError({ general: "Failed to create hotel staff." }); // Set error message
                        setShowError(true); // Show error
                    }
                } else {
                    if (error.response && error.response.status === 400) {
                        // Extract the validation errors if available
                        const validationErrors = error.response.data.errors || [];
                        setError({ validation: validationErrors });
                    } else {
                        // For other types of errors (e.g., network issues, unexpected status codes)
                        setError({ general: "An unexpected error occurred. Please try again." });
                    }

                    setShowError(true); // Show error modal or message
                }

            } catch (error) {
                if (error.response && error.response.status === 400) {
                    // Extract the validation errors if available
                    const validationErrors = error.response.data.errors || [];
                    setError({ validation: validationErrors });
                } else {
                    // For other types of errors (e.g., network issues, unexpected status codes)
                    setError({ general: "An unexpected error occurred. Please try again." });
                }

                setShowError(true); // Show error modal or message
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






    //open hotel modal
    const [showModalHotel, setShowModalHotel] = useState(false);

    //list hotel amenities
    const [hotelAmenityList, setHotelAmenityList] = useState([]);

    useEffect(() => {
        hotelAmenityService
            .getAllHotelAmenity()
            .then((res) => {
                setHotelAmenityList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    const [hotel, setHotel] = useState({

    });


    const openHotelModal = (hotelId) => {
        setShowModalHotel(true);
        setShowModalUser(false);
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
        setShowModalUser(true);
        setShowModalHotel(false);
    };


    // Update user status dynamically
    const updateUserStatus = async (e, userId, isActive) => {
        e.preventDefault();

        try {
            // Fetch the user data
            const res = await userService.getUserById(userId);
            const userData = res.data;

            // Update the local state with the fetched data and new isActive flag
            setUser({ ...userData, isActive });

            // Make the update request
            const updateRes = await userService.updateUser(userId, { ...userData, isActive });

            if (updateRes.status === 200) {
                // window.alert("Update successful!");
                userService
                    .getAllStaffByOwnerId(loginUserId)
                    .then((res) => {
                        const roomAttendants = res.data.filter(item => item.user?.role?.roleName === "Room Attendant");

                        const sortedUserList = [...roomAttendants].sort((a, b) => {
                            // Assuming requestedDate is a string in ISO 8601 format
                            return new Date(b.createdDate) - new Date(a.createdDate);
                        });
                        setUserList(sortedUserList);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
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
                            <div className="ibox-title">List of Room Attendants</div>
                            <div className="form-group d-flex align-items-center">
                                <input
                                    id="demo-foo-search"
                                    type="text"
                                    placeholder="Search"
                                    className="form-control form-control-sm"
                                    autoComplete="on"
                                    value={userSearchTerm}
                                    onChange={handleUserSearch}
                                />
                                <button
                                    className="btn btn-primary ml-3"
                                    onClick={openCreateUserModal} // This will trigger the modal for creating a new hotel
                                >
                                    Create New Room Attendant
                                </button>
                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentUsers.length > 0 && currentUsers.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.user?.name}</td>
                                                        <td>{item.user?.email}</td>
                                                        <td>{item.user?.role?.roleName}</td>
                                                        <td>
                                                            {item.user?.isActive ? (
                                                                <span className="badge label-table badge-success">Active</span>
                                                            ) : (
                                                                <span className="badge label-table badge-danger">Inactive</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit"><i className="fa fa-pencil font-14" onClick={() => openUserModal(item.userId)} /></button>
                                                            <form
                                                                id="demo-form"
                                                                onSubmit={(e) => updateUserStatus(e, item.user?.userId, user.isActive)} // Use isActive from the local state
                                                                className="d-inline"
                                                            >
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-default btn-xs m-r-5"
                                                                    data-toggle="tooltip"
                                                                    data-original-title="Activate"
                                                                    onClick={() => setUser({ ...user, isActive: true })} // Activate
                                                                >
                                                                    <i className="fa fa-check font-14 text-success" />
                                                                </button>
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-default btn-xs"
                                                                    data-toggle="tooltip"
                                                                    data-original-title="Deactivate"
                                                                    onClick={() => setUser({ ...user, isActive: false })} // Deactivate
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
                                pageCount={pageUserCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handleUserPageClick}
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



            {
                showModalCreateUser && (
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
                                    onSubmit={(e) => submitUser(e)}
                                    style={{ textAlign: "left" }}
                                >
                                    <div className="modal-header">
                                        <h5 className="modal-title">Create a Room Attendant</h5>

                                        <button
                                            type="button"
                                            className="close"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                            onClick={closeModalCreateUser}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    {showSuccess && Object.entries(success).length > 0 && (
                                        <div className="success-messages" style={{ position: 'absolute', top: '10px', right: '10px', background: 'green', color: 'white', padding: '10px', borderRadius: '5px' }}>
                                            {Object.entries(success).map(([key, message]) => (
                                                <p key={key} style={{ margin: '0' }}>{message}</p>
                                            ))}
                                        </div>
                                    )}
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
                                                <label htmlFor="hotelName">Full Name * :</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    id="name"
                                                    value={createUser.name}
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                />
                                                
                                            </div>

                                            <div className="form-group col-md-6">
                                                <label htmlFor="email">Email * :</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    id="email"
                                                    value={createUser.email}
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                />
                                            </div>
                                        </div>


                                        <div className="form-row">
                                           

                                            <div className="form-group col-md-6">
                                                <label htmlFor="password">Password * :</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    name="password"
                                                    id="password"
                                                    value={createUser.password}
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group col-md-6">
                                                <label htmlFor="star">Identification Number * :</label>
                                                <div className="input-group">
                                                    <input
                                                        type="number"
                                                        id="identificationNumber"
                                                        className="form-control"
                                                        name="identificationNumber"
                                                        value={createUser.identificationNumber}
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
                                                        id="phoneNumber"
                                                        className="form-control"
                                                        name="phoneNumber"
                                                        value={createUser.phoneNumber}
                                                        onChange={(e) => handleChange(e)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="address">Hotel * :</label>
                                                <select
                                                    name="hotelId"
                                                    className="form-control"
                                                    value={createHotelStaff.hotelId}
                                                    onChange={(e) => handleInputChange(e)}
                                                    required
                                                >
                                                    <option value="">Select Hotel</option>
                                                    {hotelList.map((hotel) => (
                                                        <option key={hotel.hotelId} value={hotel.hotelId}>
                                                            {hotel.hotelName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                        </div>



                                    </div>

                                    {/* Modal Footer */}
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-custom">Save</button>
                                        <button type="button" className="btn btn-dark" onClick={closeModalCreateUser}>Close</button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div >

                )
            }
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
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-5">
                                            <img src={hotel.image} alt="avatar" style={{ width: '100%' }} />
                                            <div className='row mt-2'>
                                                <div className='col-md-12'>
                                                    <h3 style={{ fontWeight: "bold" }}>Amenities</h3>
                                                </div>
                                                <div className='col-md-12'>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                                        {
                                                            hotelAmenityList.length > 0 && hotelAmenityList.map((item, index) => (
                                                                <div key={index} style={{ textAlign: 'center', flex: '1 1 20%' }}>
                                                                    <img src={item.image} alt="avatar" style={{ width: "40px" }} />
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
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
                                                        <th>Business License Number:</th>
                                                        <td>{hotel && hotel.businessLicenseNumber ? hotel.businessLicenseNumber : 'Unknown Business License Number'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Tax Identification Number:</th>
                                                        <td>{hotel && hotel.taxIdentificationNumber ? hotel.taxIdentificationNumber : 'Unknown Tax Identification Number'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>City:</th>
                                                        <td>{hotel && hotel.city?.cityName ? hotel.city?.cityName : 'Unknown City'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Address:</th>
                                                        <td>{hotel && hotel.address ? hotel.address : 'Unknown Address'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Description:</th>
                                                        <td>{hotel && hotel.description ? hotel.description : 'Unknown Description'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Owner:</th>
                                                        <td>{hotel && hotel.ownerName ? hotel.ownerName : 'Unknown Owner'}</td>
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

    .d-inline {
  display: inline-block;
  margin-right: 5px;
}

                                            `}
            </style>

        </>
    )
}

export default ListRoomAttendant