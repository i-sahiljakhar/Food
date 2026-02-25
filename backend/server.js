// import express from "express";
// import cors from "cors";
// import { connectDB } from "./config/db.js";
// import foodRouter from "./routes/foodRoute.js";
// import userRouter from "./routes/userRoute.js";
// import 'dotenv/config'
// import cartRouter from "./routes/cartRoute.js";
// import orderRouter from "./routes/OrderRouter.js";


// import { debugAuth } from './middleware/debugAuth.js';

// // Test route
// app.post('/api/test-auth', debugAuth, (req, res) => {
//     res.json({ 
//         success: true, 
//         message: "Auth test route working",
//         headers: req.headers
//     });
// });

// const app = express();

// const port = process.env.PORT || 5000;


// app.use(express.json());
// app.use(cors());



// connectDB();

// app.use('/api/food',foodRouter)
// app.use("/images",express.static('uploads'))
// app.use('/api/user',userRouter)
// app.use('/api/cart',cartRouter)
// app.use("/api/order",orderRouter)




// app.get("/", (req, res) => {
//   res.send("API Working ");
// });


// app.listen(port, () => {
//      console.log(`Server Started on http://localhost:${port}`);
// })



import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/OrderRouter.js";
import { debugAuth } from './middleware/debugAuth.js';
import adminRouter from "./routes/adminRoute.js";

// ✅ SIRF EK BAAR dotenv import karo
import dotenv from 'dotenv';
dotenv.config();  // ✅ YAHI SAHI TARIKA HAI

// YA FIR (alternative) - ye bhi sahi hai:
// import 'dotenv/config';  // ✅ Isko use karo to dotenv.config() ki zaroorat nahi

console.log("📧 EMAIL_USER:", process.env.EMAIL_USER || "❌ NOT FOUND");
console.log("🔑 JWT_SECRET exists:", process.env.JWT_SECRET ? "✅ YES" : "❌ NO");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

// Database connection
connectDB();

// Static files
app.use("/images", express.static('uploads'));

// Test route
app.post('/api/test-auth', debugAuth, (req, res) => {
    res.json({ 
        success: true, 
        message: "Auth test route working",
        headers: req.headers
    });
});

// Routes
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use("/api/order", orderRouter);
app.use('/api/admin', adminRouter);

// Home route
app.get("/", (req, res) => {
    res.send("API Working");
});

// Server start
app.listen(port, () => {
    console.log(`🚀 Server Started on http://localhost:${port}`);
});