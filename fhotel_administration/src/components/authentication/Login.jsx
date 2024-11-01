import React, { useState, useEffect } from 'react';
import userService from '../../services/user.service';
import { useNavigate, useParams } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format check
    const passwordMinLength = 6; // Define your password length requirement here

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const showErrorMessage = (message) => {
        setError(message);
        setShowNotification(true);

        // Hide the notification after 5 seconds
        setTimeout(() => {
            setShowNotification(false);
        }, 5000);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowNotification(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, [showNotification]);

    const handleLogin = async (e) => {
        e.preventDefault();

        // Check if fields are empty
        if (!email) {
            showErrorMessage('Email is required');
            return;
        }

        if (!password) {
            showErrorMessage('Password is required');
            return;
        }

        // Validate email format
        if (!emailRegex.test(email)) {
            showErrorMessage('Please enter a valid email address.');
            return;
        }

        // Check password length (you can add more complex validation like uppercase, numbers, etc.)
        if (password.length < passwordMinLength) {
            showErrorMessage(`Password must be at least ${passwordMinLength} characters long.`);
            return;
        }

        try {
            const response = await userService.loginUser(email, password);

            if (response.data.success) {
                const decodedToken = JSON.parse(atob(response.data.data.split('.')[1])); // Decoding the JWT token

                if (decodedToken.role.toString() === "Admin") {
                    sessionStorage.setItem('token', response.data.data);
                    sessionStorage.setItem('userId', decodedToken.Id);
                    // Navigate to the home page
                    navigate('/admin-home');
                }
                if (decodedToken.role.toString() === "Hotel Manager") {
                    sessionStorage.setItem('token', response.data.data);
                    sessionStorage.setItem('userId', decodedToken.Id);
                    // Navigate to the home page
                    navigate('/hotel-manager-home');
                }
                if (decodedToken.role.toString() === "Manager") {
                    sessionStorage.setItem('token', response.data.data);
                    sessionStorage.setItem('userId', decodedToken.Id);
                    // Navigate to the home page
                    navigate('/manager-home');
                }
                if (decodedToken.role.toString() === "Receptionist") {
                    sessionStorage.setItem('token', response.data.data);
                    sessionStorage.setItem('userId', decodedToken.Id);
                    // Navigate to the home page
                    navigate('/receptionist-home');
                }
                if (decodedToken.role.toString() === "Room Attendant") {
                    sessionStorage.setItem('token', response.data.data);
                    sessionStorage.setItem('userId', decodedToken.Id);
                    // Navigate to the home page
                    navigate('/room-status');
                }
                else {
                    showErrorMessage('Bạn không có quyền truy cập.');
                }
            } else {
                showErrorMessage('Đăng nhập không thành công. Vui lòng thử lại!');
            }
        } catch (error) {
            showErrorMessage('Đăng nhập không thành công. Vui lòng thử lại!');
        }
    };


    return (
        <>
            <div className="login-container">
                <div className="sidenav">
                    <div className="login-main-image">
                        <img src="/my_img/admin_login.jpg" alt="Welcome" className="welcome-image" />
                        <div className="centered-text">
                            <h2>FHOTEL System</h2>
                            <p>Đăng nhập để tiếp tục.</p>
                        </div>
                    </div>
                </div>
                <div className="main">
                    <div className="col-md-6 col-sm-12">
                        <div className="login-form" style={{ textAlign: 'left' }}>
                            <form onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Nhập địa chỉ email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mật Khẩu</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Nhập mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                {error && <div className="error-text">{error}</div>}
                                <button type="submit" className="btn btn-black">Đăng Nhập</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    
            <style>
                {`
                    body {
                        font-family: "Lato", sans-serif;
                    }
                    
                    .login-container {
                        display: flex;
                        height: 100vh;
                    }
                    
                    .main {
                        padding: 50px;
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    .sidenav {
                        width: 40%;
                        background-color: #000;
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                    }
                    
                    .login-main-image {
                        position: relative;
                        text-align: center;
                    }
    
                    .welcome-image {
                        max-width: 100%; 
                        height: 1500px;
                        display: block;
                    }
    
                    .centered-text {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        color: white;
                        text-align: center;
                    }
    
                    .centered-text h2 {
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
    
                    .centered-text p {
                        font-size: 18px;
                    }
    
                    .login-form {
                        width: 100%;
                        max-width: 400px;
                    }
    
                    .form-group label {
                        font-weight: bold;
                    }
    
                    .form-control {
                        margin-bottom: 15px;
                        padding: 10px;
                        font-size: 16px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                    }
    
                    .error-text {
                        color: red;
                        margin-bottom: 10px;
                    }
    
                    .btn-black {
                        background-color: #000;
                        color: white;
                        padding: 10px 15px;
                        border: none;
                        cursor: pointer;
                        transition: background-color 0.3s;
                        width: 100%;
                        margin-top: 10px;
                    }
    
                    .btn-black:hover {
                        background-color: #333;
                    }
    
                    @media screen and (max-width: 768px) {
                        .sidenav {
                            display: none;
                        }
    
                        .login-container {
                            justify-content: center;
                        }
                    }
                `}
            </style>
        </>
    );
    

};

export default Login;
