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

    try {

      const endpoint = currState === "Login" ? "login" : "register";

      const response = await axios.post(
        `${url}/api/user/${endpoint}`,
        data
      );

      if (response.data.success) {

        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);

      } else {
        alert(response.data.message);
      }

    } catch (error) {

      console.log(error);
      alert("Server Error");

    }

    setLoading(false);
  };

  return (
    <div className="login-popup">

      <form onSubmit={onLogin} className="login-popup-container">

        <div className="login-popup-title">
          <h2>{currState}</h2>

          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
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
            type="password"
            placeholder="Password"
            required
          />

        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : currState === "Sign Up" ? "Create Account" : "Login"}
        </button>

        <div className="login-popup-condition">

          <input type="checkbox" required />

          <p>
            By continuing you agree to the terms of use & privacy policy
          </p>

        </div>

        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>
              Click here
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>
              Login here
            </span>
          </p>
        )}

      </form>

    </div>
  );
}

export default LoginPopup;
