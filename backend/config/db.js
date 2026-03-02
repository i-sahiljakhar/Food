import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        
        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        console.log("📦 Connecting to MongoDB Atlas...");
        
        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('🔴 MongoDB disconnected');
        });

        await mongoose.connect(mongoURI);
        
    } catch (error) {
        console.error("❌ Database connection error:", error.message);
        process.exit(1);
    }
};