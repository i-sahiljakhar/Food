



import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/OrderRouter.js";
import adminRouter from "./routes/adminRoute.js";
import dotenv from 'dotenv';
dotenv.config();

console.log("📧 EMAIL_USER:", process.env.EMAIL_USER || "❌ NOT FOUND");
console.log("🔑 JWT_SECRET exists:", process.env.JWT_SECRET ? "✅ YES" : "❌ NO");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

connectDB();

app.use("/images", express.static('uploads'));

// Routes
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use("/api/order", orderRouter);
app.use('/api/admin', adminRouter);

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`🚀 Server Started on http://localhost:${port}`);
});