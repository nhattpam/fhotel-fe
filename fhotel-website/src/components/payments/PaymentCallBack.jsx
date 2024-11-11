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

    useEffect(() => {
        reservationService
            .getAllReservation()
            .then((res) => {
                setReservationList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
        billService
            .getAllBill()
            .then((res) => {
                setBillList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
        paymentMethodService
            .getAllPaymentMethod()
            .then((res) => {
                setPaymentMethodList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);




    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const paramsObject = {};

        try {
            queryParams.forEach((value, key) => {
                paramsObject[key] = value;
            });

            setPaymentDetails(paramsObject);

            const orderId = paramsObject.vnp_OrderInfo;

            if (orderId && paramsObject.vnp_ResponseCode === '00') {
                // Check if the orderId exists in reservations
                const matchingReservation = reservationList.find(reservation => reservation.reservationId === orderId);

                if (matchingReservation) {
                    // Update reservation payment status
                    const updatedReservation = {
                        ...matchingReservation,
                        paymentStatus: "Paid"
                    };

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
                    // Check if the orderId exists in bills
                    const matchingBill = billList.find(bill => bill.billId === orderId);

                    console.log(orderId)
                    if (matchingBill) {
                        // Update bill payment status
                        const updatedBill = {
                            ...matchingBill,
                            billStatus: "Paid",
                            lastUpdated: new Date()
                        };

                        // console.log(JSON.stringify(updatedBill))
                        billService.updateBill(orderId, updatedBill)
                            .then((updateResponse) => {
                                if (updateResponse.status === 200) {

                                    const paymentMethod = paymentMethodList.find(doc => doc.paymentMethodName === "VnPay");
                                    if (paymentMethod) {
                                        const paymentMethodId = paymentMethod.paymentMethodId;
                                        const createPayment = {
                                            billId: orderId,
                                            paymentMethodId: paymentMethodId,
                                            paymentStatus: "Done"
                                        }
                                        console.log(JSON.stringify(createPayment))
                                        paymentService.savePayment(createPayment)
                                            .then((response) => {
                                                if (response.status === 201) {
                                                    reservationService.getReservationById(matchingBill.reservationId)
                                                        .then((response) => {
                                                            //update reservation
                                                            const updatedReservation = {
                                                                ...response.data,
                                                                // reservationStatus: "CheckOut",
                                                                // actualCheckoutDate: new Date()
                                                                paymentStatus: "Paid"
                                                            };
                                                            reservationService.updateReservation(matchingBill.reservationId, updatedReservation)
                                                                .then((updateResponse) => {
                                                                    if (updateResponse.status === 200) {
                                                                        // window.alert("THANH TOÁN HÓA ĐƠN THÀNH CÔNG");
                                                                        navigate(`/success-payment`);
                                                                    }
                                                                })
                                                        })
                                                }
                                            }
                                            )
                                    }

                                }
                            })
                            .catch((error) => {
                                console.error("Error while updating bill:", error);
                                window.alert("Có lỗi xảy ra trong quá trình cập nhật hóa đơn.");
                            });
                    } else {
                        console.error("Order ID not found in reservations or bills:", orderId);
                        // window.alert("Không tìm thấy ID đặt phòng hoặc hóa đơn.");
                    }
                }
            }
        } catch (error) {
            console.error("Error processing payment details:", error);
            window.alert("Có lỗi xảy ra khi xử lý thông tin thanh toán.");
        }
    }, [location.search, reservationList, billList]);



    return (
        <div>
            <h2>PaymentCallBack</h2>
            <p>This component displays payment details:</p>
            <ul>
                {Object.entries(paymentDetails).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {value}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PaymentCallBack;