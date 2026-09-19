import React, { useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const { adminLogin, loading } = useContext(AdminContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const result = await adminLogin(email, password);
        
        if (!result.success) {
            setAlert({
                show: true,
                type: 'error',
                message: result.message || 'Invalid credentials'
            });
            
            setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setAlert({
            show: true,
            type: 'success',
            message: 'Copied to clipboard!'
        });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 2000);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="right-panel">
                    <div className="form-container">
                        <div className="form-header">
                            <h2>Welcome Back</h2>
                            <p>Please login to your account</p>
                        </div>

                        {alert.show && (
                            <div className={`alert-message ${alert.type}`}>
                                <span>{alert.type === 'error' ? '❌' : '✅'}</span>
                                {alert.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="input-group">
                                <span className="input-icon">📧</span>
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="input-group">
                                <span className="input-icon">🔒</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>

                            <div className="form-options">
                                <label className="remember-me">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span>Remember me</span>
                                </label>
                                <a href="#" className="forgot-link">Forgot password?</a>
                            </div>

                            <button 
                                type="submit" 
                                className="login-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Logging in...
                                    </>
                                ) : (
                                    <>
                                        <span>🔐</span>
                                        Login to Dashboard
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;