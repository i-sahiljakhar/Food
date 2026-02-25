
// import express from "express";
// import authMiddleware from "../middleware/auth.js";
// import {
//   placeOrder,
//   verifyOrder,
//   userOrders,
//   listOrders,
//   updateStatus,
// } from "../controllers/orderController.js";

// const orderRouter = express.Router();


// orderRouter.post("/place", authMiddleware, placeOrder);
// orderRouter.post("/userorders", authMiddleware, userOrders);


// orderRouter.post("/verify", verifyOrder);


// orderRouter.get("/list", authMiddleware, listOrders);
// orderRouter.post("/status", authMiddleware, updateStatus);

// export default orderRouter;


import express from "express";
import authMiddleware from "../middleware/auth.js";
import { debugAuth } from '../middleware/debugAuth.js'; // ✅ Import karo
import {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// ✅ Debug auth lagao
orderRouter.post("/place", debugAuth, authMiddleware, placeOrder);
orderRouter.post("/userorders", debugAuth, authMiddleware, userOrders);
orderRouter.get("/list", debugAuth, authMiddleware, listOrders);
orderRouter.post("/status", debugAuth, authMiddleware, updateStatus);
orderRouter.post("/verify", verifyOrder); // Isme auth nahi chahiye

export default orderRouter;