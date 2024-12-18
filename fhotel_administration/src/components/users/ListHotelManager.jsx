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
import { Link, useNavigate } from 'react-router-dom';

const ListHotelManager = () => {
    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING


    //call list user registration
    const [userList, setUserList] = useState([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [currentUserPage, setCurrentUserPage] = useState(0);
    const [usersPerPage] = useState(10);


    useEffect(() => {
        userService
            .getAllUser()
            .then((res) => {
                const hotelManagers = res.data.filter(user => user.role?.roleName === "Hotel Manager");

                const sortedUserList = [...hotelManagers].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setUserList(sortedUserList);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);


    const handleUserSearch = (event) => {
        setUserSearchTerm(event.target.value);
    };

    const filteredUsers = userList
        .filter((user) => {
            return (
                user.name.toString().toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                user.code.toString().toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                user.createdDate.toString().toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                user.email.toString().toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                user.address.toString().toLowerCase().includes(userSearchTerm.toLowerCase())
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
            userService
                .getAllHotelByUserId(userId)
                .then((res) => {
                    setHotelList(res.data);
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
        address: "",
        sex: false,
        roleId: "",
    });
    const [showModalCreateUser, setShowModalCreateUser] = useState(false);

    const openCreateUserModal = () => {
        setShowModalCreateUser(true);

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
            newError.name = "Name is required";
            isValid = false;
        }

        // Validate Address
        if (createUser.address.trim() === "") {
            newError.address = "Address is required";
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

    const submitUser = async (e) => {
        e.preventDefault();
        setError({}); // Reset any previous errors
        setShowError(false); // Hide error before validation

        if (validateForm()) {
            try {
                // Find the role ID where role is "Hotel Manager"
                const hotelManagerRole = roleList.find(role => role.roleName === "Hotel Manager");

                if (hotelManagerRole) {
                    createUser.roleId = hotelManagerRole.roleId; // Set roleId to the found role's ID
                } else {
                    setError({ general: "Role 'Hotel Manager' not found." });
                    setShowError(true);
                    return; // Stop execution if the role is not found
                }

                createUser.sex = Boolean(createUser.sex); // This will convert "1" to 1 and "0" to 0

                console.log(JSON.stringify(createUser))
                const userResponse = await userService.saveUser(createUser);

                if (userResponse.status === 201) {
                    window.alert("User created successfully!");
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
    const updateUser = async (e, userId, isActive) => {
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
                // Refresh the list after update
                const updatedUsers = await userService.getAllUser();
                const hotelManagers = updatedUsers.data.filter(user => user.role?.roleName === "Hotel Manager");

                const sortedUserList = [...hotelManagers].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setUserList(sortedUserList);
            } else {
                window.alert("Cập Nhật Lỗi!");
            }
        } catch (error) {
            console.log(error);
            window.alert("Có lỗi xảy ra trong quá trình cập nhật.");
        }
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
                    <div className="ibox ">
                        <div className="ibox-head bg-dark text-light">
                            <div className="ibox-title ">Danh Sách Chủ Khách Sạn</div>
                            <div className="form-group d-flex align-items-center">
                                <div className="search-bar">
                                    <i className="fa fa-search search-icon" aria-hidden="true"></i>
                                    <input
                                        id="demo-foo-search"
                                        type="text"
                                        placeholder="Tìm kiếm"
                                        className="form-control form-control-sm"
                                        autoComplete="on"
                                        value={userSearchTerm}
                                        onChange={handleUserSearch}
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table table-borderless table-hover table-wrap table-centered">
                                    <thead>
                                        <tr>
                                            <th><span>STT</span></th>
                                            <th><span>Mã số</span></th>
                                            <th><span>Họ và tên</span></th>
                                            <th><span>Email</span></th>
                                            <th><span>Chức vụ</span></th>
                                            <th><span>Trạng thái</span></th>
                                            <th><span>Hành động</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentUsers.length > 0 && currentUsers.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.code}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.email}</td>
                                                        {
                                                            item.role?.roleName === "Admin" && (
                                                                <>
                                                                    <td>Admin</td>
                                                                </>
                                                            )
                                                        }
                                                        {
                                                            item.role?.roleName === "Hotel Manager" && (
                                                                <>
                                                                    <td>Chủ Khách Sạn</td>
                                                                </>
                                                            )
                                                        }
                                                        {
                                                            item.role?.roleName === "Manager" && (
                                                                <>
                                                                    <td>Quản Lý</td>
                                                                </>
                                                            )
                                                        }
                                                        {
                                                            item.role?.roleName === "Receptionist" && (
                                                                <>
                                                                    <td>Lễ Tân</td>
                                                                </>
                                                            )
                                                        }
                                                        {
                                                            item.role?.roleName === "Room Attendant" && (
                                                                <>
                                                                    <td>Nhân Viên Dọn Phòng</td>
                                                                </>
                                                            )
                                                        }
                                                        <td>
                                                            {item.isActive ? (
                                                                <span className="badge label-table badge-success">Đang hoạt động</span>
                                                            ) : (
                                                                <span className="badge label-table badge-danger">Chưa kích hoạt</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit"><i className="fa fa-pencil font-14 text-primary" onClick={() => openUserModal(item.userId)} /></button>
                                                            <form
                                                                id="demo-form"
                                                                onSubmit={(e) => updateUser(e, item.userId, user.isActive)} // Use isActive from the local state
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


            {showModalUser && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Thông Tin Tài Khoản</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalUser}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', }}>
                                <div className="row">
                                    <div className="col-md-4 d-flex align-items-center flex-column">
                                        <img src={user.image} alt="avatar" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} className="mt-3" />
                                    </div>
                                    <div className="col-md-8">
                                        <table className="table table-borderless table-hover table-centered mt-3" style={{ width: '100%' }}>
                                            <tbody>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Họ và tên:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{user.name}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Email:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{user.email}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Số điện thoại:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{user && user.phoneNumber ? user.phoneNumber : 'Không tìm thấy Số Điện Thoại'}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Địa chỉ:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{user && user.address ? user.address : 'Không tìm thấy Địa Chỉ'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>


                                    <div className="col-md-12" style={{ textAlign: 'left' }}>
                                        <h4 style={{ fontWeight: 'bold' }}>Danh Sách Khách Sạn</h4>
                                        <div className="ibox-body">
                                            <div className="table-responsive">
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
                                                            <th><span>Hành động</span></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            hotelList.length > 0 && hotelList.map((item, index) => (
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
                                                                            <a className="btn btn-default btn-xs m-r-5 text-white" data-toggle="tooltip" data-original-title="Edit"
                                                                                onClick={() => goToEditHotel(item.hotelId)}><i className="fa fa-pencil font-14 text-primary" /></a>
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
                                </div>


                            </div>
                            <div className="modal-footer">
                                {/* <button type="button" className="btn btn-custom">Save</button> */}
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalUser} >Đóng</button>
                            </div>
                        </div>
                    </div >
                </div >
            )}

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
                                        <h5 className="modal-title">Create a Hotel Manager</h5>

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
                                                <label htmlFor="hotelName">First Name * :</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="firstName"
                                                    id="firstName"
                                                    value={createUser.firstName}
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group  col-md-6">
                                                <label htmlFor="hotelName">Last Name * :</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="lastName"
                                                    id="lastName"
                                                    value={createUser.lastName}
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                />
                                            </div>
                                        </div>


                                        <div className="form-row">
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
                                                <label htmlFor="ownerId">Gender * :</label>
                                                <select
                                                    className="form-control"
                                                    id="sex"
                                                    name="sex"
                                                    value={createUser.sex}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value={1}>
                                                        Male
                                                    </option>
                                                    <option value={0}>
                                                        Female
                                                    </option>
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
                                                        value={createUser.address}
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
                            <div className="modal-header ">
                                <h5 className="modal-title">Thông Tin Khách Sạn</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalHotel}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                <div className="row">
                                    <div className="col-md-5">
                                        <img src={hotel.image} alt="avatar" style={{ width: '100%' }} />
                                    </div>

                                    <div className="col-md-7">
                                        <table className="table table-responsive table-hover mt-3" style={{ fontSize: '20px' }}>
                                            <tbody>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Name:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{hotel.hotelName}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Email:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{hotel.email}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Phone Number:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.phone ? hotel.phone : 'Unknown Phone Number'}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>District:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.district?.districtName ? hotel.district?.districtName : 'Unknown District'}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>City:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.district?.city?.cityName ? hotel.district?.city?.cityName : 'Unknown City'}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Address:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.address ? hotel.address : 'Unknown Address'}</td>
                                                </tr>

                                            </tbody>
                                        </table>

                                    </div>
                                </div>


                            </div>
                            <div className="modal-footer">
                                <Link type="button" className="btn btn-custom" to={`/edit-hotel/${hotel.hotelId}`}>View Detail</Link>
                                <button type="button" className="btn btn-dark" onClick={closeModalHotel} >Close</button>
                            </div>
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
}


                                            `}
            </style>

        </>
    )
}

export default ListHotelManager