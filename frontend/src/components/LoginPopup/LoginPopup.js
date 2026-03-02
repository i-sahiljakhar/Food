

import React, { useState, useContext } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom"; // ✅ Import for navigation
import axios from "axios";

function LoginPopup({ setShowLogin }) {
  const { url, setToken } = useContext(StoreContext);
  const navigate = useNavigate(); // ✅ For OTP page navigation

// Debug line add karo
console.log("🔍 API URL:", url + "/api/user/login");

const response = await axios.post(
  `${url}/api/user/login`,  // ✅ POST request
  cleanData
);

  
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    // ✅ Trim data before sending
    const cleanData = {
      name: data.name?.trim(),
      email: data.email?.trim().toLowerCase(),
      password: data.password?.trim()
    };
    
    try {
      console.log("📤 Sending data:", cleanData);
      
      const response = await axios.post(
        `${url}/api/user/${currState === "Login" ? "login" : "register"}`,
        cleanData
      );

      console.log("📥 Response:", response.data);

      if (response.data.success) {
        if (response.data.token) {
          // ✅ Normal login/register with token
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          alert(response.data.message || `${currState} successful!`);
          setShowLogin(false);
        } else if (response.data.requiresOTP) {
          // ✅ Navigate to OTP verification page
          setShowLogin(false);
          navigate('/verify-otp', { 
            state: { 
              email: response.data.email || cleanData.email 
            } 
          });
        }
      } else {
        alert(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("❌ Full error:", error);
      
      if (error.response) {
        const errorData = error.response.data;
        
        // ✅ Check if OTP verification required
        if (errorData.requiresOTP) {
          setShowLogin(false);
          navigate('/verify-otp', { 
            state: { email: errorData.email || cleanData.email } 
          });
        } else {
          alert(`Error ${error.response.status}: ${errorData.message || 'Bad Request'}`);
        }
      } else if (error.request) {
        alert("No response from server. Check if backend is running on port 5000.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="close"
          />
        </div>
        
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            minLength={8}
            type="password"
            placeholder="Password (min 8 characters)"
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : (currState === "Sign Up" ? "Create Account" : "Login")}
        </button>
        
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing you agree to the terms of use & privacy policy</p>
        </div>
        
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
}

export default LoginPopup;
