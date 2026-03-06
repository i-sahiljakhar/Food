import React, { useState, useContext } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

function LoginPopup({ setShowLogin }) {
  // ✅ Context se url aur setToken le rahe hain
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
    
    const cleanData = {
      name: data.name?.trim(),
      email: data.email?.trim().toLowerCase(),
      password: data.password?.trim()
    };
    
    try {
      const endpoint = currState === "Login" ? "login" : "register";
      const apiUrl = `${url}/api/user/${endpoint}`;
      
      console.log("🌐 API URL:", apiUrl);
      console.log("📤 Data:", cleanData);
      
      const response = await axios.post(apiUrl, cleanData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        alert(`${currState} successful!`);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      
      // User-friendly error messages
      if (error.response) {
        switch (error.response.status) {
          case 400:
            alert("Please check your input: " + (error.response.data.message || "Invalid data"));
            break;
          case 401:
            alert("Invalid email or password");
            break;
          case 404:
            alert("Server endpoint not found. Please check backend connection.");
            break;
          case 500:
            alert("Server error. Please try again later.");
            break;
          default:
            alert(error.response.data?.message || "Something went wrong!");
        }
      } else if (error.request) {
        alert(`Cannot connect to server. Please check if backend is running at ${url}`);
      } else {
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
            type="password"
            placeholder="Password"
            required
            minLength={6}
            autoComplete={currState === "Login" ? "current-password" : "new-password"}
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? "⏳ Please wait..." : (currState === "Sign Up" ? "✨ Create Account" : "🔑 Login")}
        </button>
        
        <div className="login-popup-condition">
          <input type="checkbox" required id="terms" />
          <label htmlFor="terms">By continuing you agree to the terms of use & privacy policy</label>
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
