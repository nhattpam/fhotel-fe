import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import serviceService from '../../services/service.service';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';

import { Link } from 'react-router-dom';

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
    //list service types
    const [serviceTypeList, setServiceTypeList] = useState([]);

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
                window.alert("Update successful!");
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
                            <div className="ibox-title">List of Services</div>
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
                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Description</th>
                                            <th>Category</th>
                                            <th>Status</th>
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
                                                        <td>{item.price} Vnd</td>
                                                        <td>{item.description}</td>
                                                        <td>{item.serviceType?.serviceTypeName}</td>
                                                        <td>
                                                            {item.isActive ? (
                                                                <span className="badge label-table badge-success">Active</span>
                                                            ) : (
                                                                <span className="badge label-table badge-danger">Inactive</span>
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

                                <div className="modal-header">
                                    <h5 className="modal-title">Service Information</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalService}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-5">
                                            <img src={service.image} alt="avatar" style={{ width: '100%' }} />
                                        </div>

                                        <div className="col-md-7">
                                            <table className="table table-responsive table-hover mt-3">
                                                <tbody>
                                                    <tr>
                                                        <th style={{ width: '30%' }}>Name:</th>
                                                        <td>{service.serviceName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Price:</th>
                                                        <td>{service.price} Vnd</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Description:</th>
                                                        <td>{service.description} </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>


                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-dark" onClick={closeModalService} >Close</button>
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
                                            `}
            </style>

        </>
    )
}

export default ListService