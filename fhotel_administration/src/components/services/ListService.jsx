import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import serviceService from '../../services/service.service';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';

import { Link } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import serviceTypeService from '../../services/service-type.service';

const ListService = () => {


    //call list service registration
    const [serviceList, setServiceList] = useState([]);
    const [serviceSearchTerm, setServiceSearchTerm] = useState('');
    const [currentServicePage, setCurrentHotelPage] = useState(0);
    const [servicesPerPage] = useState(5);


    useEffect(() => {
        serviceService
            .getAllService()
            .then((res) => {
                setServiceList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    const handleHotelSearch = (event) => {
        setServiceSearchTerm(event.target.value);
    };

    const filteredServices = serviceList
        .filter((service) => {
            return (
                service.serviceName.toString().toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
                service.price.toString().toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
                service.description.toString().toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
                service.serviceType?.serviceTypeName.toString().toLowerCase().includes(serviceSearchTerm.toLowerCase())
            );
        });

    const pageServiceCount = Math.ceil(filteredServices.length / servicesPerPage);

    const handleHotelPageClick = (data) => {
        setCurrentHotelPage(data.selected);
    };

    const offsetService = currentServicePage * servicesPerPage;
    const currentServices = filteredServices.slice(offsetService, offsetService + servicesPerPage);



    //detail service modal 
    const [showModalService, setShowModalHotel] = useState(false);

    const [service, setService] = useState({

    });


    const openServiceModal = (serviceId) => {
        setShowModalHotel(true);
        if (serviceId) {
            serviceService
                .getServiceById(serviceId)
                .then((res) => {
                    setService(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const closeModalService = () => {
        setShowModalHotel(false);
    };


    const [updateService, setUpdateService] = useState({

    });

    //update service status
    const submitUpdateService = async (e, serviceId, isActive) => {
        e.preventDefault();

        try {
            // Fetch the user data
            const res = await serviceService.getServiceById(serviceId);
            const serviceData = res.data;

            // Update the local state with the fetched data and new isActive flag
            setUpdateService({ ...serviceData, isActive });

            // Make the update request
            const updateRes = await serviceService.updateService(serviceId, { ...serviceData, isActive });

            if (updateRes.status === 200) {
                // window.alert("Update successful!");
                // Refresh the list after update
                const updatedServices = await serviceService.getAllService();
                setServiceList(updatedServices.data);  // Update the roomTypeList state with fresh data
            } else {
                window.alert("Update FAILED!");
            }
        } catch (error) {
            console.log(error);
            window.alert("An error occurred during the update.");
        }
    };



    //create service modal
    const [createService, setCreateService] = useState({
        serviceName: "",
        price: 0,
        image: "",
        description: "",
        serviceTypeId: "",
    });
    const [showModalCreateService, setShowModalCreateService] = useState(false);

    const openCreateServiceModal = () => {
        setShowModalCreateService(true);

    };

    const closeModalCreateService = () => {
        setShowModalCreateService(false);
    };


    const [error, setError] = useState({}); // State to hold error messages
    const [showError, setShowError] = useState(false); // State to manage error visibility

    const handleChange = (e) => {
        const value = e.target.value;

        setCreateService({ ...createService, [e.target.name]: value });
    };

    const validateForm = () => {
        let isValid = true;
        const newError = {}; // Create a new error object

        // Validate First Name
        if (createService.serviceName.trim() === "") {
            newError.serviceName = "Name is required";
            isValid = false;
        }

        // Validate Last Name
        if (createService.price.trim() === "") {
            newError.price = "Price is required";
            isValid = false;
        }

        // Validate Address
        // if (createService.image.trim() === "") {
        //     newError.image = "Image is required";
        //     isValid = false;
        // }

        if (createService.description.trim() === "") {
            newError.description = "Description is required";
            isValid = false;
        }

        if (createService.serviceTypeId.trim() === "") {
            newError.serviceTypeId = "Service Type is required";
            isValid = false;
        }



        setError(newError); // Set the new error object
        setShowError(Object.keys(newError).length > 0); // Show error if there are any
        return isValid;
    };

    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");


    const handleFileDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);

            // Set the image preview URL
            const previewUrl = URL.createObjectURL(acceptedFiles[0]);
            setImagePreview(previewUrl);
        }
    };

    const submitCreateService = async (e) => {
        e.preventDefault();
        setError({});
        setShowError(false);

        if (validateForm()) {
            try {
                let image = createService.image;

                if (file) {
                    const imageData = new FormData();
                    imageData.append('file', file);
                    const imageResponse = await serviceService.uploadImage(imageData);
                    image = imageResponse.data.link;
                    console.log("this is url: " + image);
                }

                const serviceData = {
                    ...createService,
                    image,
                    price: parseFloat(createService.price)
                };

                console.log(JSON.stringify(serviceData));  // Log payload

                const serviceResponse = await serviceService.saveService(serviceData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (serviceResponse.status === 201) {
                    window.alert("Service created successfully!");
                    // Refresh the roomTypeList after update
                    const updatedServices = await serviceService.getAllService();
                    setServiceList(updatedServices.data);  // Update the roomTypeList state with fresh data
                } else {
                    setError({ general: "Failed to create service." });
                    setShowError(true);
                }
            } catch (error) {
                console.log(error.response?.data || error.message);  // Log full error
                setError({ general: "An unexpected error occurred. Please try again." });
                setShowError(true);
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

    //list service types
    const [serviceTypeList, setServiceTypeList] = useState([]);
    useEffect(() => {
        serviceTypeService
            .getAllServiceType()
            .then((res) => {
                setServiceTypeList(res.data);

            })
            .catch((error) => {
                console.log(error);
            });
    }, []);



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
                            <div className="ibox-title">Danh Sách Dịch Vụ</div>
                            <div className="form-group d-flex align-items-center">
                                <input
                                    id="demo-foo-search"
                                    type="text"
                                    placeholder="Search"
                                    className="form-control form-control-sm"
                                    autoComplete="on"
                                    value={serviceSearchTerm}
                                    onChange={handleHotelSearch}
                                />
                                <button
                                    className="btn btn-primary ml-3 btn-sm"
                                    onClick={openCreateServiceModal} // This will trigger the modal for creating a new hotel
                                >
                                    Thêm Dịch Vụ
                                </button>
                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table table-borderless table-hover table-wrap table-centered">
                                    <thead>
                                        <tr>
                                            <th>STT.</th>
                                            <th>Hình Ảnh</th>
                                            <th>Tên</th>
                                            <th>Đơn Giá (VND)</th>
                                            <th>Mô Tả</th>
                                            <th>Loại Dịch Vụ</th>
                                            <th>Trạng Thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentServices.length > 0 && currentServices.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <img src={item.image} alt="avatar" style={{ width: "70px", height: '100px' }} />

                                                        </td>
                                                        <td>{item.serviceName}</td>
                                                        <td>{item.price}</td>
                                                        <td className='wordwrap'>{item.description}</td>
                                                        <td>{item.serviceType?.serviceTypeName}</td>
                                                        <td>
                                                            {item.isActive ? (
                                                                <span className="badge label-table badge-success">Đang Hoạt Động</span>
                                                            ) : (
                                                                <span className="badge label-table badge-danger">Chưa Kích Hoạt</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit"><i className="fa fa-pencil font-14" onClick={() => openServiceModal(item.serviceId)} /></button>
                                                            <form
                                                                id="demo-form"
                                                                onSubmit={(e) => submitUpdateService(e, item.serviceId, updateService.isActive)} // Use isActive from the local state
                                                                className="d-inline"
                                                            >
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-default btn-xs m-r-5"
                                                                    data-toggle="tooltip"
                                                                    data-original-title="Activate"
                                                                    onClick={() => setUpdateService({ ...updateService, isActive: true })} // Activate
                                                                >
                                                                    <i className="fa fa-check font-14 text-success" />
                                                                </button>
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-default btn-xs"
                                                                    data-toggle="tooltip"
                                                                    data-original-title="Deactivate"
                                                                    onClick={() => setUpdateService({ ...updateService, isActive: false })} // Deactivate
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
                                pageCount={pageServiceCount}
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
            {showModalService && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <form>

                                <div className="modal-header bg-dark text-light">
                                    <h5 className="modal-title">Thông Tin Dịch Vụ</h5>
                                    <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalService}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-5">
                                            <table className="table table-responsive table-hover mt-3">
                                                <tbody>
                                                    <img src={service.image} alt="avatar" style={{ width: '50%' }} />

                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="col-md-7">
                                            <table className="table table-responsive table-hover mt-3">
                                                <tbody>
                                                    <tr>
                                                        <th style={{ width: '30%' }}>Tên Dịch Vụ:</th>
                                                        <td>{service.serviceName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Đơn Giá:</th>
                                                        <td>{service.price} Vnd</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Mô Tả:</th>
                                                        <td>{service.description} </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Loại Dịch Vụ:</th>
                                                        <td>{service.serviceType?.serviceTypeName} </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>


                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-dark btn-sm" onClick={closeModalService} >Đóng</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )}

            {
                showModalCreateService && (
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
                                    onSubmit={(e) => submitCreateService(e)}
                                    style={{ textAlign: "left" }}
                                >
                                    <div className="modal-header bg-dark text-light">
                                        <h5 className="modal-title">Thêm Dịch Vụ</h5>

                                        <button
                                            type="button"
                                            className="close text-light"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                            onClick={closeModalCreateService}
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

                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <label htmlFor="imageUrl">Hình Ảnh * :</label>
                                                <Dropzone
                                                    onDrop={handleFileDrop}
                                                    accept="image/*" multiple={false}
                                                    maxSize={5000000} // Maximum file size (5MB)
                                                >
                                                    {({ getRootProps, getInputProps }) => (
                                                        <div {...getRootProps()} className="fallback">
                                                            <input {...getInputProps()} />
                                                            <div className="dz-message needsclick">
                                                                <i className="h1 text-muted dripicons-cloud-upload" />
                                                                <h3>Tải File.</h3>
                                                            </div>
                                                            {imagePreview && (
                                                                <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "10px" }} />
                                                            )}
                                                        </div>
                                                    )}
                                                </Dropzone>

                                                {/* Preview */}
                                                <div className="dropzone-previews mt-3" id="file-previews" />
                                            </div>
                                            <div className='col-md-8'>
                                                {/* Form Fields */}
                                                <h4 className="header-title ">Thông Tin Dịch Vụ</h4>
                                                <div className="form-row">
                                                    <div className="form-group  col-md-6">
                                                        <label htmlFor="serviceName">Tên Dịch Vụ * :</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="serviceName"
                                                            id="serviceName"
                                                            value={createService.serviceName}
                                                            onChange={(e) => handleChange(e)}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="form-group  col-md-6">
                                                        <label htmlFor="price">Đơn Giá * :</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            name="price"
                                                            id="price"
                                                            value={createService.price}
                                                            onChange={(e) => handleChange(e)}
                                                            min={0}
                                                            required
                                                        />
                                                    </div>
                                                </div>


                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="description">Mô Tả * :</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="description"
                                                            id="description"
                                                            value={createService.description}
                                                            onChange={(e) => handleChange(e)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="serviceTypeId">Loại Dịch Vụ * :</label>
                                                        <select
                                                            name="serviceTypeId"
                                                            className="form-control"
                                                            value={createService.serviceTypeId}
                                                            onChange={(e) => handleChange(e)}
                                                            required
                                                        >
                                                            <option value="">Chọn Loại</option>
                                                            {serviceTypeList.map((type) => (
                                                                <option key={type.serviceTypeId} value={type.serviceTypeId}>
                                                                    {type.serviceTypeName}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>



                                    </div>

                                    {/* Modal Footer */}
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-custom btn-sm">Lưu</button>
                                        <button type="button" className="btn btn-dark btn-sm" onClick={closeModalCreateService}>Đóng</button>
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
                                            `}
            </style>

        </>
    )
}

export default ListService