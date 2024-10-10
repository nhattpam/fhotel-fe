import React from 'react'
import { useState } from 'react';
import hotelRegistrationService from '../services/hotel-registration.service';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const Header = () => {

    //hotel registration
    const [showCreateHotelRegistrationModal, setShowCreateHotelRegistrationModal] = useState(false); // State variable for modal visibility

    const handleOpenHotelRegistrationModal = () => {
        setShowCreateHotelRegistrationModal(true);
    };

    const [hotelRegistration, setHotelRegistration] = useState({
        numberOfHotels: "",
        description: ""
    });


    const handleDescriptionChange = (value) => {
        setHotelRegistration({ ...hotelRegistration, description: value });
    };

    const submitHotelRegistration = (e) => {
        e.preventDefault();
        console.log(JSON.stringify(hotelRegistration))
        // If the note is not empty, proceed with the form submission
        hotelRegistrationService
            .saveHotelRegistration(hotelRegistration)
            .then((res) => {
                window.alert("You registration sent! Wait for response...");
                setShowCreateHotelRegistrationModal(false)
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
                <div className="container">
                    <a className="navbar-brand" href="index.html">FHotel</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="oi oi-menu" /> Menu
                    </button>
                    <div className="collapse navbar-collapse" id="ftco-nav">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item active"><a href="index.html" className="nav-link">Home</a></li>
                            <li className="nav-item"><a href="about.html" className="nav-link">About</a></li>
                            <li className="nav-item"><a href="services.html" className="nav-link">Services</a></li>
                            <li className="nav-item"><a href="agent.html" className="nav-link">Agent</a></li>
                            <li className="nav-item"><a href="properties.html" className="nav-link">Listing</a></li>
                            <li className="nav-item"><a href="blog.html" className="nav-link">Blog</a></li>
                            <li className="nav-item"><a className="nav-link" onClick={() => handleOpenHotelRegistrationModal()}>Join with us!</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            {/* END nav */}

            {showCreateHotelRegistrationModal && (
                <form id="hotel-registration-form" data-parsley-validate onSubmit={(e) => submitHotelRegistration(e)}>
                    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog  modal-dialog-scrollable modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Hotel Registration</h5>
                                    <button type="button" className="close" onClick={() => setShowCreateHotelRegistrationModal(false)}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="numberOfHotels">Number of Hotels</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="numberOfHotels"
                                            name="numberOfHotels"
                                            placeholder="Enter number of hotels"
                                            required
                                            value={hotelRegistration.numberOfHotels}
                                            onChange={(e) => setHotelRegistration({ ...hotelRegistration, numberOfHotels: e.target.value })}

                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <ReactQuill
                                            value={hotelRegistration.description}
                                            onChange={handleDescriptionChange}
                                            modules={{
                                                toolbar: [
                                                    [{ header: [1, 2, false] }],
                                                    [{ 'direction': 'rtl' }],
                                                    [{ 'align': [] }],
                                                    ['code-block'],
                                                    [{ 'color': [] }, { 'background': [] }],
                                                    ['clean']
                                                ]
                                            }}
                                            theme="snow"
                                            preserveWhitespace={true} // Add this line to preserve whitespace
                                            style={{ height: '300px' }}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-dark"
                                        style={{ borderRadius: '50px', padding: `8px 25px` }}
                                        onClick={() => setShowCreateHotelRegistrationModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{ backgroundColor: '#f58d04', borderRadius: '50px', padding: `8px 25px`, border: 'none' }}
                                    >
                                        Register
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}

<style>
                {`
                    /* Add this CSS to ensure scrolling within modal body */
                    /* Add this CSS to ensure scrolling within modal body */
.modal-body {
  max-height: calc(100vh - 200px); /* Adjust the value (200px) as needed to accommodate the modal header and footer */
  overflow-y: auto; /* Enable vertical scrolling when content exceeds max height */
}

/* Add this CSS to create a sticky footer */
.modal-footer {
  position: sticky;
  bottom: 0;
  background-color: #fff; /* Optional: Set background color for footer */
  padding: 15px; /* Optional: Add padding to footer */
}

                    
                    /* Add this CSS to set a high z-index for modals */
                    .modal {
                      z-index: 9999; /* Set a high z-index value */
                    }
                    
                   
                    
                    
                    
                `}
            </style>

        </>
    )
}

export default Header