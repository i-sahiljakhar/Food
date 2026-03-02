import React, { useContext, useEffect } from "react";
import "./Verify.css";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

function Verify() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.post(url + "/api/order/verify", {
          success,
          orderId,
        });
        
        if (response.data.success) {
          // Payment successful
          setTimeout(() => {
            navigate("/myorders");
          }, 2000);
        } else {
          // Payment failed
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } catch (error) {
        console.error("Verification error:", error);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    };

    verifyPayment();
  }, [success, orderId, url, navigate]);

  return (
    <div className="verify">
      <div className="verify-container">
        <div className="spinner"></div>
        <p>Verifying your payment...</p>
        <p className="small">Please wait while we confirm your order</p>
      </div>
    </div>
  );
}

export default Verify;