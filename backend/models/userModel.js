


// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true,
//         trim: true
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 8
//     },
//     cartData: {
//         type: Map,
//         of: Number,
//         default: {}
//     },
//     role: {
//         type: String,
//         enum: ['user', 'admin'],
//         default: 'user'
//     },
//     phone: {
//         type: String,
//         default: ''
//     },
//     address: {
//         street: String,
//         city: String,
//         state: String,
//         zipcode: String,
//         country: String
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// }, { minimize: false });

// // Update timestamp on save
// userSchema.pre('save', function(next) {
//     this.updatedAt = Date.now();
//     next();
// });

// const userModel = mongoose.models.user || mongoose.model("user", userSchema);
// export default userModel;


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    cartData: {
        type: Object,
        default: {}
    },
    // ✅ OTP Verification fields
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    }
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;



