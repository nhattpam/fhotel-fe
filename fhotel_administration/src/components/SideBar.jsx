import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import userService from '../services/user.service';
import typeService from '../services/type.service';
import cityService from '../services/city.service';
import typePricingService from '../services/type-pricing.service';
import serviceTypeService from '../services/service-type.service';

const SideBar = () => {

    //get user information
    const userId = sessionStorage.getItem('userId');
    const [user, setUser] = useState({
        email: "",
        name: "",
        image: ""
    });

    useEffect(() => {
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
    }, [userId]);


    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Track the state of the User submenu

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen); // Toggle the state between true/false
    };

    const [isPolicyMenuOpen, setIsUPolicyMenuOpen] = useState(false); // Track the state of the User submenu

    const togglePolicyMenu = () => {
        setIsUPolicyMenuOpen(!isPolicyMenuOpen); // Toggle the state between true/false
    };

    const [isPricingMenuOpen, setIsPricingMenuOpen] = useState(false); // Track the state of the User submenu

    const togglePricingMenu = () => {
        setIsPricingMenuOpen(!isPricingMenuOpen); // Toggle the state between true/false
    };

    const [typeList, setTypeList] = useState([]);

    useEffect(() => {
        typeService
            .getAllType()
            .then((res) => {
                setTypeList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    //create type pricing modal
    const [typePricingList, setTypePricingList] = useState([]);

    const [createTypePricing, setCreateTypePricing] = useState({
        districtId: '',
        price_1: '',  // Monday
        price_2: '',  // Tuesday
        price_3: '',  // Wednesday
        price_4: '',  // Thursday
        price_5: '',  // Friday
        price_6: '',  // Saturday
        price_7: '',  // Sunday
    });

    const [showModalCreateTypePricing, setShowModalCreateTypePricing] = useState(false);

    const openCreateTypePricingModal = () => {
        setShowModalCreateTypePricing(true);

    };

    const closeModalCreateTypePricing = () => {
        setShowModalCreateTypePricing(false);
    };


    const [error, setError] = useState({}); // State to hold error messages
    const [showError, setShowError] = useState(false); // State to manage error visibility
    const [showSuccess, setShowSuccess] = useState(false);
    const [success, setSuccess] = useState({});

    const handleChange = (e) => {
        const value = e.target.value;

        setCreateTypePricing({ ...createTypePricing, [e.target.name]: value });
    };


    const [cityList, setCityList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [selectedCity, setSelectedCity] = useState(''); // Add state for selected city

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

    const handleDayPriceChange = (e, dayOfWeek) => {
        const value = e.target.value;
        setCreateTypePricing(prevState => ({
            ...prevState,
            [`price_${dayOfWeek}`]: value
        }));
    };


    const [isSubmitting, setIsSubmitting] = useState(false);
    const validateForm = () => {
        let isValid = true;
        const newError = {};

        // Validate District
        if (!createTypePricing.districtId || createTypePricing.districtId.trim() === "") {
            newError.districtId = "District is required";
            isValid = false;
        }

        // Validate at least one price is filled out for any day of the week
        let priceFilled = false;
        for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
            if (createTypePricing[`price_${dayOfWeek}`] && createTypePricing[`price_${dayOfWeek}`].trim() !== "") {
                priceFilled = true;
            }
        }
        if (!priceFilled) {
            newError.price = "At least one price for a day of the week is required";
            isValid = false;
        }

        setError(newError); // Set the validation errors
        setShowError(Object.keys(newError).length > 0); // Toggle error visibility based on errors
        return isValid;
    };

    const submitCreateTypePricing = async (e) => {
        e.preventDefault();

        // Run validation before submitting
        if (!validateForm()) {
            return; // Stop the function if validation fails
        }

        setIsSubmitting(true); // Disable the button to prevent multiple submissions

        try {
            for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
                if (createTypePricing[`price_${dayOfWeek}`]) {
                    const pricingData = {
                        districtId: createTypePricing.districtId,
                        price: Number(createTypePricing[`price_${dayOfWeek}`]), // Convert to number
                        dayOfWeek: dayOfWeek,
                        typeId: createTypePricing.typeId // Ensure typeId is defined earlier
                    };

                    // Call API to save the pricing
                    const typePricingResponse = await typePricingService.saveTypePricing(pricingData);

                    if (typePricingResponse.status !== 201) {
                        throw new Error("Failed to create price for day: " + dayOfWeek);
                    }

                    typeService
                        .getAllTypePricingByTypeId(createTypePricing.typeId)
                        .then((res) => {
                            // Sorting by districtId and then dayOfWeek
                            const sortedData = res.data.sort((a, b) => {
                                // First, sort by districtId
                                const districtComparison = a.districtId.localeCompare(b.districtId);
                                if (districtComparison !== 0) {
                                    return districtComparison;
                                }
                                // If districtId is the same, sort by dayOfWeek
                                return a.dayOfWeek - b.dayOfWeek;
                            });
                            setTypePricingList(sortedData);
                        })
                        .catch((error) => {
                            handleResponseError(error.response);
                        });
                    // Clear the state for the submitted day to prevent duplicate submission
                    setCreateTypePricing(prevState => ({
                        ...prevState,
                        [`price_${dayOfWeek}`]: "" // Clear the price after submission
                    }));
                }
            }
        } catch (error) {
            handleResponseError(error.response);
            // You can show a user-friendly message here
        } finally {
            setIsSubmitting(false); // Re-enable the button after the process is done
        }
    };

    //CREATE SERVICE TYPE
    const [showModalCreateServiceType, setShowModalCreateServiceType] = useState(false);
    const [serviceTypeList, setServiceTypeList] = useState([]);

    const openCreateServiceTypeModal = () => {
        setShowModalCreateServiceType(true);
        serviceTypeService
            .getAllServiceType()
            .then((res) => {
                setServiceTypeList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });

    };

    const closeModalCreateServiceType = () => {
        setShowModalCreateServiceType(false);
    };

    const [createServiceType, setCreateServiceType] = useState({
        serviceTypeName: ""
    });

    const handleChangeServiceType = (e) => {
        const { name, value } = e.target;
        setCreateServiceType(prevState => ({ ...prevState, [name]: value }));
    };

    const submitCreateServiceType = async (e) => {
        e.preventDefault();

        console.log(JSON.stringify(createServiceType))

        try {
            const serviceTypeResponse = await serviceTypeService.saveServiceType(createServiceType);
            if (serviceTypeResponse.status === 201) {
                serviceTypeService
                    .getAllServiceType()
                    .then((res) => {
                        setServiceTypeList(res.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                handleResponseError(error.response);
            }

        }
        catch (error) {
            handleResponseError(error.response);
        }
    };

    const handleDeleteServiceType = async (serviceTypeId) => {
        try {
            // Call the API to delete the image by roomImageId
            const serviceTypeResponse = await serviceTypeService.deleteServiceTypeById(serviceTypeId);
            if (serviceTypeResponse.status === 201) {
                setServiceTypeList(prevList => prevList.filter(item => item.serviceTypeId !== serviceTypeId));
            }
            // After successful deletion, remove the image from the imageList
        } catch (error) {
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



    // Effect to handle error message visibility
    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => {
                setShowError(false); // Hide the error after 2 seconds
            }, 2000); // Change this value to adjust the duration
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [showError]); // Only run effect if showError changes

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


    return (
        <>
            {/* START SIDEBAR*/}
            <nav className="page-sidebar" id="sidebar" style={{ textAlign: 'left', display: 'block' }}>
                <div id="sidebar-collapse">
                    <div className="admin-block d-flex">
                        <div>
                            <img src={user.image} width="45px" height="45px" />
                        </div>
                        <div className="admin-info">
                            <div className="font-strong">{user.name}</div><small>
                                {
                                    user.role?.roleName === "Admin" && (
                                        "Admin"
                                    )
                                }
                                {
                                    user.role?.roleName === "Manager" && (
                                        "Quản Lý Hệ Thống"
                                    )
                                }
                                {
                                    user.role?.roleName === "Hotel Manager" && (
                                        "Chủ Khách Sạn"
                                    )
                                }
                                {
                                    user.role?.roleName === "Receptionist" && (
                                        "Lễ Tân"
                                    )
                                }
                                {
                                    user.role?.roleName === "Room Attendant" && (
                                        "NV Dọn Phòng"
                                    )
                                }



                            </small></div>
                    </div>
                    <ul className="side-menu metismenu">
                        {
                            user.role?.roleName === "Admin" && (
                                <li>
                                    <Link className="active" to={`/admin-home`}><i className="sidebar-item-icon fa fa-th-large" />
                                        <span className="nav-label">Báo Cáo/Thống Kê</span>
                                    </Link>
                                </li>
                            )
                        }
                        {
                            user.role?.roleName === "Manager" && (
                                <li>
                                    <Link className="active" to={`/manager-home`}><i className="sidebar-item-icon fa fa-th-large" />
                                        <span className="nav-label">Báo Cáo/Thống Kê</span>
                                    </Link>
                                </li>
                            )
                        }
                        {
                            user.role?.roleName === "Hotel Manager" && (
                                <li>
                                    <Link className="active" to={`/hotel-manager-home`}><i className="sidebar-item-icon fa fa-th-large" />
                                        <span className="nav-label">Báo Cáo/Thống Kê</span>
                                    </Link>
                                </li>
                            )
                        }
                        {
                            user.role?.roleName === "Receptionist" && (
                                <li>
                                    <Link className="active" to={`/receptionist-home`}><i className="sidebar-item-icon fa fa-th-large" />
                                        <span className="nav-label">Báo Cáo/Thống Kê</span>
                                    </Link>
                                </li>
                            )
                        }
                        {
                            user.role?.roleName === "Room Attendant" && (
                                <li>
                                    <Link className="active" to={`/room-attendant-home`}><i className="sidebar-item-icon fa fa-th-large" />
                                        <span className="nav-label">Báo Cáo/Thống Kê</span>
                                    </Link>
                                </li>
                            )
                        }

                        <li className="heading">Quản Lý</li>
                        {
                            user.role?.roleName === "Admin" && (
                                <>

                                    <li>
                                        <a href="javascript:;" onClick={toggleUserMenu}>
                                            <i className="sidebar-item-icon fa fa-user" />
                                            <span className="nav-label">Tài Khoản</span>
                                            <i className={`fa fa-angle-left arrow ${isUserMenuOpen ? '' : 'collapsed'}`} />
                                        </a>
                                        {/* Conditionally apply collapse class based on the state */}
                                        <ul className={`nav-2-level collapse ${isUserMenuOpen ? 'show' : ''}`}>
                                            <li>
                                                <Link to="/list-hotel-manager">Chủ Khách Sạn</Link>
                                            </li>
                                            <li>
                                                <Link to="/list-customer">Khách Hàng</Link>
                                            </li>
                                            <li>
                                                <Link to="/list-manager">Quản Lý</Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <Link to="/list-hotel"><i className="sidebar-item-icon fa fa-building" />
                                            <span className="nav-label">Khách Sạn</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/list-reservation"><i className="sidebar-item-icon fa fa-ship" />
                                            <span className="nav-label">Đặt Phòng</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="javascript:;" onClick={togglePolicyMenu}>
                                            <i className="sidebar-item-icon fa fa-coffee" />
                                            <span className="nav-label">Dịch vụ</span>
                                            <i className={`fa fa-angle-left arrow ${isPolicyMenuOpen ? '' : 'collapsed'}`} />
                                        </a>
                                        {/* Conditionally apply collapse class based on the state */}
                                        <ul className={`nav-2-level collapse ${isPolicyMenuOpen ? 'show' : ''}`}>
                                            <li>
                                                <Link to="/list-service">Dịch Vụ</Link>
                                            </li>
                                            <li>
                                                <Link onClick={openCreateServiceTypeModal}>Thêm Loại Dịch Vụ</Link>
                                            </li>
                                        </ul>
                                    </li>

                                    <li>
                                        <a href="javascript:;" onClick={togglePricingMenu}>
                                            <i className="sidebar-item-icon fa fa-usd" />
                                            <span className="nav-label">Bảng Giá</span>
                                            <i className={`fa fa-angle-left arrow ${isPricingMenuOpen ? '' : 'collapsed'}`} />
                                        </a>
                                        {/* Conditionally apply collapse class based on the state */}
                                        <ul className={`nav-2-level collapse ${isPricingMenuOpen ? 'show' : ''}`}>
                                            {
                                                typeList.length > 0 && typeList.map((item, index) => (
                                                    <li>
                                                        <a href={`/list-type-pricing/${item.typeId}`}>{item.typeName}</a>
                                                    </li>
                                                ))
                                            }
                                            {
                                                typeList.length === 0 && (
                                                    <li>
                                                        <a className='text-white'
                                                            onClick={openCreateTypePricingModal} // This will trigger the modal for creating a new hotel
                                                        >
                                                            Tạo Bảng Giá
                                                        </a>
                                                    </li>
                                                )
                                            }
                                        </ul>
                                    </li>

                                </>
                            )
                        }
                        {
                            user.role?.roleName === "Hotel Manager" && (
                                <>

                                    <li>
                                        <a href="javascript:;" onClick={toggleUserMenu}>
                                            <i className="sidebar-item-icon fa fa-user" />
                                            <span className="nav-label">Tài Khoản</span>
                                            <i className={`fa fa-angle-left arrow ${isUserMenuOpen ? '' : 'collapsed'}`} />
                                        </a>
                                        {/* Conditionally apply collapse class based on the state */}
                                        <ul className={`nav-2-level collapse ${isUserMenuOpen ? 'show' : ''}`}>
                                            <li>
                                                <Link to="/list-receptionist">Lễ Tân</Link>
                                            </li>
                                            <li>
                                                <Link to="/list-room-attendant">Dọn Phòng</Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <Link to="/list-reservation"><i className="sidebar-item-icon fa fa-ship" />
                                            <span className="nav-label">Đặt Phòng</span>
                                        </Link>
                                    </li>
                                    
                                    <li>
                                        <Link to="/list-owner-hotel"><i className="sidebar-item-icon fa fa-building" />
                                            <span className="nav-label">Khách Sạn</span>
                                        </Link>
                                    </li>
                                     {/* Room Management Section */}
                                     {/* <li>
                                        <Link to="/room-management"><i className="sidebar-item-icon fa fa-bed" />
                                            <span className="nav-label">Quản Lý Phòng</span>
                                        </Link>
                                    </li> */}

                                    {/* Billing Section */}
                                    <li>
                                        <Link to="/billing"><i className="sidebar-item-icon fa fa-money" />
                                            <span className="nav-label">Hóa Đơn</span>
                                        </Link>
                                    </li>

                                </>
                            )
                        }
                        {
                            user.role?.roleName === "Manager" && (
                                <>
                                    <li>
                                        <Link to="/list-hotel-verification"><i className="sidebar-item-icon fa fa-map" />
                                            <span className="nav-label">Yêu Cầu Xác Minh</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/list-reservation"><i className="sidebar-item-icon fa fa-ship" />
                                            <span className="nav-label">Đặt Phòng</span>
                                        </Link>
                                    </li>
                                    
                                    <li>
                                        <Link to="/list-service"><i className="sidebar-item-icon fa fa-coffee" />
                                            <span className="nav-label">Dịch vụ</span>
                                        </Link>
                                    </li>
                                    {/* Billing Section */}
                                    <li>
                                        <Link to="/billing"><i className="sidebar-item-icon fa fa-money" />
                                            <span className="nav-label">Hóa Đơn</span>
                                        </Link>
                                    </li>

                                </>
                            )
                        }
                        {
                            user.role?.roleName === "Receptionist" && (
                                <>
                                    {/* Reservation Section */}
                                    <li>
                                        <Link to="/list-staff-reservation"><i className="sidebar-item-icon fa fa-ship" />
                                            <span className="nav-label">Đặt Phòng</span>
                                        </Link>
                                    </li>

                                    {/* Check-In / Check-Out Section */}
                                    <li>
                                        <Link to="/check-in-out"><i className="sidebar-item-icon fa fa-sign-in" />
                                            <span className="nav-label">Nhận Phòng / Trả Phòng</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/list-order"><i className="sidebar-item-icon fa fa-shopping-basket" />
                                            <span className="nav-label">Đặt Dịch Vụ</span>
                                        </Link>
                                    </li>

                                    {/* Room Management Section */}
                                    <li>
                                        <Link to="/room-management"><i className="sidebar-item-icon fa fa-bed" />
                                            <span className="nav-label">Quản Lý Phòng</span>
                                        </Link>
                                    </li>

                                    {/* Customer Management Section */}
                                    <li>
                                        <Link to="/customer-management"><i className="sidebar-item-icon fa fa-user" />
                                            <span className="nav-label">Quản Lý Khách Hàng</span>
                                        </Link>
                                    </li>

                                    {/* Billing / Payment Management Section */}
                                    <li>
                                        <Link to="/billing"><i className="sidebar-item-icon fa fa-credit-card" />
                                            <span className="nav-label">Hóa Đơn / Thanh Toán</span>
                                        </Link>
                                    </li>
                                   


                                </>
                            )
                        }
                        {
                            user.role?.roleName === "Room Attendant" && (
                                <>
                                    <li>
                                        <Link to="/room-status"><i className="sidebar-item-icon fa fa-bed" />
                                            <span className="nav-label">Quản Lý Phòng</span>
                                        </Link>
                                    </li>

                                </>
                            )
                        }

                    </ul>
                </div>
            </nav>
            {/* END SIDEBAR*/}
            {
                showModalCreateTypePricing && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">

                            <div className="modal-content">
                                <form
                                    method="post"
                                    id="myAwesomeDropzone"
                                    data-plugin="dropzone"
                                    data-previews-container="#file-previews"
                                    data-upload-preview-template="#uploadPreviewTemplate"
                                    data-parsley-validate
                                    onSubmit={(e) => submitCreateTypePricing(e)}
                                    style={{ textAlign: "left" }}
                                >
                                    <div className="modal-header bg-dark text-light">
                                        <h5 className="modal-title">Tạo Bảng Giá Cho Tuần</h5>
                                        <button
                                            type="button"
                                            className="close text-light"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                            onClick={closeModalCreateTypePricing}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                        {showError && Object.entries(error).length > 0 && (
                                            <div className="error-messages" style={{ position: 'absolute', top: '10px', right: '10px', background: 'red', color: 'white', padding: '10px', borderRadius: '5px' }}>
                                                {Object.entries(error).map(([key, message]) => (
                                                    <p key={key} style={{ margin: '0' }}>{message}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                        {/* Form Fields */}
                                        <h4 className="header-title ">Thông Tin</h4>

                                        <div className="form-row">
                                            <div className="form-group  col-md-6">
                                                <label>Thành Phố</label>
                                                <select
                                                    name="cityId"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        handleChange(e);
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

                                            <div className="form-group col-md-6">
                                                <label>Quận</label>
                                                <select
                                                    name="districtId"
                                                    className="form-control"
                                                    value={createTypePricing.districtId}
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
                                                <label>Loại Phòng</label>
                                                <select
                                                    name="typeId"
                                                    className="form-control"
                                                    value={createTypePricing.typeId}
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                >
                                                    <option value="">Chọn Loại</option>
                                                    {typeList.map((type) => (
                                                        <option key={type.typeId} value={type.typeId}>
                                                            {type.typeName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Price inputs for each day */}
                                        <h4 className="header-title">Giá Cho Các Ngày</h4>
                                        {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map((day, index) => (
                                            <div className="form-group col-md-12" key={index}>
                                                <label htmlFor={`price_${index}`}>{day}  * :</label>
                                                <div className="input-group">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name={`price_${index + 1}`} // DayOfWeek values: 1 for Monday, 7 for Sunday
                                                        id={`price_${index}`}
                                                        value={createTypePricing[`price_${index + 1}`] || ""}
                                                        onChange={(e) => handleDayPriceChange(e, index + 1)}
                                                        min={0}
                                                        required
                                                    />
                                                    <div className="input-group-append">
                                                        <span className="input-group-text custom-append">VND</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="submit"
                                            className="btn btn-custom btn-sm"
                                            disabled={isSubmitting}  // Disable button when submitting
                                        >
                                            Lưu
                                        </button>
                                        <button type="button" className="btn btn-dark btn-sm" onClick={closeModalCreateTypePricing}>Đóng</button>
                                    </div>
                                </form>


                            </div>
                        </div>
                    </div >

                )
            }

            {
                showModalCreateServiceType && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-dialog-scrollable modal-xl" role="document">

                            <div className="modal-content">
                                <form
                                    method="post"
                                    id="myAwesomeDropzone"
                                    data-plugin="dropzone"
                                    data-previews-container="#file-previews"
                                    data-upload-preview-template="#uploadPreviewTemplate"
                                    data-parsley-validate
                                    onSubmit={(e) => submitCreateServiceType(e)}
                                    style={{ textAlign: "left" }}
                                >
                                    <div className="modal-header bg-dark text-light">
                                        <h5 className="modal-title">Tạo Loại Dịch Vụ</h5>
                                        <button
                                            type="button"
                                            className="close text-light"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                            onClick={closeModalCreateServiceType}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                        {showError && Object.entries(error).length > 0 && (
                                            <div className="error-messages" style={{ position: 'absolute', top: '10px', right: '10px', background: 'red', color: 'white', padding: '10px', borderRadius: '5px' }}>
                                                {Object.entries(error).map(([key, message]) => (
                                                    <p key={key} style={{ margin: '0' }}>{message}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                        {/* Form Fields */}
                                        <h4 className="header-title ">Thông Tin</h4>

                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label>Tên Loại</label>
                                                <input
                                                    type="text"
                                                    name="serviceTypeName"
                                                    className="form-control"
                                                    value={createServiceType.serviceTypeName}
                                                    onChange={(e) => handleChangeServiceType(e)}
                                                    required
                                                />
                                            </div>
                                            <div className='form-group col-md-12'>
                                                <label htmlFor="serviceTypes" className="form-label">Danh Sách Loại Dịch Vụ</label>
                                                {serviceTypeList.length > 0 ? (
                                                    serviceTypeList.map((item, index) => (
                                                        <div key={item.serviceTypeId} style={{ position: 'relative', textAlign: 'center', flex: '0 1 auto', margin: '5px' }}>
                                                            <span className="badge label-table badge-danger">{item.serviceTypeName}</span>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger"
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '0', // Adjust to position the button as needed
                                                                    right: '0', // Adjust to position the button as needed
                                                                    background: 'transparent',
                                                                    border: 'none',
                                                                    color: 'red',
                                                                    fontSize: '20px',
                                                                    cursor: 'pointer',
                                                                }}
                                                                onClick={() => handleDeleteServiceType(item.serviceTypeId)}
                                                                aria-label={`Delete service type ${item.serviceTypeName}`} // Accessibility improvement
                                                            >
                                                                &times; {/* This represents the delete icon (X symbol) */}
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-muted">Chưa có loại dịch vụ nào.</p> // Message when the list is empty
                                                )}
                                            </div>

                                        </div>


                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="submit"
                                            className="btn btn-custom btn-sm"
                                            disabled={isSubmitting}  // Disable button when submitting
                                        >
                                            Lưu
                                        </button>
                                        <button type="button" className="btn btn-dark btn-sm" onClick={closeModalCreateServiceType}>Đóng</button>
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
    max-width:30%;
    width: 30%;
}
    .btn-custom{
    background-color: #3498db;
    color: white
    }

    .custom-append {
    display: inline-block;
    width: 80px; /* Adjust this value based on your design needs */
    height: 100%; /* Makes it match the height of the input field */
    text-align: center;
    vertical-align: middle;
    background-color: #e9ecef; /* Optional: Matches input's background */
    border: 1px solid #ced4da; /* Matches the input's border style */
    border-left: 0; /* Removes the border between the input and append */
    line-height: calc(2.25rem); /* Matches the default height of Bootstrap input */
}
                                            `}
            </style>

        </>
    )
}

export default SideBar