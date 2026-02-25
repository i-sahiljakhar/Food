// import React, { useContext, useEffect } from "react";
// import "./Verify.css";
// import axios from "axios";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { StoreContext } from "../../context/StoreContext";
// function Verify() {
//   const [searchParams] = useSearchParams();
//   const success = searchParams.get("success");
//   const orderId = searchParams.get("orderId");
//   const { url } = useContext(StoreContext);
//   const navigate = useNavigate();

//   const verifyPayment = async () => {
//     const response = await axios.post(url + "/api/order/verify", {
//       success,
//       orderId,
//     });
//     if (response.data.success) {
//       navigate("/myorders");
//     } else {
//       navigate("/");
//     }
//   };

//   useEffect(() => {
//     verifyPayment();
//   });
//   return (
//     <div className="verify">
//       <div className="spinner"></div>
//     </div>
//   );
// }

// export default Verify;









// import React, { useContext, useEffect } from "react";
// import "./Verify.css";
// import axios from "axios";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { StoreContext } from "../../context/StoreContext";
// import { useCallback } from "react";

// function Verify() {
//   const [searchParams] = useSearchParams();
//   const success = searchParams.get("success");
//   const orderId = searchParams.get("orderId");
//   const { url } = useContext(StoreContext);
//   const navigate = useNavigate();

//   const verifyPayment = useCallback( async () => {
//     try {
//       const response = await axios.post(url + "/api/order/verify", {
//         success,
//         orderId,
//       });
      
//       if (response.data.success) {
//         navigate("/myorders");
//       } else {
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Verification error:", error);
//       navigate("/");
//     }
//   },[])

//   useEffect(() => {
//     verifyPayment();
//   }, []);

//   return (
//     <div className="verify">
//       <div className="spinner"></div>
//     </div>
//   );
// }

// export default Verify;


import React, { useContext, useEffect, useCallback } from "react";
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

  
  const verifyPayment = useCallback(async () => {
    try {
      const response = await axios.post(url + "/api/order/verify", {
        success,
        orderId,
      });
      
      if (response.data.success) {
        navigate("/myorders");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Verification error:", error);
      navigate("/");
    }
  }, [success, orderId, url, navigate]); 

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
}

export default Verify;