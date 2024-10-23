import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import hotelService from '../../services/hotel.service';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import userService from '../../services/user.service';
import { Link } from 'react-router-dom';
const ListOwnerHotel = () => {

    const loginUserId = sessionStorage.getItem('userId');

    //call list hotel registration
    const [hotelList, setHotelList] = useState([]);
    const [hotelSearchTerm, setHotelSearchTerm] = useState('');
    const [currentHotelPage, setCurrentHotelPage] = useState(0);
    const [hotelsPerPage] = useState(5);


    useEffect(() => {
        userService
            .getAllHotelByUserId(loginUserId)
            .then((res) => {
                const sortedHotelList = [...res.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setHotelList(sortedHotelList);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [loginUserId]);


    const handleHotelSearch = (event) => {
        setHotelSearchTerm(event.target.value);
    };

    const filteredHotels = hotelList
        .filter((hotel) => {
            return (
                hotel.hotelName.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase()) ||
                hotel.city?.cityName.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase()) ||
                hotel.city?.country?.countryName.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase()) ||
                hotel.owner?.name.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase())
            );
        });

    const pageHotelRegistrationCount = Math.ceil(filteredHotels.length / hotelsPerPage);

    const handleHotelPageClick = (data) => {
        setCurrentHotelPage(data.selected);
    };

    const offsetHotel = currentHotelPage * hotelsPerPage;
    const currentHotels = filteredHotels.slice(offsetHotel, offsetHotel + hotelsPerPage);



    //detail hotel modal 
    const [showModalHotel, setShowModalHotel] = useState(false);

    const [hotel, setHotel] = useState({

    });
    //list hotel amenities
    //
    const [hotelDocumentList, setHotelDocumentList] = useState([]);
    const [hotelImageList, setHotelImageList] = useState([]);
    const openHotelModal = (hotelId) => {
        setShowModalHotel(true);
        if (hotelId) {
            hotelService
                .getHotelById(hotelId)
                .then((res) => {
                    setHotel(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });

            hotelService
                .getAllHotelDocumentByHotelId(hotelId)
                .then((res) => {
                    setHotelDocumentList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
            hotelService
                .getAllHotelImageByHotelId(hotelId)
                .then((res) => {
                    setHotelImageList(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const closeModalHotel = () => {
        setShowModalHotel(false);
    };


    //click display larger image: 
    const [showImageLargerModal, setShowLargerImageModal] = useState(false);
    const [selectedImageLarger, setSelectedImageLarger] = useState(null);

    // Function to handle opening the modal with the clicked image
    const handleImageLargerClick = (image) => {
        setSelectedImageLarger(image); // Set the clicked image
        setShowLargerImageModal(true);      // Show the modal
    };

    // Function to handle closing the modal
    const handleCloseImageLargeModal = () => {
        setShowLargerImageModal(false);
        setSelectedImageLarger(null); // Reset the selected image
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
                            <div className="ibox-title">List of Hotels</div>
                            <div className="form-group d-flex align-items-center">
                                <input
                                    id="demo-foo-search"
                                    type="text"
                                    placeholder="Search"
                                    className="form-control form-control-sm"
                                    autoComplete="on"
                                    value={hotelSearchTerm}
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
                                            <th>Name</th>
                                            <th>Owner</th>
                                            <th>District</th>
                                            <th>City</th>
                                            <th>Country</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentHotels.length > 0 && currentHotels.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.hotelName}</td>
                                                        <td>{item.owner?.name}</td>
                                                        <td>{item.district?.districtName}</td>
                                                        <td>{item.district?.city?.cityName}</td>
                                                        <td>{item.district?.city?.country?.countryName}</td>
                                                        <td>
                                                            {item.isActive ? (
                                                                <span className="badge label-table badge-success">Active</span>
                                                            ) : (
                                                                <span className="badge label-table badge-danger">Inactive</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit"><i className="fa fa-pencil font-14" onClick={() => openHotelModal(item.hotelId)} /></button>
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
            {showModalHotel && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <form>

                                <div className="modal-header">
                                    <h5 className="modal-title">Hotel Information</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalHotel}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-5">
                                            <table className="table table-responsive table-hover mt-3">
                                                <tbody>
                                                    <tr>
                                                        <th>Image:</th>
                                                        <td style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', margin: 0 }}>
                                                            {
                                                                hotelImageList.length > 0 ? hotelImageList.map((item, index) => (
                                                                    <div key={index} style={{ position: 'relative', textAlign: 'center', flex: '0 1 auto', margin: '5px' }}>
                                                                        <img src={item.image} alt="amenity" style={{ width: "150px", margin: '0 5px' }}
                                                                            onClick={() => handleImageLargerClick(item.image)}
                                                                        />

                                                                    </div>
                                                                ))
                                                                    : (
                                                                        <div style={{ textAlign: 'center', fontSize: '16px', color: 'gray' }}>
                                                                            No hotel images available.
                                                                        </div>
                                                                    )
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Business document:</th>
                                                        <td style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', margin: 0 }}>
                                                            {
                                                                hotelDocumentList.length > 0 ? hotelDocumentList.map((item, index) => (
                                                                    <div key={index} style={{ position: 'relative', textAlign: 'center', flex: '0 1 auto', margin: '5px' }}>
                                                                        <img src={item.image} alt="amenity" style={{ width: "150px", margin: '0 5px' }}
                                                                            onClick={() => handleImageLargerClick(item.image)}
                                                                        />

                                                                    </div>
                                                                ))
                                                                    : (
                                                                        <div style={{ textAlign: 'center', fontSize: '16px', color: 'gray' }}>
                                                                            No hotel images available.
                                                                        </div>
                                                                    )
                                                            }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>

                                        <div className="col-md-7">
                                            <table className="table table-responsive table-hover mt-3">
                                                <tbody>
                                                    <tr>
                                                        <th style={{ width: '30%' }}>Name:</th>
                                                        <td>{hotel.hotelName}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Email:</th>
                                                        <td>{hotel.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Phone Number:</th>
                                                        <td>{hotel && hotel.phone ? hotel.phone : 'Unknown Phone Number'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Business License Number:</th>
                                                        <td>{hotel && hotel.businessLicenseNumber ? hotel.businessLicenseNumber : 'Unknown Business License Number'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Tax Identification Number:</th>
                                                        <td>{hotel && hotel.taxIdentificationNumber ? hotel.taxIdentificationNumber : 'Unknown Tax Identification Number'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>District:</th>
                                                        <td>{hotel && hotel.district?.districtName ? hotel.district?.districtName : 'Unknown District'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>City:</th>
                                                        <td>{hotel && hotel.district?.city?.cityName ? hotel.district?.city?.cityName : 'Unknown City'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Address:</th>
                                                        <td>{hotel && hotel.address ? hotel.address : 'Unknown Address'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Owner:</th>
                                                        <td>{hotel && hotel.ownerName ? hotel.ownerName : 'Unknown Owner'}</td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>

                                    </div>


                                </div>
                                <div className="modal-footer">
                                    <Link type="button" className="btn btn-custom" to={`/edit-hotel/${hotel.hotelId}`}>View Detail</Link>
                                    <button type="button" className="btn btn-dark" onClick={closeModalHotel} >Close</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )}

            {showImageLargerModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <form>

                                <div className="modal-header">
                                    <h5 className="modal-title">Image</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCloseImageLargeModal}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        {selectedImageLarger && <img src={selectedImageLarger} alt="Large preview" style={{ width: '100%' }} />}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-dark" onClick={handleCloseImageLargeModal} >Close</button>
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

export default ListOwnerHotel