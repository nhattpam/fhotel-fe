import React, { useEffect, useState } from 'react'
import Header from '../Header';
import SideBar from '../SideBar';
import ReactPaginate from 'react-paginate';
import { IconContext } from 'react-icons';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
import escrowWalletService from '../../services/escrow-wallet.service';

const EscrowWalletTransaction = () => {

    const [loading, setLoading] = useState(true); // State to track loading
    const [transactionList, setTransactionList] = useState([]);
    const [currentTransactionPage, setCurrentTransactionPage] = useState(0);
    const [transactionsPerPage] = useState(10);
    const [transactionSearchTerm, setTransactionSearchTerm] = useState('');
    
    useEffect(() => {
        escrowWalletService
            .getAllTransactionByEscrowWallet()
            .then((res) => {
                const sortedTransactionList = [...res.data].sort((a, b) => {
                    // Assuming requestedDate is a string in ISO 8601 format
                    return new Date(b.transactionDate) - new Date(a.transactionDate);
                  });
                  setTransactionList(sortedTransactionList);
                  setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
       
    }, []);
    const handleTransactionSearch = (event) => {
        setTransactionSearchTerm(event.target.value);
    };


    const filteredTransactions = transactionList
        .filter((transaction) => {
            return (
                transaction.description?.toString().toLowerCase().includes(transactionSearchTerm.toLowerCase())
            );
        });

    const pageTransactionCount = Math.ceil(filteredTransactions.length / transactionsPerPage);

    const handleTransactionPageClick = (data) => {
        setCurrentTransactionPage(data.selected);
    };

    const offsetTransaction = currentTransactionPage * transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(offsetTransaction, offsetTransaction + transactionsPerPage);

    const formatter = new Intl.NumberFormat('en-US');
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
                            <div className="ibox-title">Danh Sách Giao dịch</div>
                            <div className="form-group d-flex align-items-center">

                                <div className="search-bar ml-3">
                                    <i className="fa fa-search search-icon" aria-hidden="true"></i>
                                    <input
                                        id="demo-foo-search"
                                        type="text"
                                        placeholder="Tìm kiếm"
                                        className="form-control form-control-sm"
                                        autoComplete="on"
                                        value={transactionSearchTerm}
                                        onChange={handleTransactionSearch}
                                    />
                                </div>

                            </div>
                        </div>
                        <div className="ibox-body">
                            <div className="table-responsive">
                                <div className="table-responsive">
                                    <table className="table table-borderless table-hover table-wrap table-centered">
                                        <thead>
                                            <tr>
                                                <th><span>STT</span></th>
                                                <th><span>Số tiền (₫)</span></th>
                                                <th><span>Mô tả</span></th>
                                                <th><span>Ngày giao dịch</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                currentTransactions.length > 0 && currentTransactions.map((item, index) => (
                                                    <>
                                                        <tr>
                                                            <td>{index + 1}</td>
                                                            <td>{formatter.format(item.amount)}</td>
                                                            <td>{item.description}</td>
                                                            <td>{new Date(item.transactionDate).toLocaleString('en-US')}</td>

                                                        </tr>
                                                    </>
                                                ))
                                            }


                                        </tbody>
                                    </table>
                                    {
                                        currentTransactions.length === 0 && (
                                            <>
                                                <p className='text-center mt-2' style={{ fontStyle: 'italic', color: 'gray' }}>Không có</p>
                                            </>
                                        )
                                    }
                                </div>
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
                                pageCount={pageTransactionCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handleTransactionPageClick}
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
        </>
    )
}

export default EscrowWalletTransaction