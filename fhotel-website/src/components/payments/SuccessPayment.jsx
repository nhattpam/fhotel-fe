import React from 'react'

const SuccessPayment = () => {
    const paymentTime = new Date().toLocaleString();

    return (
        
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="message-box _success">
                            <i className="fa fa-check-circle" aria-hidden="true" />
                            <h2> Thanh toán thành công </h2>
                            <p>Giờ thanh toán: {paymentTime}</p>
                        </div>
                    </div>
                </div>
            </div>
        <style>
            {`
            ._failed{ border-bottom: solid 4px red !important; }
._failed i{  color:red !important;  }

._success {
    box-shadow: 0 15px 25px #00000019;
    padding: 45px;
    width: 100%;
    text-align: center;
    margin: 40px auto;
    border-bottom: solid 4px #28a745;
}

._success i {
    font-size: 55px;
    color: #28a745;
}

._success h2 {
    margin-bottom: 12px;
    font-size: 40px;
    font-weight: 500;
    line-height: 1.2;
    margin-top: 10px;
}

._success p {
    margin-bottom: 0px;
    font-size: 18px;
    color: #495057;
    font-weight: 500;
}
            `}
        </style>
        </>
    )
}

export default SuccessPayment