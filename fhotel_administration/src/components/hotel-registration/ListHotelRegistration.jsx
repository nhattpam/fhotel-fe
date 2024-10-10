import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import hotelRegistrationService from '../../services/hotel-registration.service';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';

const ListHotelRegistration = () => {


    //call list hotel registration
    const [hotelRegistrationList, setHotelRegistrationList] = useState([]);
    const [hotelRegistrationSearchTerm, setHotelRegistrationSearchTerm] = useState('');
    const [currentHotelRegistrationPage, setCurrentHotelRegistrationPage] = useState(0);
    const [hotelRegistrationsPerPage] = useState(5);


    useEffect(() => {
        hotelRegistrationService
            .getAllHotelRegistration()
            .then((res) => {
                const sortedHotelRegistrationList = [...res.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.registrationDate) - new Date(a.registrationDate);
                });
                setHotelRegistrationList(sortedHotelRegistrationList);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    const handleHotelRegistrationSearch = (event) => {
        setHotelRegistrationSearchTerm(event.target.value);
    };

    const filteredHotelRegistrations = hotelRegistrationList
        .filter((hotelRegistration) => {
            return (
                hotelRegistration.numberOfHotels.toString().toLowerCase().includes(hotelRegistrationSearchTerm.toLowerCase()) ||
                hotelRegistration.description.toString().toLowerCase().includes(hotelRegistrationSearchTerm.toLowerCase()) ||
                hotelRegistration.registrationDate.toString().toLowerCase().includes(hotelRegistrationSearchTerm.toLowerCase()) ||
                hotelRegistration.registrationStatus.toString().toLowerCase().includes(hotelRegistrationSearchTerm.toLowerCase())
            );
        });

    const pageHotelRegistrationCount = Math.ceil(filteredHotelRegistrations.length / hotelRegistrationsPerPage);

    const handleHotelRegistrationPageClick = (data) => {
        setCurrentHotelRegistrationPage(data.selected);
    };

    const offsetHotelRegistration = currentHotelRegistrationPage * hotelRegistrationsPerPage;
    const currentHotelRegistrations = filteredHotelRegistrations.slice(offsetHotelRegistration, offsetHotelRegistration + hotelRegistrationsPerPage);



    //detail hotel registration
    const [showModalHotelRegistration, setShowModalHotelRegistration] = useState(false);

    const [hotelRegistration, setHotelRegistration] = useState({
        numberOfRooms: "",
        description: ""
    });


    const openHotelRegistrationModal = (hotelRegistrationId) => {
        setShowModalHotelRegistration(true);
        if (hotelRegistrationId) {
            hotelRegistrationService
                .getHotelRegistrationById(hotelRegistrationId)
                .then((res) => {
                    setHotelRegistration(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const closeModalHotelRegistration = () => {
        setShowModalHotelRegistration(false);
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
                            <div className="ibox-title">List of Hotel Registrations</div>
                            <div className="form-group">
                                <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm"
                                    autoComplete="on" value={hotelRegistrationSearchTerm}
                                    onChange={handleHotelRegistrationSearch} />
                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Number of Hotels</th>
                                            <th>Registration Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentHotelRegistrations.length > 0 && currentHotelRegistrations.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.numberOfHotels}</td>
                                                        <td>{new Date(item.registrationDate).toLocaleString('en-US')}</td>
                                                        <td>{item.registrationStatus}</td>
                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit"><i className="fa fa-pencil font-14" onClick={() => openHotelRegistrationModal(item.hotelRegistrationId)} /></button>
                                                            <button className="btn btn-default btn-xs" data-toggle="tooltip" data-original-title="Delete"><i className="fa fa-trash font-14" /></button>
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
                                onPageChange={handleHotelRegistrationPageClick}
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
            {showModalHotelRegistration && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <form>

                                <div className="modal-header">
                                    <h5 className="modal-title">Hotel Registration Information</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalHotelRegistration}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>

                                    <div className='row'>
                                        <div className="col-md-12">
                                            {hotelRegistration.numberOfRooms} rooms
                                        </div>
                                        <div className="col-md-12">
                                            <div dangerouslySetInnerHTML={{ __html: hotelRegistration.description }} />
                                        </div>

                                    </div>

                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-warning" disabled style={{ borderRadius: '50px', padding: `8px 25px` }}>Save</button>
                                    <button type="button" className="btn btn-dark" onClick={closeModalHotelRegistration} style={{ borderRadius: '50px', padding: `8px 25px` }}>Close</button>
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
                                            `}
            </style>

        </>
    )
}

export default ListHotelRegistration