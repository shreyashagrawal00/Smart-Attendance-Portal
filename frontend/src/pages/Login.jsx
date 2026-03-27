import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, Lock, GraduationCap, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass">
                <div className="auth-logo">
                    <div className="logo-icon-box">
                        <GraduationCap size={28} />
                    </div>
                    <div>
                        <h1>Welcome back</h1>
                        <p>Sign in to your SmartAttend account</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="auth-error">
                            <span>⚠</span> {error}
                        </div>
                    )}

                    <div className="field-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="field-input-wrap">
                            <Mail className="field-icon" size={17} />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@school.com"
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="field-group">
                        <div className="field-label-row">
                            <label htmlFor="password">Password</label>
                            <Link to="/forgot-password" className="forgot-link" title="Feature coming soon">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="field-input-wrap">
                            <Lock className="field-icon" size={17} />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="eye-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                        {!loading && <ArrowRight size={18} />}
                    </button>

                    <p className="auth-switch">
                        Don't have an account?&nbsp;
                        <Link to="/register">Create Account</Link>
                    </p>
                </form>
            </div>

            <style>{`
                .auth-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-main);
                    padding: 2rem 1rem;
                }
                .auth-card {
                    width: 100%;
                    max-width: 420px;
                    padding: 2.5rem;
                    border-radius: var(--radius-xl);
                }
                .auth-logo {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid var(--border);
                }
                .logo-icon-box {
                    width: 50px;
                    height: 50px;
                    flex-shrink: 0;
                    background: var(--primary);
                    color: white;
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 6px 16px rgba(75, 107, 80, 0.25);
                }
                .auth-logo h1 {
                    font-size: 1.375rem;
                    margin-bottom: 2px;
                    color: var(--text-main);
                }
                .auth-logo p {
                    font-size: 0.82rem;
                    color: var(--text-muted);
                }
                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                .auth-error {
                    background: var(--danger-bg);
                    color: var(--danger);
                    padding: 0.75rem 1rem;
                    border-radius: var(--radius-sm);
                    font-size: 0.875rem;
                    border: 1px solid rgba(185, 28, 28, 0.15);
                    display: flex;
                    gap: 8px;
                    align-items: flex-start;
                }
                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }
                .field-group label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-main);
                }
                .field-label-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .forgot-link {
                    font-size: 0.8rem;
                    color: var(--primary);
                    font-weight: 500;
                }
                .forgot-link:hover { text-decoration: underline; }
                .field-input-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .field-icon {
                    position: absolute;
                    left: 0.9rem;
                    color: var(--text-muted);
                    pointer-events: none;
                }
                .field-input-wrap input {
                    width: 100%;
                    padding: 0.8rem 2.8rem 0.8rem 2.6rem;
                    border: 1.5px solid var(--border);
                    border-radius: var(--radius-md);
                    font-size: 0.9rem;
                    background: white;
                    color: var(--text-main);
                    font-family: inherit;
                    transition: all 0.2s;
                }
                .field-input-wrap input::placeholder { color: var(--text-muted); opacity: 0.7; }
                .field-input-wrap input:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(75, 107, 80, 0.1);
                }
                .eye-toggle {
                    position: absolute;
                    right: 0.9rem;
                    background: transparent;
                    color: var(--text-muted);
                    padding: 4px;
                    display: flex;
                    border-radius: 4px;
                }
                .eye-toggle:hover { color: var(--primary); }
                .auth-submit-btn {
                    margin-top: 0.25rem;
                    width: 100%;
                }
                .auth-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
                .auth-switch {
                    text-align: center;
                    font-size: 0.875rem;
                    color: var(--text-muted);
                }
                .auth-switch a {
                    color: var(--primary);
                    font-weight: 600;
                }
                .auth-switch a:hover { text-decoration: underline; }
            `}</style>
        </div>
    );
};

export default Login;
