import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../services/user.service";

const ProtectedRoute = ({ children, requiredRoles }) => {
    const navigate = useNavigate();
    const loginUserId = sessionStorage.getItem("userId");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!loginUserId) {
            // If no user ID in session, redirect to login
            navigate("/login");
            return;
        }

        // Fetch the user data
        userService
            .getUserById(loginUserId)
            .then((res) => {
                const user = res.data;
                if (requiredRoles &&
                    !requiredRoles.includes(user.role?.roleName)) {
                    sessionStorage.removeItem('authToken'); // Assuming you store authentication token in localStorage
                    sessionStorage.removeItem('userId');
                    navigate("/login"); // Redirect if role doesn't match
                } else {
                    setIsAuthorized(true); // User is authorized
                }
            })
            .catch((error) => {
                console.error(error);
                sessionStorage.removeItem('authToken'); // Assuming you store authentication token in localStorage
                sessionStorage.removeItem('userId');
                navigate("/login"); // Redirect on error

            })
            .finally(() => {
                setIsLoading(false); // Loading complete
            });
    }, [loginUserId, requiredRoles, navigate]);

    const spinnerStyle = {
        border: "4px solid #f3f3f3", // Light gray background
        borderTop: "4px solid #3498db", // Blue color for the spinner
        borderRadius: "50%", // Make it circular
        width: "50px",
        height: "50px",
        animation: "spin 1s linear infinite", // Make it spin endlessly
        margin: "20px auto", // Center the spinner
    };

    const spinAnimation = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;

      if (isLoading) {
        return (
          <div>
            <style>{spinAnimation}</style>
            <div style={spinnerStyle}></div>
          </div>
        );
      }

    return isAuthorized ? children : null; // Render children only if authorized

};

export default ProtectedRoute;
