import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import reservationService from '../../services/reservation.service';

const PaymentCallBack = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [paymentDetails, setPaymentDetails] = useState({});
    const [reservation, setReservation] = useState({
    });





    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const paramsObject = {};

        try {
            queryParams.forEach((value, key) => {
                paramsObject[key] = value;
            });

            setPaymentDetails(paramsObject);

            const reservationId = paramsObject.vnp_OrderInfo;

            if (reservationId && paramsObject.vnp_ResponseCode === '00') {
                // Fetch reservation and update it with payment status
                reservationService.getReservationById(reservationId)
                    .then((response) => {
                        // Assuming response is in the correct format
                        const updatedReservation = {
                            ...response.data,
                            paymentStatus: "Paid"
                        };

                        console.log(JSON.stringify(updatedReservation))
                        // Attempt to update the reservation with new payment status
                        return reservationService.updateReservation(reservationId, updatedReservation);
                    })
                    .then((updateReservationResponse) => {
                        if (updateReservationResponse.status === 200) {
                            window.alert("THANH TOÁN THÀNH CÔNG");
                        }
                    })
                    .catch((error) => {
                        console.error("Error while updating reservation:", error);
                        window.alert("Có lỗi xảy ra trong quá trình cập nhật.");
                    });
            }
        } catch (error) {
            console.error("Error processing payment details:", error);
            window.alert("Có lỗi xảy ra khi xử lý thông tin thanh toán.");
        }

        // Cleanup function if needed
        return () => {
            // Perform cleanup tasks if any
        };
    }, [location.search]);


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