// import express from "express"

// import { loginUser,registerUser } from "../controllers/userController.js"


// const userRouter = express.Router()

// userRouter.post('/register',registerUser)
// userRouter.post("/login",loginUser)


// export default userRouter;
import express from "express";
import { 
    loginUser, 
    registerUser, 
    verifyOTP, 
    resendOTP 
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/verify-otp', verifyOTP);
userRouter.post('/resend-otp', resendOTP);

export default userRouter;