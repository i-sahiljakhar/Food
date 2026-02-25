





// import userModel from "../models/userModel.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import validator from "validator";

// const createToken = (id) => {
//     // Ensure JWT_SECRET exists
//     if (!process.env.JWT_SECRET) {
//         console.error("JWT_SECRET is not defined in environment variables");
//         throw new Error("JWT_SECRET not configured");
//     }


//     return jwt.sign(
//         { 
//             id: id,
//             iat: Math.floor(Date.now() / 1000) 
//         },
//         process.env.JWT_SECRET,
//         { 
//             expiresIn: '7d' 
//         }
//     );
// };

// const loginUser = async (req, res) => {
//     const { email, password } = req.body;
    
//     try {
     
//         if (!email || !password) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: "Email and password are required" 
//             });
//         }

//         const user = await userModel.findOne({ email });
        
//         if (!user) {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: "User doesn't exist" 
//             });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: "Invalid credentials" 
//             });
//         }

//         const token = createToken(user._id);
        
      
//         console.log("Token created for user:", user.email);
//         console.log("Token length:", token.length);

//         res.json({ 
//             success: true, 
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email
//             }
//         });

//     } catch (error) {
//         console.error("Login error:", error);
//         res.status(500).json({ 
//             success: false, 
//             message: "Server error during login" 
//         });
//     }
// };

// // Register user
// const registerUser = async (req, res) => {
//     const { name, password, email } = req.body;
    
//     try {
//         // Validation
//         if (!name || !email || !password) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: "All fields are required" 
//             });
//         }

//         // Check if user exists
//         const exists = await userModel.findOne({ email });
//         if (exists) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: "User already exists" 
//             });
//         }

//         // Validate email
//         if (!validator.isEmail(email)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please enter a valid email",
//             });
//         }

//         // Validate password
//         if (password.length < 8) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Password must be at least 8 characters",
//             });
//         }

//         // Hash password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create user
//         const newUser = new userModel({
//             name,
//             email,
//             password: hashedPassword,
//             cartData: {}
//         });

//         const user = await newUser.save();
        
//         // Create token
//         const token = createToken(user._id);

//         res.json({ 
//             success: true, 
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email
//             }
//         });

//     } catch (error) {
//         console.error("Registration error:", error);
//         res.status(500).json({ 
//             success: false, 
//             message: "Server error during registration" 
//         });
//     }
// };

// export { loginUser, registerUser };

import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import { sendOtpEmail, sendWelcomeEmail } from "../utils/emailService.js";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ✅ Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// ✅ REGISTER USER - Send OTP
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    
    try {
        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        // Check if user exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ 
                success: false, 
                message: "User already exists" 
            });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email",
            });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters",
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create user (unverified)
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            cartData: {},
            isVerified: false,
            otp: otp,
            otpExpires: otpExpires
        });

        await newUser.save();

        // Send OTP email
        const emailSent = await sendOtpEmail(email, name, otp);

        if (!emailSent) {
            await userModel.findByIdAndDelete(newUser._id);
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email. Please try again."
            });
        }

        res.status(201).json({
            success: true,
            message: "Registration successful! Please check your email for OTP.",
            requiresOTP: true,
            email: email
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error during registration" 
        });
    }
};

// ✅ VERIFY OTP
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified"
            });
        }

        // Check if OTP matches and not expired
        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }

        // Mark as verified
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        // Send welcome email
        await sendWelcomeEmail(user.email, user.name);

        // Create login token
        const token = createToken(user._id);

        res.json({
            success: true,
            message: "Email verified successfully!",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("OTP verification error:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying OTP"
        });
    }
};

// ✅ RESEND OTP
const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified"
            });
        }

        // Generate new OTP
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        // Send new OTP email
        await sendOtpEmail(user.email, user.name, otp);

        res.json({
            success: true,
            message: "New OTP sent to your email"
        });

    } catch (error) {
        console.error("Resend OTP error:", error);
        res.status(500).json({
            success: false,
            message: "Error resending OTP"
        });
    }
};

// ✅ LOGIN USER - Check if verified
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "User doesn't exist" 
            });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: "Please verify your email first",
                requiresOTP: true,
                email: user.email
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        const token = createToken(user._id);

        res.json({ 
            success: true, 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error during login" 
        });
    }
};

export { loginUser, registerUser, verifyOTP, resendOTP };