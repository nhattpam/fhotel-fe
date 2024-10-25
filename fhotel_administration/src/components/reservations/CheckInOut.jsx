import React, { useEffect, useState } from 'react';
import Header from '../Header';
import SideBar from '../SideBar';
import userService from '../../services/user.service';

const CheckInOut = () => {
    //get user information
    const loginUserId = sessionStorage.getItem('userId');


    //call list hotel registration
    const [reservationList, setReservationList] = useState([]);

    const [customerSearch, setCustomerSearch] = useState('');
    const [reservationDetails, setReservationDetails] = useState([]);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [isCheckedOut, setIsCheckedOut] = useState(false);

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

    const handleSearch = () => {
        // Simulate searching for reservation
        const filteredReservations = reservationList.filter(res =>
            res.customer?.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
            res.customer?.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
            res.customer?.identificationNumber.includes(customerSearch)
        );

        if (filteredReservations.length > 0) {
            setReservationDetails(filteredReservations);
        } else {
            setReservationDetails(null);
        }
    };


    const handleCheckIn = () => {
        // Simulate checking in process
        setIsCheckedIn(true);
    };

    const handleCheckOut = () => {
        // Simulate checking out process
        setIsCheckedOut(true);
    };

    return (
        <>
            <Header />
            <SideBar />
            <div className="content-wrapper" style={{ textAlign: 'left', display: 'block' }}>
                {/* Page Heading */}
                <div className="page-heading d-flex align-items-center justify-content-between">
                    <h2 className="page-title">Check-In / Check-Out</h2>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="index.html">
                                <i className="la la-home font-20" />
                            </a>
                        </li>
                        <li className="breadcrumb-item active">Check-In / Check-Out</li>
                    </ol>
                </div>

                <div className="page-content">
                    <div className="card shadow-lg border-0 rounded">
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Reservation Search</h4>
                        </div>

                        <div className="card-body p-4" style={{ textAlign: 'left' }}>
                            <div className="check-in-out-page">
                                {/* Search Section */}
                                <div className="search-section mb-4">
                                    <label htmlFor="reservation-search" className="form-label">Search Reservation</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            id="reservation-search"
                                            className="form-control"
                                            placeholder="Customer Name or Email or Identification number"
                                            value={customerSearch}
                                            onChange={(e) => setCustomerSearch(e.target.value)}
                                        />
                                        <button className="btn btn-primary input-group-append" onClick={handleSearch}>
                                            <i className="la la-search" /> Search
                                        </button>
                                    </div>
                                </div>

                                {/* Reservation Details */}
                                {reservationDetails && reservationDetails.length > 0 ? (
                                    <div className="reservation-details mt-4">
                                        <h5 className="mb-4">Reservation Details</h5>
                                        {reservationDetails.map((reservation, index) => (
                                            <div key={index} className="card mb-3 border-light shadow-sm">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <p><strong className='mr-2'>Customer Name:</strong> {reservation.customer?.name}</p>
                                                            <p><strong className='mr-2'>Identification Number:</strong> {reservation.customer?.identificationNumber}</p>
                                                            <p><strong className='mr-2'>Email:</strong> {reservation.customer?.email}</p>
                                                            <p><strong className='mr-2'>Phone Number:</strong> {reservation.customer?.phoneNumber}</p>
                                                            <p><strong className='mr-2'>Check-In Date:</strong> {new Date(reservation.checkInDate).toLocaleDateString('en-US')}</p>
                                                            <p><strong className='mr-2'>Check-Out Date:</strong> {new Date(reservation.checkOutDate).toLocaleDateString('en-US')}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <p><strong className='mr-2'>Room Type:</strong> {reservation.roomType?.type?.typeName}</p>
                                                            <p><strong className='mr-2'>Quantity:</strong> {reservation.numberOfRooms}</p>
                                                            <p><strong className='mr-2'>Total Amount:</strong> {reservation.totalAmount} VND</p>
                                                            <p>
                                                                <strong className='mr-2'>Payment Status:</strong>
                                                                {reservation.paymentStatus === "Paid" ? (
                                                                    <span className="badge label-table badge-success">Paid</span>
                                                                ) : reservation.paymentStatus === "Not Paid" ? (
                                                                    <span className="badge label-table badge-danger">Not Paid</span>
                                                                ) : (
                                                                    <span className="badge label-table badge-warning">Unknown Status</span>
                                                                )}
                                                            </p>
                                                            <p>
                                                                <strong className='mr-2'>Reservation Status:</strong>
                                                                {reservation.reservationStatus === "Confirmed" ? (
                                                                    <span className="badge label-table badge-success">Confirmed</span>
                                                                ) : reservation.reservationStatus === "Cancelled" ? (
                                                                    <span className="badge label-table badge-danger">Cancelled</span>
                                                                ) : reservation.reservationStatus === "Pending" ? (
                                                                    <span className="badge label-table badge-warning">Pending</span>
                                                                ) : (
                                                                    <span className="badge label-table badge-warning">Unknown Status</span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {/* Action Buttons for Each Reservation */}
                                                    <div className="mt-4 d-flex gap-3">
                                                        {!reservation.isCheckedIn ? (
                                                            <button className="btn btn-success" onClick={() => handleCheckIn(reservation)}>
                                                                <i className="la la-sign-in" /> Check-In
                                                            </button>
                                                        ) : (
                                                            <p className="text-success"><strong>Checked In at:</strong> {new Date().toLocaleTimeString()}</p>
                                                        )}

                                                        {!reservation.isCheckedOut ? (
                                                            <button className="btn btn-danger" onClick={() => handleCheckOut(reservation)} disabled={!reservation.isCheckedIn}>
                                                                <i className="la la-sign-out" /> Check-Out
                                                            </button>
                                                        ) : (
                                                            <p className="text-danger"><strong>Checked Out at:</strong> {new Date().toLocaleTimeString()}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="alert alert-warning mt-4">
                                        <i className="la la-exclamation-triangle" /> No reservation found. Please search again.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <style jsx>{`
                .content-wrapper {
                    background-color: #f0f4f8;
                    min-height: 100vh;
                    padding: 20px;
                }
    
                .page-title {
                    font-size: 24px;
                    font-weight: bold;
                }
    
                .card {
                    border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
    
                .card-header {
                    background-color: #343a40;
                    padding: 15px 20px;
                    font-size: 18px;
                    border-bottom: none;
                }
    
                .card-body {
                    padding: 30px;
                    background-color: #fff;
                }
    
                .form-control {
                    border: 1px solid #ced4da;
                    padding: 10px;
                    border-radius: 6px;
                    transition: box-shadow 0.3s ease;
                }
    
                .form-control:focus {
                    box-shadow: 0 0 10px rgba(0, 123, 255, 0.25);
                }
    
                .input-group-append {
                    background-color: #007bff;
                    border: none;
                    border-radius: 0 6px 6px 0;
                    color: white;
                    padding: 10px 20px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
    
                .input-group-append:hover {
                    background-color: #0056b3;
                }
    
                .reservation-details {
                    background-color: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                }
    
                .btn {
                    padding: 10px 20px;
                    font-size: 16px;
                    border-radius: 6px;
                }
    
                .btn-success {
                    background-color: #28a745;
                    border: none;
                    transition: background-color 0.3s ease;
                }
    
                .btn-success:hover {
                    background-color: #218838;
                }
    
                .btn-danger {
                    background-color: #dc3545;
                    border: none;
                    transition: background-color 0.3s ease;
                }
    
                .btn-danger:hover {
                    background-color: #c82333;
                }
    
                .alert {
                    border-radius: 6px;
                    padding: 20px;
                    font-size: 16px;
                }
    
                @media (max-width: 768px) {
                    .card-body {
                        padding: 20px;
                    }
    
                    .row {
                        display: flex;
                        flex-direction: column;
                    }
    
                    .input-group {
                        display: flex;
                        flex-direction: column;
                    }
    
                    .input-group-append {
                        margin-top: 10px;
                    }
    
                    .btn {
                        width: 100%;
                    }
                }
            `}</style>
        </>
    );

};

export default CheckInOut;
