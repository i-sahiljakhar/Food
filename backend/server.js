import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from './config/db.js';

import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/OrderRouter.js";
import adminRouter from "./routes/adminRoute.js";

dotenv.config();

console.log("EMAIL_USER:", process.env.EMAIL_USER || "NOT FOUND");
console.log(
    "JWT_SECRET exists:",
    process.env.JWT_SECRET ? "YES" : "NO"
);

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://food-theta-lovat.vercel.app"
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.options("*", cors());

// MongoDB Atlas Connection
connectDB();

// Images
app.use("/images", express.static("uploads"));

// Routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);

// Test API
app.get("/", (req, res) => {
    res.send("API Working");
});

// Start Server
app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});