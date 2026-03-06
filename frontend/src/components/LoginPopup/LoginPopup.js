import React, { useState, useContext } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

function LoginPopup({ setShowLogin }) {
  const { url, setToken } = useContext(StoreContext);
  
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    // Clean the data
    const cleanData = {
      name: data.name?.trim(),
      email: data.email?.trim().toLowerCase(),
      password: data.password?.trim()
    };
    
    try {
      console.log("📤 Sending data:", cleanData);
      console.log("🔗 Base URL:", url);
      
      // Determine endpoint based on state
      const endpoint = currState === "Login" ? "login" : "register";
      const apiUrl = `${url}/api/user/${endpoint}`;
      
      console.log("🌐 Full API URL:", apiUrl);
      
      // Make the request
      const response = await axios({
        method: 'post',
        url: apiUrl,
        data: cleanData,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("✅ Response:", response.data);

      if (response.data.success) {
        // Save token
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        
        // Show success message
        alert(response.data.message || `${currState} successful!`);
        
        // Close popup
        setShowLogin(false);
        
        // Optional: reload page or redirect
        // window.location.reload();
      } else {
        alert(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("❌ Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method
      });

      // Handle specific errors
      if (error.response) {
        // Server responded with error status
        switch (error.response.status) {
          case 400:
            alert("Bad request: " + (error.response.data.message || "Please check your input"));
            break;
          case 401:
            alert("Unauthorized: Invalid email or password");
            break;
          case 404:
            alert("API endpoint not found. Check if server is running on " + url);
            break;
          case 405:
            alert("Method not allowed. Server pe ye endpoint exist nahi karta");
            console.log("🔧 Fix: Backend mein route check karo:", apiUrl);
            break;
          case 500:
            alert("Server error. Please try again later");
            break;
          default:
            alert(error.response.data.message || "Something went wrong!");
        }
      } else if (error.request) {
        // Request made but no response
        alert("Server not responding. Check if backend is running on " + url);
      } else {
        // Something else happened
        alert("Error: " + error.message);
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
              autoComplete="name"
            />
          )}

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
            autoComplete="email"
          />
          
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            minLength={8}
            type="password"
            placeholder="Password (min 8 characters)"
            required
            autoComplete={currState === "Login" ? "current-password" : "new-password"}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (
            <span>⏳ Please wait...</span>
          ) : (
            <span>{currState === "Sign Up" ? "✨ Create Account" : "🔑 Login"}</span>
          )}
        </button>
        
        <div className="login-popup-condition">
          <input type="checkbox" required id="terms" />
          <label htmlFor="terms">
            By continuing you agree to the terms of use & privacy policy
          </label>
        </div>
        
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span 
              onClick={() => setCurrState("Sign Up")}
              style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span 
              onClick={() => setCurrState("Login")}
              style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Login here
            </span>
          </p>
        )}
      </form>
    </div>
  );
}

export default LoginPopup;
