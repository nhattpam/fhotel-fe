import React, { useEffect, useState } from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import refundPolicyService from '../../services/refund-policy.service';

const ListRefundPolicy = () => {

    const [refundPolicyList, setRefundPolicyList] = useState([]);
    const [refundPolicySearchTerm, setRefundPolicySearchTerm] = useState('');
    const [currentRefundPolicyPage, setCurrentRefundPolicyPage] = useState(0);
    const [refundPolicysPerPage] = useState(5);


    useEffect(() => {
        refundPolicyService
            .getAllRefundPolicy()
            .then((res) => {
                setRefundPolicyList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    const handleRefundPolicySearch = (event) => {
        setRefundPolicySearchTerm(event.target.value);
    };

    const filteredRefundPolicys = refundPolicyList
        .filter((refundPolicy) => {
            return (
                refundPolicy.cancellationTime.toString().toLowerCase().includes(refundPolicySearchTerm.toLowerCase()) ||
                refundPolicy.refundPercentage.toString().toLowerCase().includes(refundPolicySearchTerm.toLowerCase()) ||
                refundPolicy.description.toString().toLowerCase().includes(refundPolicySearchTerm.toLowerCase()) 
            );
        });

    const pageRefundPolicyCount = Math.ceil(filteredRefundPolicys.length / refundPolicysPerPage);

    const handleRefundPolicyPageClick = (data) => {
        setCurrentRefundPolicyPage(data.selected);
    };

    const offsetRefundPolicy = currentRefundPolicyPage * refundPolicysPerPage;
    const currentRefundPolicys = filteredRefundPolicys.slice(offsetRefundPolicy, offsetRefundPolicy + refundPolicysPerPage);



    //detail refundPolicy modal 
    const [showModalRefundPolicy, setShowModalRefundPolicy] = useState(false);

    const [refundPolicy, setRefundPolicy] = useState({

    });


    const openRefundPolicyModal = (refundPolicyId) => {
        setShowModalRefundPolicy(true);
        if (refundPolicyId) {
            refundPolicyService
                .getRefundPolicyById(refundPolicyId)
                .then((res) => {
                    setRefundPolicy(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const closeModalRefundPolicy = () => {
        setShowModalRefundPolicy(false);
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
                            <div className="ibox-title">List of Policies</div>
                            <div className="form-group">
                                <input id="demo-foo-search" type="text" placeholder="Search" className="form-control form-control-sm"
                                    autoComplete="on" value={refundPolicySearchTerm}
                                    onChange={handleRefundPolicySearch} />
                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Cancellation Time</th>
                                            <th>Refund Percentage</th>
                                            <th>Description</th>
                                            <th>Created Date</th>
                                            <th>Updated Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentRefundPolicys.length > 0 && currentRefundPolicys.map((item, index) => (
                                                <>
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{item.cancellationTime}</td>
                                                        <td>{item.refundPercentage} %</td>
                                                        <td>{item.description}</td>
                                                        <td>{item.createdDate}</td>
                                                        <td>{item.updatedDate}</td>
                                                       
                                                        <td>
                                                            <button className="btn btn-default btn-xs m-r-5" data-toggle="tooltip" data-original-title="Edit"><i className="fa fa-pencil font-14" onClick={() => openRefundPolicyModal(item.refundPolicyId)} /></button>
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
                                pageCount={pageRefundPolicyCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handleRefundPolicyPageClick}
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

            {showModalRefundPolicy && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(29, 29, 29, 0.75)' }}>
                    <div className="modal-dialog modal-dialog-scrollable custom-modal-xl" role="document">
                        <div className="modal-content">
                            <form>

                                <div className="modal-header">
                                    <h5 className="modal-title">Refund Policy Information</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalRefundPolicy}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <table className="table table-responsive table-hover mt-3">
                                                <tbody>
                                                    <tr>
                                                        <th style={{ width: '30%' }}>Cancellation Time:</th>
                                                        <td>{refundPolicy.cancellationTime}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Refund Percentage:</th>
                                                        <td>{refundPolicy.refundPercentage} %</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Description:</th>
                                                        <td>{refundPolicy.description}</td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>


                                </div>
                                <div className="modal-footer">
                                    {/* <button type="button" className="btn btn-custom">Save</button> */}
                                    <button type="button" className="btn btn-dark" onClick={closeModalRefundPolicy} >Close</button>
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

export default ListRefundPolicy