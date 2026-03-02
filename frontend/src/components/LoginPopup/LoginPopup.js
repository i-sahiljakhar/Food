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

  // ✅ IMPORTANT: onLogin function ko async banana hoga
  const onLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    const cleanData = {
      name: data.name?.trim(),
      email: data.email?.trim().toLowerCase(),
      password: data.password?.trim()
    };
    
    try {
      console.log("📤 Sending data:", cleanData);
      
      // ✅ await sirf async function ke andar use karo
      const response = await axios.post(
        `${url}/api/user/${currState === "Login" ? "login" : "register"}`,
        cleanData
      );

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        alert(response.data.message || `${currState} successful!`);
        setShowLogin(false);
      } else {
        alert(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Rest of the component remains same
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
            placeholder="Password"
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
