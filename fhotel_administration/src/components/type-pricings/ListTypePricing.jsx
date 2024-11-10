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
                // Sorting by "From", "To", and then "dayOfWeek"
                const sortedData = res.data.sort((a, b) => {
                    // First, compare the "From" dates
                    const fromComparison = new Date(a.from) - new Date(b.from);
                    if (fromComparison !== 0) {
                        return fromComparison;
                    }

                    // If "From" dates are the same, compare the "To" dates
                    const toComparison = new Date(a.to) - new Date(b.to);
                    if (toComparison !== 0) {
                        return toComparison;
                    }

                    // If both "From" and "To" dates are the same, compare the "dayOfWeek"
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

    const handleChange = (e, index) => {
        const newTypePricings = [...typePricings];

        const { name, value } = e.target;
        newTypePricings[index][name] = value; // Handle other form fields

        setTypePricings(newTypePricings);
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

    const [selectYear, setSelectYear] = useState(new Date().getFullYear()); // Default to the current year
    const handleYearChange = (selectedYear) => {
        const quarterlyDates = [
            { from: `${selectedYear}-01-01`, to: `${selectedYear}-03-31` },
            { from: `${selectedYear}-04-01`, to: `${selectedYear}-06-30` },
            { from: `${selectedYear}-07-01`, to: `${selectedYear}-09-30` },
            { from: `${selectedYear}-10-01`, to: `${selectedYear}-12-31` }
        ];

        setTypePricings(quarterlyDates);
    };


    const [districtId, setDistrictId] = useState('');
    const [typePricings, setTypePricings] = useState([
        {
            percentageIncrease: '',
            basePrice: '',
            from: `01-01-${selectYear}`,
            to: `03-31-${selectYear}`,
        },
        {
            percentageIncrease: '',
            basePrice: '',
            from: `04-01-${selectYear}`,
            to: `06-30-${selectYear}`,
        },
        {
            percentageIncrease: '',
            basePrice: '',
            from: `07-01-${selectYear}`,
            to: `09-30-${selectYear}`,
        },
        {
            percentageIncrease: '',
            basePrice: '',
            from: `10-01-${selectYear}`,
            to: `12-31-${selectYear}`,
        },
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Updated form submission to use the new pricing setup
    const submitCreateTypePricing = async (e) => {
        e.preventDefault();

        // if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            for (const typePricing of typePricings) {
                // Function to calculate weekend price based on percentage increase
                const calculateWeekendPrice = () => {
                    const basePrice = Number(typePricing.basePrice) || 0;
                    const percentageIncrease = Number(typePricing.percentageIncrease) || 0;
                    return basePrice * (1 + percentageIncrease / 100);
                };
                for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
                    const isWeekend = dayOfWeek >= 6; // Saturday & Sunday
                    const price = isWeekend ? calculateWeekendPrice() : typePricing.basePrice;

                    const pricingData = {
                        price: price,
                        dayOfWeek: dayOfWeek,
                        typeId: typeId,
                        from: typePricing.from,
                        to: typePricing.to,
                        percentageIncrease: typePricing.percentageIncrease
                    };

                    // Add owner info to each hotel object
                    const typePricingWithDistrictInfo = {
                        ...pricingData,
                        districtId,
                    };

                    console.log(JSON.stringify(typePricingWithDistrictInfo))

                    // Call API to save the pricing
                    const typePricingResponse = await typePricingService.saveTypePricing(typePricingWithDistrictInfo);


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

                }
            }
        } catch (error) {
            handleResponseError(error.response);
        } finally {
            setIsSubmitting(false);
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
                                <div className="search-bar ml-3">
                                    <i className="fa fa-search search-icon" aria-hidden="true"></i>
                                    <input
                                        id="demo-foo-search"
                                        type="text"
                                        placeholder="Tìm kiếm"
                                        className="form-control form-control-sm"
                                        autoComplete="on"
                                        value={typePricingSearchTerm}
                                        onChange={handleTypePricingSearch}
                                    />
                                </div>

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
                                            <th><span>Thời gian áp dụng</span></th>
                                            <th><span>Ngày lễ</span></th>
                                            <th><span>Hành động</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentTypePricings.length > 0 && currentTypePricings.map((item, index) => {
                                                const today = new Date();
                                                const daysToAdd = (item.dayOfWeek - (today.getDay() === 0 ? 7 : today.getDay()) + 7) % 7;
                                                const actualDate = new Date(today);
                                                actualDate.setDate(today.getDate() + daysToAdd);
                                                const actualDateString = actualDate.toLocaleDateString().split('T')[0];

                                                const fromDate = new Date(item.from);
                                                const toDate = new Date(item.to);

                                                // Lọc các quy tắc giá ngày lễ trong khoảng thời gian từ - đến
                                                const holidayRules = holidayPricingRuleList.filter(h =>
                                                    h.districtId === item.district?.districtId &&
                                                    new Date(h.holiday?.holidayDate) >= fromDate &&
                                                    new Date(h.holiday?.holidayDate) <= toDate
                                                );

                                                // Lọc các ngày lễ trùng với ngày trong tuần của item (item.dayOfWeek)
                                                const relevantHolidays = holidayRules.filter(rule => {
                                                    const holidayDate = new Date(rule.holiday?.holidayDate);
                                                    return holidayDate.getDay() === item.dayOfWeek;
                                                });

                                                return (
                                                    <tr key={item.typePricingId}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.type?.typeName}</td>
                                                        <td>{daysOfWeek[item.dayOfWeek]}</td>
                                                        <td>{item.price.toLocaleString()} </td>
                                                        <td>{item.district?.districtName}</td>
                                                        <td>{item.district?.city?.cityName}</td>
                                                        <td>{fromDate.toLocaleDateString('en-US')} - {toDate.toLocaleDateString('en-US')}</td>
                                                        <td>
                                                            {
                                                                relevantHolidays.length > 0 ? (
                                                                    // Hiển thị ngày lễ chỉ khi có ngày lễ trùng với ngày trong tuần
                                                                    relevantHolidays.map((rule, ruleIndex) => {
                                                                        const holidayDate = new Date(rule.holiday?.holidayDate);
                                                                        return (
                                                                            <div key={ruleIndex}>
                                                                                {rule.holiday?.description}: ({holidayDate.toLocaleDateString('en-US')}) ({rule.percentageIncrease}%)
                                                                                <br />
                                                                            </div>
                                                                        );
                                                                    })
                                                                ) : (
                                                                    <span>Không</span>
                                                                )
                                                            }
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
                                <form onSubmit={(e) => submitCreateTypePricing(e)} style={{ textAlign: "left" }}>
                                    <div className="modal-header bg-dark text-light">
                                        <h5 className="modal-title">Tạo Bảng Giá Cho Các Quý</h5>
                                        <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalCreateTypePricing}>
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
                                        <h4 className="header-title">Thông Tin</h4>
                                        <div className="row">
                                            <div className="col-md-12">

                                                <div className="form-row">
                                                    {/* City Select */}
                                                    <div className="form-group col-md-6">
                                                        <label>Thành phố <span className="text-danger">*</span> :</label>
                                                        <select name="cityId" className="form-control" onChange={(e) => {
                                                            // handleChange(e);
                                                            setSelectedCity(e.target.value);
                                                        }} required>
                                                            <option value="">Chọn thành phố</option>
                                                            {cityList.map(city => (
                                                                <option key={city.cityId} value={city.cityId}>{city.cityName}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* District Select */}
                                                    <div className="form-group col-md-6">
                                                        <label>Quận <span className="text-danger">*</span> :</label>
                                                        <select className="form-control" onChange={(e) => setDistrictId(e.target.value)} required>
                                                            <option value="">Chọn quận</option>
                                                            {districtList.map(d => (
                                                                <option key={d.districtId} value={d.districtId}>{d.districtName}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                {/* Year Select */}
                                                <div className="form-group">
                                                    <label>Năm <span className="text-danger">*</span> :</label>
                                                    <select name="year" className="form-control" style={{ width: '30%' }} onChange={(e) => handleYearChange(e.target.value)} required>
                                                        <option value="">Chọn năm</option>
                                                        {[2023, 2024, 2025, 2026, 2027, 2028, 2030].map(year => (
                                                            <option key={year} value={year}>{year}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            {typePricings.map((typePricing, index) => (
                                                <>
                                                    <div className="col-md-4">
                                                        <div className="form-row">
                                                            {/* From Date - Read Only */}
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="fromDate">Từ ngày <span className="text-danger">*</span> :</label>
                                                                <input type="date" className="form-control" name="from" id="from" value={typePricing.from || ''} readOnly required />
                                                            </div>

                                                            {/* To Date - Read Only */}
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="toDate">Đến ngày <span className="text-danger">*</span> :</label>
                                                                <input type="date" className="form-control" name="to" id="to" value={typePricing.to || ''} readOnly required />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-8">
                                                        {/* Select fields for city and district */}
                                                        <div className="form-row">


                                                            {/* Single Base Price Input */}
                                                            {/* <h4 className="header-title">Giá Cơ Bản</h4> */}
                                                            <div className="form-group col-md-12">
                                                                <label htmlFor="basePrice">Giá cơ bản <span className="text-danger">*</span> :</label>
                                                                <div className="input-group">
                                                                    <input type="number" className="form-control" name="basePrice" id="basePrice" value={typePricing.basePrice || ''} onChange={(e) => handleChange(e, index)} min={0} required />
                                                                    <div className="input-group-append">
                                                                        <span className="input-group-text custom-append">VND</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Percentage Increase for Weekend */}
                                                            {/* <h4 className="header-title">Tăng Giá Cuối Tuần</h4> */}
                                                            <div className="form-group col-md-12">
                                                                <label htmlFor="percentageIncrease">Tăng giá cuối tuần (%) :</label>
                                                                <select name="percentageIncrease" className="form-control" id="percentageIncrease" value={typePricing.percentageIncrease} onChange={(e) => handleChange(e, index)}>
                                                                    <option value="">Chọn phần trăm</option>
                                                                    {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70].map(percent => (
                                                                        <option key={percent} value={percent}>{percent}%</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ))}

                                        </div>



                                    </div>

                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-custom btn-sm" disabled={isSubmitting}><i class="fa fa-floppy-o" aria-hidden="true"></i> Lưu</button>
                                        <button type="button" className="btn btn-dark btn-sm" onClick={closeModalCreateTypePricing}>Đóng</button>
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
    max-width:60%;
    width: 60%;
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

export default ListTypePricing