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
    // const passwordMinLength = 6; // Define your password length requirement here

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
            showErrorMessage('Bạn chưa nhập email');
            return;
        }

        if (!password) {
            showErrorMessage('Bạn chưa nhập mật khẩu');
            return;
        }

        // Validate email format
        if (!emailRegex.test(email)) {
            showErrorMessage('Sai định dạng email.');
            return;
        }

        // Check password length (you can add more complex validation like uppercase, numbers, etc.)
        // if (password.length < passwordMinLength) {
        //     showErrorMessage(`Password must be at least ${passwordMinLength} characters long.`);
        //     return;
        // }

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
                <div className="centered-text">
                    <h2 style={{fontWeight: 'bold'}}>Hệ thống FHOTEL</h2>
                    {/* <p>Đăng nhập để tiếp tục.</p> */}
                </div>
                <div className="login-form">
                    <form onSubmit={handleLogin}>
                        <div className="form-group" style={{textAlign: 'left'}}>
                            <label className='text-primary' >Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Nhập địa chỉ email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group" style={{textAlign: 'left'}}>
                            <label className='text-primary'>Mật Khẩu</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <div className="error-text">{error}</div>}
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Đăng Nhập</button>
                    </form>
                </div>
            </div>

            <style>
                {`
        body {
            font-family: "Lato", sans-serif;
            margin: 0;
        }
        
        .login-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-image: url('/my_img/backgroundkkk.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            color: white;
            text-align: center;
            position: relative;
        }

        .centered-text {
            margin-bottom: 20px;
        }

        .login-form {
            background: rgba(255, 255, 255, 0.8); /* Semi-transparent background for the form */
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
            width: 90%;
            max-width: 400px;
        }

        .form-group label {
            font-weight: bold;
            color: #000;
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

        @media screen and (max-width: 768px) {
            .login-container {
                padding: 10px;
            }

            .login-form {
                width: 100%;
            }
        }
    `}
            </style>

        </>
    );


};

export default Login;
