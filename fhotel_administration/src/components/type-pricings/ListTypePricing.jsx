import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import typePricingService from '../../services/type-pricing.service';
import { useParams } from 'react-router-dom';
import typeService from '../../services/type.service';
import cityService from '../../services/city.service';
import districtService from '../../services/district.service';
import holidayPricingService from '../../services/holiday-pricing.service';

const ListTypePricing = () => {

    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING

    const [typePricingList, setTypePricingList] = useState([]);
    const [typePricingSearchTerm, setTypePricingSearchTerm] = useState('');
    const [currentTypePricingPage, setCurrentTypePricingPage] = useState(0);
    const [typePricingsPerPage] = useState(10);
    const daysOfWeek = ["", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];


    const { typeId } = useParams();
    const [type, setType] = useState({

    });


    useEffect(() => {
        typeService
            .getAllTypePricingByTypeId(typeId)
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
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
        typeService
            .getTypeById(typeId)
            .then((res) => {
                setType(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [typeId]);



    const [selectedDistrictId, setSelectedDistrictId] = useState('');
    const uniqueDistricts = [...new Set(typePricingList.map((typePricing) => typePricing.district?.districtName))]
        .filter(Boolean);

    const handleTypePricingSearch = (event) => {
        setTypePricingSearchTerm(event.target.value);
    };

    const filteredTypePricings = typePricingList
        .filter((typePricing) => {
            const matchesDistrict = selectedDistrictId ? typePricing.district?.districtName === selectedDistrictId : true;
            const matchesSearchTerm = (
                typePricing.dayOfWeek.toString().toLowerCase().includes(typePricingSearchTerm.toLowerCase()) ||
                typePricing.price.toString().toLowerCase().includes(typePricingSearchTerm.toLowerCase())
            );
            return matchesDistrict && matchesSearchTerm;
        });


    const pageTypePricingCount = Math.ceil(filteredTypePricings.length / typePricingsPerPage);

    const handleTypePricingPageClick = (data) => {
        setCurrentTypePricingPage(data.selected);
    };

    const offsetTypePricing = currentTypePricingPage * typePricingsPerPage;
    const currentTypePricings = filteredTypePricings.slice(offsetTypePricing, offsetTypePricing + typePricingsPerPage);



    //detail typePricing modal 
    const [showModalTypePricing, setShowModalTypePricing] = useState(false);

    const [typePricing, setTypePricing] = useState({

    });


    const openTypePricingModal = (typePricingId) => {
        setShowModalTypePricing(true);
        console.log(typePricingId)
        if (typePricingId) {
            typePricingService
                .getTypePricingById(typePricingId)
                .then((res) => {
                    setTypePricing(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const closeModalTypePricing = () => {
        setShowModalTypePricing(false);
    };

    //create type pricing modal
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
    const [holidayPricingRuleList, setHolidayPricingRuleList] = useState([]);
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
        holidayPricingService
            .getAllHolidayPricingRule()
            .then((res) => {
                setHolidayPricingRuleList(res.data);
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
                        typeId: typeId // Ensure typeId is defined earlier
                    };

                    // Call API to save the pricing
                    const typePricingResponse = await typePricingService.saveTypePricing(pricingData);

                    if (typePricingResponse.status !== 201) {
                        handleResponseError(error.response);
                    }

                    typeService
                        .getAllTypePricingByTypeId(typeId)
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


    ///UPDATE TYPE PRICING
    const [updateTypePricing, setUpdateTypePricing] = useState({
        price: '' // Initialize the price field
    });

    const handleChangeUpdateTypePricing = (e) => {
        const { name, value } = e.target;
        setUpdateTypePricing(prevState => ({ ...prevState, [name]: value }));
    };

    const submitUpdateTypePricing = async (e, typePricingId) => {
        e.preventDefault();

        try {
            // Fetch the current type pricing data
            const res = await typePricingService.getTypePricingById(typePricingId);
            const typePricingData = res.data;

            // Make the update request
            const updateRes = await typePricingService.updateTypePricing(typePricingId, { ...typePricingData, price: updateTypePricing.price });

            if (updateRes.status === 200) {
                // Use a notification library for better user feedback
                setSuccess({ general: "Cập nhật thành công!" });
                setShowSuccess(true); // Show error
                typeService
                    .getAllTypePricingByTypeId(typeId)
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
                        console.log(error);
                    });
            } else {
                handleResponseError(updateRes);
            }
        } catch (error) {
            handleResponseError(error.response);
        }
    };


    //Display holiday




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

    const handleResponseError = (response) => {
        if (response && response.status === 400) {
            const validationErrors = response.data.errors || [];
            setError({ validation: validationErrors });
        } else {
            setError({ general: "An unexpected error occurred. Please try again." });
        }
        setShowError(true); // Show error modal or message
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
                            <div className="ibox-title">Bảng Giá Cho Loại Phòng {type.typeName}</div>
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
                                <input
                                    id="demo-foo-search"
                                    type="text"
                                    placeholder="Tìm kiếm"
                                    className="form-control form-control-sm ml-3"
                                    autoComplete="on"
                                    value={typePricingSearchTerm}
                                    onChange={handleTypePricingSearch}
                                />
                                <button
                                    className="btn btn-primary ml-3 btn-sm"
                                    onClick={openCreateTypePricingModal}
                                >
                                    Thêm giá
                                </button>
                            </div>
                        </div>

                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table table-borderless table-hover table-wrap table-centered">
                                    <thead>
                                        <tr>
                                            <th><span>STT</span></th>
                                            <th><span>Loại phòng</span></th>
                                            <th><span>Ngày trong tuần</span></th>
                                            <th><span>Giá (VND)</span></th>
                                            <th><span>Quận</span></th>
                                            <th><span>Thành phố</span></th>
                                            <th><span>Ngày thực tế</span></th> {/* New column for Actual Date */}
                                            <th><span>Ngày lễ</span></th>
                                            <th><span>Hành động</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentTypePricings.length > 0 && currentTypePricings.map((item, index) => {
                                                // Calculate the actual date for the specific day of the week
                                                const today = new Date();
                                                // Calculate the days to add to get the date for the target day of the week
                                                const daysToAdd = (item.dayOfWeek - (today.getDay() === 0 ? 7 : today.getDay()) + 7) % 7;
                                                const actualDate = new Date(today);
                                                actualDate.setDate(today.getDate() + daysToAdd);
                                                const actualDateString = actualDate.toLocaleDateString().split('T')[0]; // Format to "YYYY-MM-DD"

                                                // Check for applicable holiday pricing rules
                                                const holidayRules = holidayPricingRuleList.filter(h =>
                                                    h.districtId === item.district?.districtId &&
                                                    actualDateString === new Date(h.holidayDate).toLocaleDateString().split('T')[0] // Convert holidayDate to Date object
                                                );

                                                return (
                                                    <tr key={item.typePricingId}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.type?.typeName}</td>
                                                        <td>{daysOfWeek[item.dayOfWeek]}</td>
                                                        <td>{item.price.toLocaleString()} </td>
                                                        <td>{item.district?.districtName}</td>
                                                        <td>{item.district?.city?.cityName}</td>
                                                        <td>{actualDateString} {/* Displaying actual date */}</td> {/* Actual Date */}
                                                        <td>
                                                            {holidayRules.length > 0 ? (
                                                                holidayRules.map((rule, ruleIndex) => {
                                                                    const holidayDate = new Date(rule.holidayDate); // Convert to Date object
                                                                    const holidayDateString = holidayDate.toLocaleDateString().split('T')[0];
                                                                    return (
                                                                        <div key={ruleIndex}>
                                                                            {rule.description}: {rule.percentageIncrease}%
                                                                            <br />
                                                                            (Ngày: {holidayDateString}) {/* Displaying the holiday date */}
                                                                        </div>
                                                                    );
                                                                })
                                                            ) : (
                                                                <span>Không</span>
                                                            )}
                                                        </td>

                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit">
                                                                <i className="fa fa-pencil font-14" onClick={() => openTypePricingModal(item.typePricingId)} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
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
                                pageCount={pageTypePricingCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handleTypePricingPageClick}
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

            {showModalTypePricing && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <form onSubmit={(e) => submitUpdateTypePricing(e, typePricing.typePricingId, updateTypePricing.price)}>

                                <div className="modal-header bg-dark text-light">
                                    <h5 className="modal-title">Thông Tin Giá</h5>
                                    <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalTypePricing}>
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
                                        <div className="col-md-12">
                                            <table className="table table-responsive table-hover mt-3">
                                                <tbody>
                                                    <tr>
                                                        <th>Loại phòng:</th>
                                                        <td>{typePricing.type?.typeName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Quận</th>
                                                        <td>{typePricing.district?.districtName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Ngày trong tuần:</th>
                                                        <td>{daysOfWeek[typePricing.dayOfWeek]}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Giá hiện tại:</th>
                                                        <td>{typePricing.price} (VND)</td> {/* Display current price */}
                                                    </tr>
                                                    <tr>
                                                        <th>Giá mới:</th>
                                                        <td>
                                                            <input
                                                                name='price'
                                                                type="number"
                                                                value={updateTypePricing.price || ''}
                                                                onChange={(e) => handleChangeUpdateTypePricing(e)}
                                                                required
                                                            />
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <th>Ngày tạo:</th>
                                                        <td>{new Date(typePricing.createdDate).toLocaleString('en-US')}</td>

                                                    </tr>
                                                    <tr>
                                                        <th>Ngày chỉnh sửa gần nhất:</th>
                                                        <td>{typePricing.updatedDate === null ? "Không có" : new Date(typePricing.updatedDate).toLocaleString('en-US')}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary btn-sm">Lưu</button>
                                    <button type="button" className="btn btn-dark btn-sm" onClick={closeModalTypePricing}>Đóng</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}


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
                                        {/* Form Fields */}
                                        <h4 className="header-title ">Thông Tin</h4>

                                        <div className="form-row">
                                            <div className="form-group  col-md-6">
                                                <label>Thành phố</label>
                                                <select
                                                    name="cityId"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        handleChange(e);
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

                                            <div className="form-group col-md-6">
                                                <label>Quận</label>
                                                <select
                                                    name="districtId"
                                                    className="form-control"
                                                    value={createTypePricing.districtId}
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                >
                                                    <option value="">Chọn quận</option>
                                                    {districtList.map((district) => (
                                                        <option key={district.districtId} value={district.districtId}>
                                                            {district.districtName}
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

                                            `}
            </style>

        </>
    )
}

export default ListTypePricing