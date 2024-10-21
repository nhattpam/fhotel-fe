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

const ListTypePricing = () => {

    const [typePricingList, setTypePricingList] = useState([]);
    const [typePricingSearchTerm, setTypePricingSearchTerm] = useState('');
    const [currentTypePricingPage, setCurrentTypePricingPage] = useState(0);
    const [typePricingsPerPage] = useState(20);
    const daysOfWeek = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


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
            })
            .catch((error) => {
                console.log(error);
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





    const handleTypePricingSearch = (event) => {
        setTypePricingSearchTerm(event.target.value);
    };

    const filteredTypePricings = typePricingList
        .filter((typePricing) => {
            return (
                typePricing.dayOfWeek.toString().toLowerCase().includes(typePricingSearchTerm.toLowerCase()) ||
                typePricing.price.toString().toLowerCase().includes(typePricingSearchTerm.toLowerCase()));
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

    //create user manager modal
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
                        typeId: typeId // Ensure typeId is defined earlier
                    };

                    // Call API to save the pricing
                    const typePricingResponse = await typePricingService.saveTypePricing(pricingData);

                    if (typePricingResponse.status !== 201) {
                        throw new Error("Failed to create price for day: " + dayOfWeek);
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
                            console.log(error);
                        });
                    // Clear the state for the submitted day to prevent duplicate submission
                    setCreateTypePricing(prevState => ({
                        ...prevState,
                        [`price_${dayOfWeek}`]: "" // Clear the price after submission
                    }));
                }
            }
        } catch (error) {
            console.error("Error submitting pricing data:", error.message);
            // You can show a user-friendly message here
        } finally {
            setIsSubmitting(false); // Re-enable the button after the process is done
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
                            <div className="ibox-title">List of Pricing for {type.typeName}</div>
                            <div className="form-group d-flex align-items-center">
                                <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm"
                                    autoComplete="on" value={typePricingSearchTerm}
                                    onChange={handleTypePricingSearch} />
                                <button
                                    className="btn btn-primary ml-3"
                                    onClick={openCreateTypePricingModal} // This will trigger the modal for creating a new hotel
                                >
                                    Create New Price
                                </button>
                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Type</th>
                                            <th>Day Of Week</th>
                                            <th>Price</th>
                                            <th>District</th>
                                            <th>Created Date</th>
                                            <th>Updated Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentTypePricings.length > 0 && currentTypePricings.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.type?.typeName}</td>
                                                        <td>{daysOfWeek[item.dayOfWeek]}</td>
                                                        <td>{item.price} Vnd</td>
                                                        <td>{item.district?.districtName}</td>
                                                        <td> {new Date(item.createdDate).toLocaleString('en-US')}</td>
                                                        <td> {item.updatedDate === null ? "None" : new Date(item.updatedDate).toLocaleString('en-US')}</td>

                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit">
                                                                <i className="fa fa-pencil font-14" onClick={() => openTypePricingModal(item.typePricingId)} /></button>
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
                            <form>

                                <div className="modal-header">
                                    <h5 className="modal-title">Refund Policy Information</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalTypePricing}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <table className="table table-responsive table-hover mt-3">
                                                <tbody>
                                                    <tr>
                                                        <th style={{ width: '30%' }}>Cancellation Time:</th>
                                                        <td>{typePricing.cancellationTime}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Refund Percentage:</th>
                                                        <td>{typePricing.refundPercentage} %</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Description:</th>
                                                        <td>{typePricing.description}</td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>


                                </div>
                                <div className="modal-footer">
                                    {/* <button type="button" className="btn btn-custom">Save</button> */}
                                    <button type="button" className="btn btn-dark" onClick={closeModalTypePricing} >Close</button>
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
                                    className="mt-3"
                                    id="myAwesomeDropzone"
                                    data-plugin="dropzone"
                                    data-previews-container="#file-previews"
                                    data-upload-preview-template="#uploadPreviewTemplate"
                                    data-parsley-validate
                                    onSubmit={(e) => submitCreateTypePricing(e)}
                                    style={{ textAlign: "left" }}
                                >
                                    <div className="modal-header">
                                        <h5 className="modal-title">Create Prices for the Week</h5>
                                        <button
                                            type="button"
                                            className="close"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                            onClick={closeModalCreateTypePricing}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>

                                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                        {/* Form Fields */}
                                        <h4 className="header-title ">Information</h4>

                                        <div className="form-row">
                                            <div className="form-group  col-md-6">
                                                <label>City</label>
                                                <select
                                                    name="cityId"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setSelectedCity(e.target.value); // Update selected city
                                                    }}
                                                    required
                                                >
                                                    <option value="">Select City</option>
                                                    {cityList.map((city) => (
                                                        <option key={city.cityId} value={city.cityId}>
                                                            {city.cityName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group col-md-6">
                                                <label>District</label>
                                                <select
                                                    name="districtId"
                                                    className="form-control"
                                                    value={createTypePricing.districtId}
                                                    onChange={(e) => handleChange(e)}
                                                    required
                                                >
                                                    <option value="">Select District</option>
                                                    {districtList.map((district) => (
                                                        <option key={district.districtId} value={district.districtId}>
                                                            {district.districtName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Price inputs for each day */}
                                        <h4 className="header-title">Prices for Each Day</h4>
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                                            <div className="form-group col-md-12" key={index}>
                                                <label htmlFor={`price_${index}`}>{day} Price * :</label>
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
                                            className="btn btn-custom"
                                            disabled={isSubmitting}  // Disable button when submitting
                                        >
                                            Save
                                        </button>
                                        <button type="button" className="btn btn-dark" onClick={closeModalCreateTypePricing}>Close</button>
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

export default ListTypePricing