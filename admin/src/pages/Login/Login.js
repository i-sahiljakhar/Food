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
                {/* Left Panel - Branding */}
                {/* <div className="left-panel">
                    <div className="brand-header">
                        <div className="brand-logo">
                            <div className="logo-icon">🍅</div>
                            <div className="logo-text">
                                <h1>Tomato.</h1>
                                <p>Admin Panel</p>
                            </div>
                        </div>
                        <div className="badge">v2.0.0</div>
                    </div>

                    <div className="admin-nav">
                        <div className="nav-item active">
                            <span className="nav-icon">📊</span>
                            <div className="nav-text">
                                <h3>Dashboard</h3>
                                <p>Overview & Analytics</p>
                            </div>
                        </div>
                        <div className="nav-item">
                            <span className="nav-icon">➕</span>
                            <div className="nav-text">
                                <h3>Add Items</h3>
                                <p>Add new food items</p>
                            </div>
                        </div>
                        <div className="nav-item">
                            <span className="nav-icon">📋</span>
                            <div className="nav-text">
                                <h3>List Items</h3>
                                <p>Manage menu items</p>
                            </div>
                        </div>
                        <div className="nav-item">
                            <span className="nav-icon">📦</span>
                            <div className="nav-text">
                                <h3>Orders</h3>
                                <p>Track all orders</p>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-preview">
                        <h3 className="preview-title">Today's Overview</h3>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">💰</div>
                                <div className="stat-value">₹12,450</div>
                                <div className="stat-label">Revenue</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📦</div>
                                <div className="stat-value">45</div>
                                <div className="stat-label">Orders</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">👥</div>
                                <div className="stat-value">128</div>
                                <div className="stat-label">Customers</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⭐</div>
                                <div className="stat-value">4.8</div>
                                <div className="stat-label">Rating</div>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Right Panel - Login Form */}
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

                        {/* <div className="demo-section">
                            <div className="demo-title">
                                <span>🎯</span>
                                <span>Demo Credentials</span>
                            </div>
                            <div className="demo-credentials">
                                <div className="credential-row">
                                    <span className="credential-label">Email:</span>
                                    <span className="credential-value">admin@gmail.com</span>
                                    <button 
                                        className="copy-btn"
                                        onClick={() => copyToClipboard('admin@gmail.com')}
                                    >
                                        <span>📋</span> Copy
                                    </button>
                                </div>
                                <div className="credential-row">
                                    <span className="credential-label">Password:</span>
                                    <span className="credential-value">admin123</span>
                                    <button 
                                        className="copy-btn"
                                        onClick={() => copyToClipboard('admin123')}
                                    >
                                        <span>📋</span> Copy
                                    </button>
                                </div>
                            </div>
                            <p style={{ fontSize: '12px', color: '#808e9b', marginTop: '15px', textAlign: 'center' }}>
                                Use these credentials for demo access
                            </p>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;