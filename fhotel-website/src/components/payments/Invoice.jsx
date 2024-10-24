import React, { useEffect, useState } from 'react';
import transactionService from '../../services/transaction.service';
import { Link, useNavigate, useParams } from "react-router-dom";
import courseService from '../../services/course.service';
import accountService from '../../services/account.service';
import learnerService from '../../services/learner.service';

const Invoice = () => {
   

    const { transactionId } = useParams();

    const [transaction, setTransaction] = useState({
        id: "",
        paymentMethodId: "",
        amount: "",
        status: "",
        transactionDate: "",
        learnerId: "",
        courseId: "",
        learner: [],
        course: []
    });

    const [course, setCourse] = useState({
        name: "",
        description: "",
        code: "",
        imageUrl: "",
        stockPrice: "",
        isOnlineClass: "",
        categoryId: "",
        tags: "",
    });

    const [learner, setLearner] = useState({
        accountId: "",
    });

    const [account, setAccount] = useState({
        id: learner.accountId,
        name: "",
        email: "",
    });



    useEffect(() => {
        if (transactionId) {
            transactionService
                .getTransactionById(transactionId)
                .then((res) => {
                    setTransaction(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [transactionId]);


    useEffect(() => {
        if (transaction.courseId) {
            courseService
                .getCourseById(transaction.courseId)
                .then((res) => {
                    setCourse(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [transaction.courseId]);

    useEffect(() => {
        if (transaction.learnerId) {
            learnerService
                .getLearnerById(transaction.learnerId)
                .then((res) => {
                    setLearner(res.data);
                    // Check if accountId is available
                    if (res.data.accountId) {
                        accountService
                            .getAccountById(res.data.accountId)
                            .then((accountRes) => {
                                setAccount(accountRes.data);
                                console.log('Account Data:', accountRes.data);
                                const response = accountService.sendMail(res.data.accountId, {
                                    content: `
                                        <div class="container">
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <div class="card">
                                                        <div class="card-body">
                                                            <div class="invoice-title">
                                                                <h4 class="float-end font-size-15">Invoice #DS0204 <span class="badge bg-success font-size-12 ms-2">Paid</span></h4>
                                                                <div class="text-muted">
                                                                    <p class="mb-1">3184 Spruce Drive Pittsburgh, PA 15201</p>
                                                                    <p class="mb-1"><i class="uil uil-envelope-alt me-1" /> meowlish.com</p>
                                                                </div>
                                                            </div>
                                                            <hr class="my-4" />
                                                            <div class="row">
                                                                <div class="col-sm-6">
                                                                    <div class="text-muted">
                                                                        <h5 class="font-size-16 mb-3">Billed To:</h5>
                                                                        <h5 class="font-size-15 mb-2">${transaction.learner?.account?.fullName}</h5>
                                                                        <p class="mb-1">${transaction.learner?.account?.address}</p>
                                                                        <p class="mb-1">${transaction.learner?.account?.email}</p>
                                                                        <p>${transaction.learner?.account?.phoneNumber}</p>
                                                                    </div>
                                                                </div>
                                                                <div class="col-sm-6">
                                                                    <div class="text-muted text-sm-end">
                                                                        <div>
                                                                            <h5 class="font-size-15 mb-1">Invoice No:</h5>
                                                                            <p>#DZ0112</p>
                                                                        </div>
                                                                        <div class="mt-4">
                                                                            <h5 class="font-size-15 mb-1">Invoice Date:</h5>
                                                                            <p>${transaction.transactionDate}</p>
                                                                        </div>
                                                                        <div class="mt-4">
                                                                            <h5 class="font-size-15 mb-1">Transaction No:</h5>
                                                                            <p>${transaction.id}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="py-2">
                                                                <h5 class="font-size-15">Transaction Summary</h5>
                                                                <div class="table-responsive">
                                                                    <table class="table align-middle table-nowrap table-centered mb-0">
                                                                        <thead>
                                                                            <tr>
                                                                                <th style="width: 70">No.</th>
                                                                                <th>Image</th>
                                                                                <th>Item</th>
                                                                                <th>Price</th>
                                                                                <th>Quantity</th>
                                                                                <th class="text-end" style="width: 120">Total</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <th scope="row">01</th>
                                                                                <td>
                                                                                    <img src=${transaction.course?.imageUrl} style="height: 50px; width: 80px;"></img>
                                                                                </td>
                                                                                <td>
                                                                                    <div>
                                                                                        <h5 class="text-truncate font-size-14 mb-1">${transaction.course?.name}</h5>
                                                                                        <p class="text-muted mb-0">${transaction.course?.code}</p>
                                                                                    </div>
                                                                                </td>
                                                                                <td>$ ${transaction.course?.stockPrice}</td>
                                                                                <td>1</td>
                                                                                <td class="text-end">$ ${transaction.course?.stockPrice}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th scope="row" colspan="4" class="border-0 text-end">Total</th>
                                                                                <td class="border-0 text-end"><h4 class="m-0 fw-semibold"> ${transaction.amount / 24000} Dollars</h4></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                                <div class="d-print-none mt-4">
                                                                    <div class="float-end">
                                                                        <a href="javascript:window.print()" class="btn btn-success me-1"><i class="fa fa-print"></i></a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <style>
                                            body { margin-top: 20px; background-color: #eee; }
                                            .card { box-shadow: 0 20px 27px 0 rgb(0 0 0 / 5%); }
                                            .card { position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 0 solid rgba(0,0,0,.125); border-radius: 1rem; }
                                        </style>
                                    `,
                                });
                                console.log(response.data);


                            })
                            .catch((accountError) => {
                                console.log(accountError);
                            });
                    } else {
                        // Handle the case where accountId is not available
                        console.log('Learner does not have an accountId');
                    }
                    console.log('Learner Data:', res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        if (transaction.learnerId && transaction.courseId === null) {
            learnerService
                .getLearnerById(transaction.learnerId)
                .then((res) => {
                    setLearner(res.data);
                    // Check if accountId is available
                    if (res.data.accountId) {
                        accountService
                            .getAccountById(res.data.accountId)
                            .then((accountRes) => {
                                setAccount(accountRes.data);
                                console.log('Account Data:', accountRes.data);
                                const response = accountService.sendMail(res.data.accountId, {
                                    content: `
                                        <div class="container">
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <div class="card">
                                                        <div class="card-body">
                                                            <div class="invoice-title">
                                                                <h4 class="float-end font-size-15">Invoice #DS0204 <span class="badge bg-success font-size-12 ms-2">Paid</span></h4>
                                                                <div class="text-muted">
                                                                    <p class="mb-1">3184 Spruce Drive Pittsburgh, PA 15201</p>
                                                                    <p class="mb-1"><i class="uil uil-envelope-alt me-1" /> meowlish.com</p>
                                                                </div>
                                                            </div>
                                                            <hr class="my-4" />
                                                            <div class="row">
                                                                <div class="col-sm-6">
                                                                    <div class="text-muted">
                                                                         <h5 class="font-size-16 mb-3">Billed To:</h5>
                                                                         <h5 class="font-size-15 mb-2">${transaction.learner?.account?.fullName}</h5>
                                                                         <p class="mb-1">${transaction.learner?.account?.address}</p>
                                                                         <p class="mb-1">${transaction.learner?.account?.email}</p>
                                                                         <p>${transaction.learner?.account?.phoneNumber}</p>
                                                                    </div>
                                                                </div>
                                                                <div class="col-sm-6">
                                                                    <div class="text-muted text-sm-end">
                                                                        <div>
                                                                            <h5 class="font-size-15 mb-1">Invoice No:</h5>
                                                                            <p>#DZ0112</p>
                                                                        </div>
                                                                        <div class="mt-4">
                                                                            <h5 class="font-size-15 mb-1">Invoice Date:</h5>
                                                                            <p>${transaction.transactionDate}</p>
                                                                        </div>
                                                                        <div class="mt-4">
                                                                            <h5 class="font-size-15 mb-1">Transaction No:</h5>
                                                                            <p>${transaction.id}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="py-2">
                                                                <h5 class="font-size-15">Transaction Summary</h5>
                                                                <div class="table-responsive">
                                                                    <table class="table align-middle table-nowrap table-centered mb-0">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Quantity</th>
                                                                                <th class="text-end" style="width: 120">Total</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            
                                                                            <tr>
                                                                                <td scope="row" colspan="4" class="border-0 text-end">1</td>
                                                                                <td class="border-0 text-end"><h4 class="m-0 fw-semibold"> ${transaction.amount / 24000} Dollars</h4></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                                <div class="d-print-none mt-4">
                                                                    <div class="float-end">
                                                                        <a href="javascript:window.print()" class="btn btn-success me-1"><i class="fa fa-print"></i></a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <style>
                                            body { margin-top: 20px; background-color: #eee; }
                                            .card { box-shadow: 0 20px 27px 0 rgb(0 0 0 / 5%); }
                                            .card { position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 0 solid rgba(0,0,0,.125); border-radius: 1rem; }
                                        </style>
                                    `,
                                });
                                console.log(response.data);


                            })
                            .catch((accountError) => {
                                console.log(accountError);
                            });
                    } else {
                        // Handle the case where accountId is not available
                        console.log('Learner does not have an accountId');
                    }
                    console.log('Learner Data:', res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [transaction.learnerId]);




    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="invoice-title">
                                    <h4 className="float-end font-size-15">Invoice #DS0204 <span className="badge bg-success font-size-12 ms-2">Paid</span></h4>

                                    <div className="text-muted">
                                        <p className="mb-1">3184 Spruce Drive Pittsburgh, PA 15201</p>
                                        <p className="mb-1"><i className="uil uil-envelope-alt me-1" /> meowlish.com</p>
                                    </div>
                                </div>
                                <hr className="my-4" />
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="text-muted">
                                            <h5 className="font-size-16 mb-3">Billed To:</h5>
                                            <h5 className="font-size-15 mb-2">{account.fullName}</h5>
                                            <p className="mb-1">{account.address}</p>
                                            <p className="mb-1">{account.email}</p>
                                            <p>{account.phoneNumber}</p>
                                        </div>
                                    </div>
                                    {/* end col */}
                                    <div className="col-sm-6">
                                        <div className="text-muted text-sm-end">
                                            <div>
                                                <h5 className="font-size-15 mb-1">Invoice No:</h5>
                                                <p>#DZ0112</p>
                                            </div>
                                            <div className="mt-4">
                                                <h5 className="font-size-15 mb-1">Invoice Date:</h5>
                                                <p>{transaction.transactionDate}</p>
                                            </div>
                                            <div className="mt-4">
                                                <h5 className="font-size-15 mb-1">Transaction No:</h5>
                                                <p>{transaction.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* end col */}
                                </div>
                                {/* end row */}
                                {
                                    transaction.courseId !== null && (
                                        <>
                                            <div className="py-2">
                                                <h5 className="font-size-15">Transaction Summary</h5>
                                                <div className="table-responsive">
                                                    <table className="table align-middle table-nowrap table-centered mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: 70 }}>No.</th>
                                                                <th>Image</th>
                                                                <th>Item</th>
                                                                <th>Price</th>
                                                                <th>Quantity</th>
                                                                <th className="text-end" style={{ width: 120 }}>Total</th>
                                                            </tr>
                                                        </thead>{/* end thead */}
                                                        <tbody>
                                                            <tr>
                                                                <th scope="row">01</th>
                                                                <td>
                                                                    <img src={course.imageUrl} style={{ height: '50px', width: '80px' }}></img>
                                                                </td>
                                                                <td>
                                                                    <div>
                                                                        <h5 className="text-truncate font-size-14 mb-1">{course.name}</h5>
                                                                        <p className="text-muted mb-0">{course.code}</p>
                                                                    </div>
                                                                </td>
                                                                <td>$ {course.stockPrice}</td>
                                                                <td>1</td>
                                                                <td className="text-end">$ {course.stockPrice}</td>
                                                            </tr>
                                                            {/* end tr */}


                                                            <tr>
                                                                <th scope="row" colSpan={4} className="border-0 text-end">Total</th>
                                                                <td className="border-0 text-end"><h4 className="m-0 fw-semibold">{transaction.amount / 24000} dollars</h4></td>
                                                            </tr>
                                                            {/* end tr */}
                                                        </tbody>{/* end tbody */}
                                                    </table>{/* end table */}
                                                </div>{/* end table responsive */}
                                                <div className="d-print-none mt-4">
                                                    <div className="float-end">
                                                        <a href="javascript:window.print()" className="btn btn-success me-1"><i className="fa fa-print" /></a>
                                                        {/* <a href="#" className="btn btn-primary w-md">Send</a> */}
                                                    </div>
                                                </div>
                                            </div>

                                        </>
                                    )
                                }

                                {
                                    transaction.courseId === null && (
                                        <>
                                            <div className="py-2">
                                                <h5 className="font-size-15">Transaction Summary</h5>
                                                <div className="table-responsive">
                                                    <table className="table align-middle table-nowrap table-centered mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: 70 }}>No.</th>
                                                                <th>Item</th>
                                                                <th>Price</th>
                                                                <th>Quantity</th>
                                                                <th className="text-end" style={{ width: 120 }}>Total</th>
                                                            </tr>
                                                        </thead>{/* end thead */}
                                                        <tbody>
                                                            <tr>
                                                                <th scope="row">01</th>
                                                                <td>
                                                                    <div>
                                                                        <h5 className="text-truncate font-size-14 mb-1">VNPay</h5>
                                                                    </div>
                                                                </td>
                                                                <td>$ {transaction.amount / 24000}</td>
                                                                <td>1</td>
                                                                <td className="text-end">$ {transaction.amount / 24000}</td>
                                                            </tr>
                                                            {/* end tr */}


                                                            <tr>
                                                                <th scope="row" colSpan={4} className="border-0 text-end">Total</th>
                                                                <td className="border-0 text-end"><h4 className="m-0 fw-semibold">{transaction.amount / 24000} dollars</h4></td>
                                                            </tr>
                                                            {/* end tr */}
                                                        </tbody>{/* end tbody */}
                                                    </table>{/* end table */}
                                                </div>{/* end table responsive */}
                                                <div className="d-print-none mt-4">
                                                    <div className="float-end">
                                                        <a href="javascript:window.print()" className="btn btn-success me-1"><i className="fa fa-print" /></a>
                                                        {/* <a href="#" className="btn btn-primary w-md">Send</a> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>{/* end col */}
                </div>
            </div>
            <style>
                {`
               body{margin-top:20px;
                background-color:#eee;
                }
                
                .card {
                    box-shadow: 0 20px 27px 0 rgb(0 0 0 / 5%);
                }
                .card {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    word-wrap: break-word;
                    background-color: #fff;
                    background-clip: border-box;
                    border: 0 solid rgba(0,0,0,.125);
                    border-radius: 1rem;
                }
            `}
            </style>
        </>
    )
}

export default Invoice