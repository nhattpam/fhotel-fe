import React from 'react'

const SuccessRegister = () => {
    return (
      <div className="container mt-5">
        <div className="card text-center shadow-sm">
          <div className="card-body">
            <h1 className="card-title text-success">Welcome to FHotel!</h1>
            <p className="card-text">
              Thank you for registering. Your account has been successfully activated.
            </p>
            <p className="card-text">
              You can now log in and start using our services.
            </p>
            <a  style={{fontWeight: "bold"}}>Go back the App and Login</a>
          </div>
        </div>
      </div>
    );
  };
  
  export default SuccessRegister;