import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import lateCheckOutPolicyService from '../../services/late-check-out.service';

const ListLateCheckOutPolicy = () => {

    const [lateCheckOutPolicyList, setLateCheckOutPolicyList] = useState([]);
    const [lateCheckOutPolicySearchTerm, setLateCheckOutPolicySearchTerm] = useState('');
    const [currentLateCheckOutPolicyPage, setCurrentLateCheckOutPolicyPage] = useState(0);
    const [lateCheckOutPolicysPerPage] = useState(5);


    useEffect(() => {
        lateCheckOutPolicyService
            .getAllLateCheckOutPolicy()
            .then((res) => {
                setLateCheckOutPolicyList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    const handleLateCheckOutPolicySearch = (event) => {
        setLateCheckOutPolicySearchTerm(event.target.value);
    };

    const filteredLateCheckOutPolicys = lateCheckOutPolicyList
        .filter((lateCheckOutPolicy) => {
            return (
                lateCheckOutPolicy.description.toString().toLowerCase().includes(lateCheckOutPolicySearchTerm.toLowerCase()) ||
                lateCheckOutPolicy.chargePercentage.toString().toLowerCase().includes(lateCheckOutPolicySearchTerm.toLowerCase()) 
            );
        });

    const pageLateCheckOutPolicyCount = Math.ceil(filteredLateCheckOutPolicys.length / lateCheckOutPolicysPerPage);

    const handleLateCheckOutPolicyPageClick = (data) => {
        setCurrentLateCheckOutPolicyPage(data.selected);
    };

    const offsetLateCheckOutPolicy = currentLateCheckOutPolicyPage * lateCheckOutPolicysPerPage;
    const currentLateCheckOutPolicys = filteredLateCheckOutPolicys.slice(offsetLateCheckOutPolicy, offsetLateCheckOutPolicy + lateCheckOutPolicysPerPage);



    //detail lateCheckOutPolicy modal 
    const [showModalLateCheckOutPolicy, setShowModalLateCheckOutPolicy] = useState(false);

    const [lateCheckOutPolicy, setLateCheckOutPolicy] = useState({

    });


    const openLateCheckOutPolicyModal = (lateCheckOutPolicyId) => {
        setShowModalLateCheckOutPolicy(true);
        if (lateCheckOutPolicyId) {
            lateCheckOutPolicyService
                .getLateCheckOutPolicyById(lateCheckOutPolicyId)
                .then((res) => {
                    setLateCheckOutPolicy(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const closeModalLateCheckOutPolicy = () => {
        setShowModalLateCheckOutPolicy(false);
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
                            <div className="ibox-title">Chính Sách Trả Phòng Muộn</div>
                            <div className="form-group">
                                <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm"
                                    autoComplete="on" value={lateCheckOutPolicySearchTerm}
                                    onChange={handleLateCheckOutPolicySearch} />
                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>STT.</th>
                                            <th>Tỷ Lệ Phần Trăm Phí</th>
                                            <th>Mô Tả</th>
                                            <th>Ngày Tạo</th>
                                            <th>Ngày Cập Nhật</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentLateCheckOutPolicys.length > 0 && currentLateCheckOutPolicys.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.chargePercentage} %</td>
                                                        <td>{item.description}</td>
                                                        <td> {item.createdDate === null ? "None" : new Date(item.createdDate).toLocaleString('en-US')}</td>
                                                        <td> {item.updatedDate === null ? "None" : new Date(item.updatedDate).toLocaleString('en-US')}</td>
                                                       
                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit"><i className="fa fa-pencil font-14" onClick={() => openLateCheckOutPolicyModal(item.lateCheckOutPolicyId)} /></button>
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
                                pageCount={pageLateCheckOutPolicyCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handleLateCheckOutPolicyPageClick}
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

            {showModalLateCheckOutPolicy && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <form>

                                <div className="modal-header">
                                    <h5 className="modal-title">Refund Policy Information</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalLateCheckOutPolicy}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <table className="table table-responsive table-hover mt-3">
                                                <tbody>
                                                    <tr>
                                                        <th>Charge Percentage:</th>
                                                        <td>{lateCheckOutPolicy.chargePercentage} %</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Description:</th>
                                                        <td>{lateCheckOutPolicy.description}</td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>


                                </div>
                                <div className="modal-footer">
                                    {/* <button type="button" className="btn btn-custom">Save</button> */}
                                    <button type="button" className="btn btn-dark" onClick={closeModalLateCheckOutPolicy} >Close</button>
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
    max-width:30%;
    width: 30%;
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

export default ListLateCheckOutPolicy