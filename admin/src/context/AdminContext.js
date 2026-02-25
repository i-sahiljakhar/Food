import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
    const [adminToken, setAdminToken] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const url = "http://localhost:5000";

    // Admin Login - Gets REAL JWT from backend
    const adminLogin = async (email, password) => {
        setLoading(true);
        try {
            console.log("📢 Attempting admin login with:", email);
            
            // Call backend for real token
            const response = await axios.post(url + "/api/admin/login", {
                email,
                password
            });

            console.log("📢 Backend response:", response.data);

            if (response.data.success) {
                const token = response.data.token;
                
                // Verify it's a real JWT (3 parts)
                const isJWT = token.split('.').length === 3;
                console.log("📢 Is JWT format?", isJWT);
                console.log("📢 Token preview:", token.substring(0, 30) + "...");
                
                if (!isJWT) {
                    throw new Error("❌ Backend did not return valid JWT");
                }

                // Save the REAL token
                setAdminToken(token);
                localStorage.setItem("adminToken", token);
                
                console.log("✅ Real JWT saved to localStorage");
                
                // Navigate to orders
                navigate("/orders");
                return { success: true };
            } else {
                return { 
                    success: false, 
                    message: response.data.message 
                };
            }
        } catch (error) {
            console.error("❌ Admin login error:", error);
            return { 
                success: false, 
                message: error.response?.data?.message || "Login failed" 
            };
        } finally {
            setLoading(false);
        }
    };

    // Check for existing token on load
    useEffect(() => {
        const checkExistingToken = () => {
            const token = localStorage.getItem("adminToken");
            
            if (!token) {
                console.log("📢 No token found");
                return;
            }

            console.log("📢 Found token in localStorage:", token.substring(0, 30) + "...");
            
            // Check if it's a real JWT (has 3 parts)
            const parts = token.split('.');
            console.log("📢 Token parts:", parts.length);
            
            if (parts.length === 3) {
                console.log("✅ Valid JWT format detected");
                setAdminToken(token);
            } else {
                console.log("❌ Invalid token format (not JWT), clearing...");
                localStorage.removeItem("adminToken");
                setAdminToken("");
            }
        };

        checkExistingToken();
    }, []); // Empty dependency array = run once on mount

    // Admin logout
    const adminLogout = () => {
        setAdminToken("");
        localStorage.removeItem("adminToken");
        navigate("/login");
    };

    const contextValue = {
        adminToken,
        adminLogin,
        adminLogout,
        loading,
        url
    };

    return (
        <AdminContext.Provider value={contextValue}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;