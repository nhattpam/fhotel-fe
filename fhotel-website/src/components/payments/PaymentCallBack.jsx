import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import reservationService from '../../services/reservation.service';
import billService from '../../services/bill.service';
import paymentService from '../../services/payment.service';
import paymentMethodService from '../../services/payment-method.service';

const PaymentCallBack = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [paymentDetails, setPaymentDetails] = useState({});
    const [reservation, setReservation] = useState({
    });

    const [billList, setBillList] = useState([]);
    const [reservationList, setReservationList] = useState([]);
    const [paymentMethodList, setPaymentMethodList] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

      // Fetch reservation, bill, and payment method data on mount
      useEffect(() => {
        Promise.all([
            reservationService.getAllReservation().then((res) => setReservationList(res.data)),
            billService.getAllBill().then((res) => setBillList(res.data)),
            paymentMethodService.getAllPaymentMethod().then((res) => setPaymentMethodList(res.data))
        ])
        .then(() => setDataLoaded(true))
        .catch((error) => console.log(error));
    }, []);




    // Handle payment callback logic once data is loaded
    useEffect(() => {
        if (!dataLoaded) {
            console.warn("Reservation or bill data not yet loaded");
            return; // Wait until data is loaded
        }

        const queryParams = new URLSearchParams(location.search);
        const paramsObject = {};

        try {
            queryParams.forEach((value, key) => {
                paramsObject[key] = value;
            });

            const orderId = paramsObject.vnp_OrderInfo;

            // Only proceed if orderId exists and response code is successful
            if (orderId && paramsObject.vnp_ResponseCode === '00') {
                const matchingReservation = reservationList.find(reservation => reservation.reservationId === orderId);

                if (matchingReservation) {
                    const updatedReservation = { ...matchingReservation, isPrePaid: true };
                    reservationService.updateReservation(orderId, updatedReservation)
                        .then((updateResponse) => {
                            if (updateResponse.status === 200) {
                                navigate(`/success-payment`);
                            }
                        })
                        .catch((error) => {
                            console.error("Error while updating reservation:", error);
                            window.alert("Có lỗi xảy ra trong quá trình cập nhật đặt phòng.");
                        });
                } else {
                    const matchingBill = billList.find(bill => bill.billId === orderId);

                    if (matchingBill) {
                        const updatedBill = { ...matchingBill, billStatus: "Paid", lastUpdated: new Date() };
                        billService.updateBill(orderId, updatedBill)
                            .then((updateResponse) => {
                                if (updateResponse.status === 200) {
                                    const paymentMethod = paymentMethodList.find(doc => doc.paymentMethodName === "VnPay");
                                    if (paymentMethod) {
                                        const createPayment = {
                                            billId: orderId,
                                            paymentMethodId: paymentMethod.paymentMethodId,
                                            paymentStatus: "Done"
                                        };
                                        paymentService.savePayment(createPayment)
                                            .then((response) => {
                                                if (response.status === 201) {
                                                    reservationService.getReservationById(matchingBill.reservationId)
                                                        .then((response) => {
                                                            const updatedReservation = { ...response.data, paymentStatus: "Paid" };
                                                            reservationService.updateReservation(matchingBill.reservationId, updatedReservation)
                                                                .then((updateResponse) => {
                                                                    if (updateResponse.status === 200) {
                                                                        navigate(`/success-payment`);
                                                                    }
                                                                });
                                                        });
                                                }
                                            });
                                    }
                                }
                            })
                            .catch((error) => {
                                console.error("Error while updating bill:", error);
                                window.alert("Có lỗi xảy ra trong quá trình cập nhật hóa đơn.");
                            });
                    } else {
                        console.error("Order ID not found in reservations or bills:", orderId);
                    }
                }
            }
        } catch (error) {
            console.error("Error processing payment details:", error);
            window.alert("Có lỗi xảy ra khi xử lý thông tin thanh toán.");
        }
    }, [dataLoaded, location.search, reservationList, billList]);
    



    return (
        <>
            <h2>Đang xử lý...</h2>
            <div className="spinner"></div> 
            <ul>
                {Object.entries(paymentDetails).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {value}
                    </li>
                ))}
            </ul>
            <style>
                {`
                     /* Add styling for the loading spinner */
        .spinner {
            border: 4px solid #f3f3f3; /* Light gray background */
            border-top: 4px solid #3498db; /* Blue color for the spinner */
            border-radius: 50%; /* Make it circular */
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite; /* Make it spin endlessly */
            margin: 20px auto; /* Center the spinner */
        }

        /* Define the spin animation */
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
                `}
            </style>
        </>
    );
};

export default PaymentCallBack;