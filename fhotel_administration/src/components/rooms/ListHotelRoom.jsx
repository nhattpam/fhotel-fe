import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import hotelService from '../../services/hotel.service';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import userService from '../../services/user.service';
import { Link } from 'react-router-dom';
import cityService from '../../services/city.service';
import documentService from '../../services/document.service';
import hotelImageService from '../../services/hotel-image.service';
import hotelDocumentService from '../../services/hotel-document.service';
import ReactQuill from 'react-quill';
import Dropzone from 'react-dropzone';
import roomStayHistoryService from '../../services/room-stay-history.service';
const ListHotelRoom = () => {
    //LOADING
    const [loading, setLoading] = useState(true); // State to track loading

    //LOADING

    const loginUserId = sessionStorage.getItem('userId');
    const [loginUser, setLoginUser] = useState({
    });
    useEffect(() => {
        if (loginUserId) {
            userService
                .getUserById(loginUserId)
                .then((res) => {
                    setLoginUser(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, loginUserId);

    //call list hotel registration
    const [hotelList, setHotelList] = useState([]);
    const [roomsByHotel, setRoomsByHotel] = useState({});
    const [roomStayHistoryList, setRoomStayHistoryList] = useState([]);
    const [collapsedRooms, setCollapsedRooms] = useState({});

    const toggleRoomCollapse = (hotelId) => {
        setCollapsedRooms((prevState) => ({
            ...prevState,
            [hotelId]: !prevState[hotelId] // Toggle collapse state for this hotel
        }));
    };
    const [hotelSearchTerm, setHotelSearchTerm] = useState('');
    const [currentHotelPage, setCurrentHotelPage] = useState(0);
    const [hotelsPerPage] = useState(10);


    useEffect(() => {
        userService
            .getAllHotelByUserId(loginUserId)
            .then((res) => {
                const sortedHotelList = [...res.data].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
                setHotelList(sortedHotelList);
                setLoading(false);
                sortedHotelList.forEach(hotel => {
                    hotelService.getAllRoomByHotelId(hotel.hotelId)
                        .then(roomResponse => {
                            setRoomsByHotel((prevRooms) => ({
                                ...prevRooms,
                                [hotel.hotelId]: roomResponse.data.sort((a, b) => a.roomNumber - b.roomNumber)
                            }));

                        })
                        .catch(err => console.log("Error fetching rooms for hotel", hotel.hotelId, err));
                });
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
        roomStayHistoryService
            .getAllRoomStayHistory()
            .then((res) => {
                setRoomStayHistoryList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [loginUserId]);




    const [selectedDistrictId, setSelectedDistrictId] = useState('');
    const uniqueDistricts = [...new Set(hotelList.map((hotel) => hotel.district?.districtName))]
        .filter(Boolean);

    const handleHotelSearch = (event) => {
        setHotelSearchTerm(event.target.value);
    };

    const filteredHotels = hotelList
        .filter((hotel) => {
            const matchesDistrict = selectedDistrictId ? hotel.district?.districtName === selectedDistrictId : true;
            const matchesSearchTerm = (
                hotel.code.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase()) ||
                hotel.hotelName.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase()) ||
                hotel.district?.city?.cityName.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase()) ||
                hotel.district?.districtName.toString().toLowerCase().includes(hotelSearchTerm.toLowerCase())
            );
            return matchesDistrict && matchesSearchTerm;
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



    // Cities
    const [cityList, setCityList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [selectedCity, setSelectedCity] = useState(''); // Add state for selected city
    const [documentList, setDocumentList] = useState([]);

    useEffect(() => {
        cityService
            .getAllCity()
            .then((res) => {
                setCityList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
        documentService
            .getAllDocument()
            .then((res) => {
                setDocumentList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []); // Fetch cities only once when component mounts

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
                            <div className="ibox-title">Danh Sách Phòng</div>
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
                                        className="form-control form-control-sm "
                                        autoComplete="on"
                                        value={hotelSearchTerm}
                                        onChange={handleHotelSearch}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="ibox-body">
                            {currentHotels.length > 0 && currentHotels.map((hotel, index) => (
                                <div key={hotel.hotelId}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <h4 style={{ fontWeight: 'bold', marginRight: '10px' }}>
                                            {index + 1}. {hotel.hotelName}
                                        </h4>
                                        <button
                                            onClick={() => toggleRoomCollapse(hotel.hotelId)}
                                            style={{
                                                border: 'none',
                                                background: 'none',
                                                cursor: 'pointer',
                                                fontSize: '1.2em',
                                                color: 'primary'
                                            }}
                                        >
                                            {/* Font Awesome 4 Icon for Show/Hide Rooms */}
                                            {collapsedRooms[hotel.hotelId] ? (
                                                <i className="fa fa-chevron-down"></i> // Show Rooms
                                            ) : (
                                                <i className="fa fa-chevron-up"></i> // Hide Rooms
                                            )}
                                        </button>
                                    </div>

                                    {!collapsedRooms[hotel.hotelId] && (
                                        <ul>
                                            {roomsByHotel[hotel.hotelId] ? (
                                                <div className="row">
                                                    {roomsByHotel[hotel.hotelId].map((room) => {
                                                        const occupiedRoom = roomStayHistoryList.find(
                                                            (history) =>
                                                                history.roomId === room.roomId &&
                                                                history.checkInDate &&
                                                                !history.checkOutDate &&
                                                                history.reservation?.reservationStatus === 'CheckIn' || history.reservation?.reservationStatus === 'CheckOut'
                                                        );

                                                        return (
                                                            <div
                                                                key={room.roomNumber}
                                                                className="col-md-4 mb-3"
                                                                style={{ padding: '10px' }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        display: 'flex',
                                                                        backgroundColor:
                                                                            room.status === 'Available' ? 'green' :
                                                                                room.status === 'Occupied' ? 'red' :
                                                                                    '#E4A11B',
                                                                        color: 'white',
                                                                        borderRadius: '5px',
                                                                        overflow: 'hidden'
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            flex: '1',
                                                                            backgroundColor:
                                                                                room.status === 'Available' ? 'darkgreen' :
                                                                                    room.status === 'Occupied' ? 'darkred' :
                                                                                        'goldenrod',
                                                                            textAlign: 'center',
                                                                            fontWeight: 'bold',
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            padding: '10px'
                                                                        }}
                                                                    >
                                                                        <p>{room.roomType?.type?.typeName}</p>
                                                                        <p>{room.roomNumber}</p>
                                                                        <i
                                                                            className={
                                                                                room.status === 'Available' ? 'fa fa-check-circle' :
                                                                                    room.status === 'Occupied' ? 'fa fa-bed' :
                                                                                        'fa fa-wrench'
                                                                            }
                                                                            style={{ fontSize: '1.5em', marginTop: '5px' }}
                                                                        ></i>
                                                                    </div>
                                                                    <div style={{ flex: '3', padding: '20px' }}>
                                                                        {room.status === 'Available' && (
                                                                            <h4 style={{ fontWeight: 'bold' }}>Trống</h4>
                                                                        )}
                                                                        {room.status === 'Occupied' && occupiedRoom && (
                                                                            <div>
                                                                                <h4 style={{ fontWeight: 'bold' }}>Đang sử dụng</h4>
                                                                                <p>Khách: {occupiedRoom.reservation?.customer?.name}</p>
                                                                            </div>
                                                                        )}
                                                                        {room.status === 'Maintenance' && (
                                                                            <h4 style={{ fontWeight: 'bold' }}>Đang bảo trì</h4>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <li>Loading rooms...</li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                            ))}


                        </div>

                    </div>
                    {/* end ibox */}

                </div>

            </div>
            {showModalHotel && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Thông Tin Khách Sạn</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalHotel}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                <div className="row">
                                    <div className="col-md-5">
                                        <table className="table table-responsive table-hover mt-3">
                                            <tbody>
                                                <tr>
                                                    <th>Hình ảnh:</th>
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
                                                                        Không Tìm Thấy.
                                                                    </div>
                                                                )
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Giấy tờ khách sạn:</th>
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
                                                                        Không Tìm Thấy.
                                                                    </div>
                                                                )
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>

                                    <div className="col-md-7">
                                        <table className="table table-responsive table-hover mt-3" style={{ fontSize: '20px' }}>
                                            <tbody>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Tên khách sạn:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{hotel.hotelName}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Email:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{hotel.email}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Số điện thoại:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.phone ? hotel.phone : 'Không tìm thấy'}</td>
                                                </tr>

                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Quận:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.district?.districtName ? hotel.district?.districtName : 'Không tìm thấy'}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Thành phố:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.district?.city?.cityName ? hotel.district?.city?.cityName : 'Không tìm thấy'}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Địa chỉ:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.address ? hotel.address : 'Không tìm thấy'}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Chủ sở hữu:</th>
                                                    <td style={{ textAlign: 'left', padding: '5px' }}>{hotel && hotel.ownerName ? hotel.ownerName : 'Không tìm thấy'}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>

                                </div>


                            </div>
                            <div className="modal-footer">
                                <Link type="button" className="btn btn-custom btn-sm" to={`/edit-hotel/${hotel.hotelId}`}><i class="fa fa-info-circle" aria-hidden="true"></i> Xem chi tiết</Link>
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalHotel} >Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showImageLargerModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Hình Ảnh</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={handleCloseImageLargeModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                <div className="row">
                                    {selectedImageLarger && <img src={selectedImageLarger} alt="Large preview" style={{ width: '100%' }} />}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark btn-sm" onClick={handleCloseImageLargeModal} >Đóng</button>
                            </div>
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

export default ListHotelRoom