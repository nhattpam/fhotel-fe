import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import hotelVerificationService from '../../services/hotel-verification.service';
import userService from '../../services/user.service';
import hotelService from '../../services/hotel.service';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';

const ListHotelVerification = () => {

    //get hotelVerification information
    const loginUserId = sessionStorage.getItem('userId');

    //call list hotel registration
    const [hotelVerificationList, setHotelVerificationList] = useState([]);
    const [hotelVerificationList2, setHotelVerificationList2] = useState([]);
    const [hotelVerificationSearchTerm, setHotelVerificationSearchTerm] = useState('');
    const [currentHotelVerificationPage, setCurrentHotelVerificationPage] = useState(0);
    const [hotelVerificationsPerPage] = useState(10);


    useEffect(() => {
        userService
            .getAllHotelVerificationByManager(loginUserId)
            .then((res) => {
                const sortedList = [...res.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.createdDate) - new Date(a.createdDate);
                });
                setHotelVerificationList(sortedList);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    const handleHotelVerificationSearch = (event) => {
        setHotelVerificationSearchTerm(event.target.value);
    };

    const filteredHotelVerifications = hotelVerificationList
        .filter((hotelVerification) => {
            return (
                hotelVerification.hotel?.hotelName.toString().toLowerCase().includes(hotelVerificationSearchTerm.toLowerCase()) ||
                hotelVerification.assignedManager?.name.toString().toLowerCase().includes(hotelVerificationSearchTerm.toLowerCase()) ||
                hotelVerification.verificationStatus.toString().toLowerCase().includes(hotelVerificationSearchTerm.toLowerCase()) ||
                hotelVerification.verificationDate.toString().toLowerCase().includes(hotelVerificationSearchTerm.toLowerCase())
            );
        });

    const pageHotelVerificationCount = Math.ceil(filteredHotelVerifications.length / hotelVerificationsPerPage);

    const handleHotelVerificationPageClick = (data) => {
        setCurrentHotelVerificationPage(data.selected);
    };

    const offsetHotelVerification = currentHotelVerificationPage * hotelVerificationsPerPage;
    const currentHotelVerifications = filteredHotelVerifications.slice(offsetHotelVerification, offsetHotelVerification + hotelVerificationsPerPage);



    //detail hotelVerification modal 
    const [showModalHotelVerification, setShowModalHotelVerification] = useState(false);

    const [hotelVerification, setHotelVerification] = useState({

    });
    const [hotelDocumentList, setHotelDocumentList] = useState([]);
    const [hotelImageList, setHotelImageList] = useState([]);


    const openHotelVerificationModal = (hotelVerificationId) => {
        setShowModalHotelVerification(true);
        if (hotelVerificationId) {
            hotelVerificationService
                .getHotelVerificationById(hotelVerificationId)
                .then((res) => {
                    setHotelVerification(res.data);
                    hotelService
                        .getAllHotelDocumentByHotelId(res.data.hotelId)
                        .then((res) => {
                            setHotelDocumentList(res.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    hotelService
                        .getAllHotelVerificationByHotelId(res.data.hotelId)
                        .then((res) => {
                            setHotelVerificationList2(res.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    hotelService
                        .getAllHotelImageByHotelId(res.data.hotelId)
                        .then((res) => {
                            setHotelImageList(res.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch((error) => {
                    console.log(error);
                });

        }
    };

    const closeModalHotelVerification = () => {
        setShowModalHotelVerification(false);
        setHotelVerificationList2([]);
    };


    //CREATE HOTEL VERIFICATION 
    const [showModalUpdateHotelVerification, setShowModalUpdateHotelVerification] = useState(false);

    const [updateHotelVerification, setUpdateHotelVerification] = useState({

    });

    const openUpdateHotelVerificationModal = () => {
        setShowModalUpdateHotelVerification(true);

    };

    const closeModalUpdateHotelVerification = () => {
        setShowModalUpdateHotelVerification(false);
    };

    const handleInputChangeHotelVerification = (e) => {
        const { name, value } = e.target;
        setUpdateHotelVerification((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleNoteChange = (value) => {
        setUpdateHotelVerification({ ...updateHotelVerification, notes: value });
    };

    //update hotel status
    const submitUpdateHotelVerification = async (e) => {
        e.preventDefault();

        try {
            updateHotelVerification.createdDate = hotelVerification.createdDate;
            updateHotelVerification.hotelId = hotelVerification.hotelId;
            updateHotelVerification.assignedManagerId = hotelVerification.assignedManagerId;
            updateHotelVerification.createdDate = hotelVerification.createdDate;

            // Make the update request
            const updateRes = await hotelVerificationService.updateHotelVerification(hotelVerification.hotelVerificationId, updateHotelVerification);
            console.log(updateRes)
            if (updateRes.status === 200) {
                setSuccess({ general: "Cập Nhật Thành Công..." });
                setShowSuccess(true);
                userService
                    .getAllHotelVerificationByManager(loginUserId)
                    .then((res) => {
                        const sortedList = [...res.data].sort((a, b) => {
                            // Assuming requestedDate is a string in ISO 8601 format
                            return new Date(b.createdDate) - new Date(a.createdDate);
                        });
                        setHotelVerificationList(sortedList);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                hotelVerificationService
                    .getHotelVerificationById(hotelVerification.hotelVerificationId)
                    .then((res) => {
                        setHotelVerification(res.data);
                    })
                hotelService
                    .getAllHotelVerificationByHotelId(hotelVerification.hotelId)
                    .then((res) => {
                        setHotelVerificationList2(res.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                setError({ general: "Có lỗi xảy ra..." });
                setShowError(true);
            }
        } catch (error) {
            setError({ general: "Có lỗi xảy ra..." });
            setShowError(true);
        }
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

    /// notification
    const [success, setSuccess] = useState({}); // State to hold error messages
    const [showSuccess, setShowSuccess] = useState(false); // State to manage error visibility
    //notification after creating
    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false); // Hide the error after 2 seconds
                // window.location.reload();
            }, 3000); // Change this value to adjust the duration
            // window.location.reload();
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [showSuccess]); // Only run effect if showError changes


    const [error, setError] = useState({}); // State to hold error messages
    const [showError, setShowError] = useState(false); // State to manage error visibility
    //notification after creating
    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => {
                setShowError(false); // Hide the error after 2 seconds
            }, 3000); // Change this value to adjust the duration
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
                        <div className="ibox-head bg-dark text-light">
                            <div className="ibox-title">Danh Sách Yêu Cầu Xác Minh</div>
                            <div className="form-group">
                                <div className="search-bar ml-3">
                                    <i className="fa fa-search search-icon" aria-hidden="true"></i>
                                    <input id="demo-foo-search" type="text" placeholder="Tìm kiếm" className="form-control form-control-sm"
                                        autoComplete="on" value={hotelVerificationSearchTerm}
                                        onChange={handleHotelVerificationSearch} />
                                </div>

                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table table-borderless table-hover table-wrap table-centered">
                                    <thead>
                                        <tr>
                                            <th><span>STT</span></th>
                                            <th><span>Mã số</span></th>
                                            <th><span>Khách sạn</span></th>
                                            <th><span>Email</span></th>
                                            <th><span>Ngày tạo</span></th>
                                            <th><span>Trạng thái</span></th>
                                            <th><span>Hành động</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentHotelVerifications.length > 0 && currentHotelVerifications.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.hotel?.code}</td>
                                                        <td>{item.hotel?.hotelName}</td>
                                                        <td>{item.hotel?.email}</td>
                                                        <td>{new Date(item.createdDate).toLocaleDateString('en-US')}</td>
                                                        <td>
                                                            {item.verificationStatus === "Pending" && (
                                                                <span className="badge label-table ">
                                                                    <span className="badge label-table badge-warning">Đang chờ</span>
                                                                </span>
                                                            )}
                                                            {item.verificationStatus === "Verified" && (
                                                                <span className="badge label-table">
                                                                    <span className="badge label-table badge-success">Đã xác minh</span>
                                                                </span>
                                                            )}
                                                            {item.verificationStatus === "Rejected" && (
                                                                <span className="badge label-table">
                                                                    <span className="badge label-table badge-danger">Từ chối</span>
                                                                </span>)}
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit">
                                                                <i className="fa fa-pencil font-14 text-primary" onClick={() => openHotelVerificationModal(item.hotelVerificationId)} /></button>
                                                        </td>
                                                    </tr>
                                                </>
                                            ))
                                        }


                                    </tbody>
                                </table>
                                {
                                    hotelVerificationList.length === 0 && (
                                        <>
                                            <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                        </>
                                    )
                                }
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
                                pageCount={pageHotelVerificationCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handleHotelVerificationPageClick}
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

            {showModalHotelVerification && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">

                            <div className="modal-header bg-dark text-light">
                                <h5 className="modal-title">Thông Tin Khách Sạn</h5>
                                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close" onClick={closeModalHotelVerification}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                {showSuccess && Object.entries(success).length > 0 && (
                                    <div className="success-messages" style={{
                                        position: 'absolute',
                                        top: '10px', right: '10px', background: 'green', color: 'white',
                                        padding: '10px', borderRadius: '5px', zIndex: 1002
                                    }}>
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
                                                                    <>
                                                                        <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                                    </>
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
                                                                    <>
                                                                        <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                                    </>
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
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Mã số:</th>
                                                    <td>{hotelVerification.hotel?.code}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Tên khách sạn:</th>
                                                    <td>{hotelVerification.hotel?.hotelName}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Email:</th>
                                                    <td>{hotelVerification.hotel?.email}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Số điện thoại:</th>
                                                    <td>{hotelVerification.hotel?.phone}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Quận:</th>
                                                    <td>{hotelVerification.hotel?.district?.districtName}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Thành phố:</th>
                                                    <td>{hotelVerification.hotel?.district?.city?.cityName}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Địa chỉ:</th>
                                                    <td>{hotelVerification.hotel?.address}</td>
                                                </tr>

                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Chủ sở hữu:</th>
                                                    <td>{hotelVerification.hotel?.ownerName}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Email chủ sở hữu:</th>
                                                    <td>{hotelVerification.hotel?.ownerEmail}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ width: '20%', fontWeight: 'bold', textAlign: 'left', padding: '5px', color: '#333' }}>Xác minh:</th>
                                                    <td>
                                                        {hotelVerification.verificationStatus === "Pending" && (
                                                            <span className="badge label-table ">
                                                                <span className="badge label-table badge-warning">Đang chờ</span>
                                                            </span>
                                                        )}
                                                        {hotelVerification.verificationStatus === "Verified" && (
                                                            <span className="badge label-table">
                                                                <span className="badge label-table badge-success">Đã xác minh</span>
                                                            </span>
                                                        )}
                                                        {hotelVerification.verificationStatus === "Rejected" && (
                                                            <span className="badge label-table">
                                                                <span className="badge label-table badge-danger">Từ chối</span>
                                                            </span>)}
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                        <div>
                                            <h4 className='text-primary' style={{ textAlign: 'left', fontWeight: 'bold' }}>Lịch sử xác minh</h4>
                                            <div className="table-responsive" style={{ textAlign: 'left' }}>
                                                <table className="table table-borderless table-hover table-wrap table-centered">
                                                    <thead>
                                                        <tr>
                                                            <th><span>STT</span></th>
                                                            <th><span>Nhân viên xác minh</span></th>
                                                            <th><span>Ngày xác minh</span></th>
                                                            <th><span>Ghi chú</span></th>
                                                            <th><span>Trạng thái</span></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            hotelVerificationList2.length > 0 && hotelVerificationList2.map((item, index) => (
                                                                <>
                                                                    <tr>
                                                                        <td>{index + 1}</td>

                                                                        <td>{item.assignedManager?.name}</td>
                                                                        <td>
                                                                            {new Date(item.verificationDate).toLocaleString('en-US') ?? "Chưa Có"}
                                                                        </td>
                                                                        <td dangerouslySetInnerHTML={{ __html: item.notes ?? "Chưa Có" }}></td>
                                                                        <td>
                                                                            {item.verificationStatus === "Pending" && (
                                                                                <span className="badge label-table ">
                                                                                    <span className="badge label-table badge-warning">Đang chờ</span>
                                                                                </span>
                                                                            )}
                                                                            {item.verificationStatus === "Verified" && (
                                                                                <span className="badge label-table">
                                                                                    <span className="badge label-table badge-success">Đã xác minh</span>
                                                                                </span>
                                                                            )}
                                                                            {item.verificationStatus === "Rejected" && (
                                                                                <span className="badge label-table">
                                                                                    <span className="badge label-table badge-danger">Từ chối</span>
                                                                                </span>)}
                                                                        </td>

                                                                    </tr>
                                                                </>
                                                            ))
                                                        }


                                                    </tbody>
                                                </table>
                                                {
                                                    hotelVerificationList.length === 0 && (
                                                        <>
                                                            <p className='text-center' style={{ color: 'gray', fontStyle: 'italic' }}>Không có</p>
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </div>


                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success btn-sm" onClick={() => openUpdateHotelVerificationModal(hotelVerification.hotelVerificationId)} ><i class="fa fa-check-square-o" aria-hidden="true"></i> Xác Minh</button>
                                <Link type="button" className="btn btn-custom btn-sm" to={`/edit-hotel/${hotelVerification.hotel?.hotelId}`}><i class="fa fa-info-circle" aria-hidden="true"></i> Xem chi tiết</Link>
                                <button type="button" className="btn btn-dark btn-sm" onClick={closeModalHotelVerification} >Đóng</button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
            {
                showModalUpdateHotelVerification && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                        <div className="modal-dialog modal-dialog-scrollable " role="document">

                            <div className="modal-content">
                                <form
                                    method="post"
                                    id="myAwesomeDropzone"
                                    data-plugin="dropzone"
                                    data-previews-container="#file-previews"
                                    data-upload-preview-template="#uploadPreviewTemplate"
                                    data-parsley-validate
                                    onSubmit={(e) => submitUpdateHotelVerification(e)}
                                    style={{ textAlign: "left" }}
                                >
                                    <div className="modal-header bg-dark text-light">
                                        <h5 className="modal-title">Xác Minh Khách Sạn</h5>

                                        <button
                                            type="button"
                                            className="close text-light"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                            onClick={closeModalUpdateHotelVerification}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    {/* Display error message */}
                                    {showSuccess && Object.entries(success).length > 0 && (
                                        <div className="success-messages" style={{
                                            position: 'absolute',
                                            top: '10px', right: '10px', background: 'green', color: 'white',
                                            padding: '10px', borderRadius: '5px', zIndex: 1002
                                        }}>
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

                                    {/* Modal Body with scrollable content */}
                                    <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>

                                        {/* Form Fields */}
                                        <div className="form-row">
                                            <div className="col-md-12">
                                                <table className="table table-responsive table-hover mt-3">
                                                    <tbody>
                                                        <tr>
                                                            <th>Trạng Thái:</th>
                                                            <td>
                                                                <select
                                                                    name="verificationStatus"
                                                                    className="form-control"
                                                                    value={updateHotelVerification.verificationStatus}
                                                                    onChange={(e) => handleInputChangeHotelVerification(e)}
                                                                    required
                                                                >
                                                                    <option value="">Chọn Trạng Thái</option>
                                                                    <option key="verified" value="Verified">
                                                                        Đã xác minh
                                                                    </option>
                                                                    <option key="rejected" value="Rejected">
                                                                        Từ chối
                                                                    </option>
                                                                </select>
                                                            </td>



                                                        </tr>
                                                        <tr>
                                                            <th>Ghi Chú:</th>
                                                            <td>
                                                                <ReactQuill
                                                                    theme="snow"
                                                                    value={updateHotelVerification.notes}
                                                                    onChange={handleNoteChange}
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
                                                                    style={{ height: '300px', marginBottom: '50px' }}

                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-custom btn-sm"><i class="fa fa-floppy-o" aria-hidden="true"></i> Lưu</button>
                                        <button type="button" className="btn btn-dark btn-sm" onClick={closeModalUpdateHotelVerification}>Đóng</button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div >

                )
            }
            {showImageLargerModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Hình Ảnh</h5>
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
                                <button type="button" className="btn btn-dark btn-sm" onClick={handleCloseImageLargeModal} >Đóng</button>
                            </div>
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

export default ListHotelVerification