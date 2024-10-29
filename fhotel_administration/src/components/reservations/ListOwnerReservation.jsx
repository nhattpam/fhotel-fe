import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import reservationService from '../../services/reservation.service';
import userService from '../../services/user.service';

const ListOwnerReservation = () => {

    //get user information
    const loginUserId = sessionStorage.getItem('userId');


    //call list hotel registration
    const [reservationList, setReservationList] = useState([]);
    const [reservationSearchTerm, setReservationSearchTerm] = useState('');
    const [currentReservationPage, setCurrentReservationPage] = useState(0);
    const [reservationsPerPage] = useState(10);


    useEffect(() => {
        userService
            .getAllReservationByStaff(loginUserId)
            .then((res) => {
                const sortedReservationList = [...res.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setReservationList(sortedReservationList);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    const handleReservationSearch = (event) => {
        setReservationSearchTerm(event.target.value);
    };

    const filteredReservations = reservationList
        .filter((reservation) => {
            return (
                reservation.user?.name.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.roomType?.type?.typeName.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.createdDate.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                reservation.numberOfRooms?.typeName.toString().toLowerCase().includes(reservationSearchTerm.toLowerCase())
            );
        });

    const pageReservationCount = Math.ceil(filteredReservations.length / reservationsPerPage);

    const handleReservationPageClick = (data) => {
        setCurrentReservationPage(data.selected);
    };

    const offsetReservation = currentReservationPage * reservationsPerPage;
    const currentReservations = filteredReservations.slice(offsetReservation, offsetReservation + reservationsPerPage);



    //detail reservation modal 
    const [showModalReservation, setShowModalReservation] = useState(false);

    const [reservation, setReservation] = useState({

    });


    const openReservationModal = (reservationId) => {
        setShowModalReservation(true);
        if (reservationId) {
            reservationService
                .getReservationById(reservationId)
                .then((res) => {
                    setReservation(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const closeModalReservation = () => {
        setShowModalReservation(false);
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
                            <div className="ibox-title">List of Reservations</div>
                            <div className="form-group">
                                <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm"
                                    autoComplete="on" value={reservationSearchTerm}
                                    onChange={handleReservationSearch} />
                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table table-borderless table-hover table-wrap table-centered">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Customer</th>
                                            <th>Room Type</th>
                                            <th>Number of Rooms</th>
                                            <th>Created Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentReservations.length > 0 && currentReservations.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.customer?.name}</td>
                                                        <td>{item.roomType?.type?.typeName}</td>
                                                        <td>{item.numberOfRooms}</td>
                                                        <td> {new Date(item.createdDate).toLocaleString('en-US')}</td>
                                                        <td>
                                                            {item.reservationStatus === "Pending" &&  (
                                                                 <span className="badge label-table badge-warning">Peding</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5"
                                                                data-toggle="tooltip" data-original-title="Edit">
                                                                <i className="fa fa-pencil font-14"
                                                                    onClick={() => openReservationModal(item.reservationId)} /></button>
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
                                pageCount={pageReservationCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handleReservationPageClick}
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

            {showModalReservation && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <form>

                                <div className="modal-header">
                                    <h5 className="modal-title">Reservation Information</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalReservation}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-5">
                                            <table className="table table-responsive table-hover mt-3">
                                                <img src={reservation.image} alt="avatar" style={{ width: '150px', height: '150px' }} />

                                            </table>
                                        </div>
                                        <div className="col-md-7">
                                            <table className="table table-responsive table-hover mt-3">
                                                <tbody>
                                                    <tr>
                                                        <th style={{ width: '30%' }}>Name:</th>
                                                        <td>{reservation.firstName} {reservation.lastName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Email:</th>
                                                        <td>{reservation.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Phone Number:</th>
                                                        <td>{reservation && reservation.phoneNumber ? reservation.phoneNumber : 'Unknown Phone Number'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Address:</th>
                                                        <td>{reservation && reservation.address ? reservation.address : 'Unknown Address'}</td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>


                                </div>
                                <div className="modal-footer">
                                    {/* <button type="button" className="btn btn-custom">Save</button> */}
                                    <button type="button" className="btn btn-dark" onClick={closeModalReservation} >Close</button>
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

export default ListOwnerReservation