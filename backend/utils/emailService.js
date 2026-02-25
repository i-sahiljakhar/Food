import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS?.replace(/\s+/g, '')
    }
});

// ✅ Send OTP Email
export const sendOtpEmail = async (email, name, otp) => {
    console.log(`📧 Sending OTP to ${email}`);
    
    const mailOptions = {
        from: `"Food Delivery App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - OTP Verification',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #ff6b6b; text-align: center;">Welcome ${name}!</h2>
                <p style="font-size: 16px;">Thank you for signing up. Please verify your email address using the OTP below:</p>
                
                <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f5f5f5; border-radius: 10px;">
                    <h1 style="font-size: 48px; letter-spacing: 10px; color: #333; margin: 0;">${otp}</h1>
                </div>
                
                <p style="font-size: 14px; color: #666;">This OTP will expire in <strong>10 minutes</strong>.</p>
                
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                
                <p style="font-size: 12px; color: #999; text-align: center;">
                    If you didn't sign up for Food Delivery App, please ignore this email.
                </p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent to ${email}:`, info.messageId);
        return true;
    } catch (error) {
        console.error('❌ OTP email error:', error);
        return false;
    }
};

// ✅ Send Welcome Email
export const sendWelcomeEmail = async (email, name) => {
    const mailOptions = {
        from: `"Food Delivery App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to Food Delivery App!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #ff6b6b;">Welcome ${name}! 🎉</h2>
                <p>Your email has been verified successfully.</p>
                <p>Now you can:</p>
                <ul>
                    <li>✅ Browse our delicious menu</li>
                    <li>✅ Add items to cart</li>
                    <li>✅ Place orders</li>
                    <li>✅ Track your deliveries</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}" 
                       style="background-color: #ff6b6b; 
                              color: white; 
                              padding: 12px 30px; 
                              text-decoration: none; 
                              border-radius: 5px;
                              display: inline-block;">
                        Start Ordering
                    </a>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${email}`);
    } catch (error) {
        console.error('❌ Welcome email error:', error);
    }
};