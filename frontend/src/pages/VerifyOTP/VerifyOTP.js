import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './VerifyOTP.css';

function VerifyOTP() {
    const location = useLocation();
    const navigate = useNavigate();
    const { url, setToken } = useContext(StoreContext);
    
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [timer, setTimer] = useState(600); // 10 minutes
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            navigate('/');
        }
    }, [location, navigate]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(`${url}/api/user/verify-otp`, {
                email,
                otp
            });

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                alert('✅ Email verified successfully!');
                navigate('/');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Verification failed');
        }
    };

    const handleResend = async () => {
        try {
            const response = await axios.post(`${url}/api/user/resend-otp`, {
                email
            });

            if (response.data.success) {
                setTimer(600);
                setCanResend(false);
                alert('📧 New OTP sent to your email!');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to resend OTP');
        }
    };

    return (
        <div className="otp-container">
            <div className="otp-card">
                <h2>Verify Your Email</h2>
                <p>We've sent a 6-digit OTP to</p>
                <p className="email-highlight">{email}</p>
                
                <form onSubmit={handleVerify}>
                    <input
                        type="text"
                        maxLength="6"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        required
                    />
                    
                    <div className="timer">
                        {timer > 0 ? (
                            <p>OTP expires in: {formatTime(timer)}</p>
                        ) : (
                            <p className="expired">OTP expired!</p>
                        )}
                    </div>
                    
                    <button type="submit" className="verify-btn">
                        Verify OTP
                    </button>
                </form>
                
                <div className="resend-section">
                    <button 
                        onClick={handleResend} 
                        disabled={!canResend}
                        className={`resend-btn ${!canResend ? 'disabled' : ''}`}
                    >
                        Resend OTP
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerifyOTP;