import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, Lock, User, GraduationCap, ArrowRight, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

const Register = ({ onLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasLength = password.length >= 8;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!hasUppercase || !hasSpecial) {
            setError('Password must contain at least one uppercase letter and one special character.');
            setLoading(false);
            return;
        }

        try {
            const { data } = await api.post('/auth/register', { name, email, password, isAdmin: true });
            localStorage.setItem('userInfo', JSON.stringify(data));
            onLogin();
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating account');
        } finally {
            setLoading(false);
        }
    };

    const StrengthItem = ({ label, met }) => (
        <div className={`strength-item ${met ? 'met' : ''}`}>
            {met ? <CheckCircle size={13} /> : <XCircle size={13} />}
            <span>{label}</span>
        </div>
    );

    return (
        <div className="auth-page">
            <div className="auth-card glass">
                <div className="auth-logo">
                    <div className="logo-icon-box">
                        <GraduationCap size={28} />
                    </div>
                    <div>
                        <h1>Create Account</h1>
                        <p>Join the e-हाज़री portal</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="auth-error">
                            <span>⚠</span> {error}
                        </div>
                    )}

                    <div className="field-group">
                        <label htmlFor="reg-name">Full Name</label>
                        <div className="field-input-wrap">
                            <User className="field-icon" size={17} />
                            <input
                                id="reg-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                                required
                                autoComplete="name"
                            />
                        </div>
                    </div>

                    <div className="field-group">
                        <label htmlFor="reg-email">Email Address</label>
                        <div className="field-input-wrap">
                            <Mail className="field-icon" size={17} />
                            <input
                                id="reg-email"
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
                        <label htmlFor="reg-password">Password</label>
                        <div className="field-input-wrap">
                            <Lock className="field-icon" size={17} />
                            <input
                                id="reg-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a strong password"
                                required
                                autoComplete="new-password"
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
                        {password.length > 0 && (
                            <div className="strength-checklist">
                                <StrengthItem label="At least 8 characters" met={hasLength} />
                                <StrengthItem label="One uppercase letter (A–Z)" met={hasUppercase} />
                                <StrengthItem label="One special character (!@#$...)" met={hasSpecial} />
                            </div>
                        )}
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                        {!loading && <ArrowRight size={18} />}
                    </button>

                    <p className="auth-switch">
                        Already have an account?&nbsp;
                        <Link to="/login">Sign In</Link>
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
                .auth-logo p { font-size: 0.82rem; color: var(--text-muted); }
                .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
                .auth-error {
                    background: var(--danger-bg);
                    color: var(--danger);
                    padding: 0.75rem 1rem;
                    border-radius: var(--radius-sm);
                    font-size: 0.875rem;
                    border: 1px solid rgba(185, 28, 28, 0.15);
                    display: flex; gap: 8px; align-items: flex-start;
                }
                .field-group { display: flex; flex-direction: column; gap: 0.4rem; }
                .field-group label { font-size: 0.85rem; font-weight: 600; color: var(--text-main); }
                .field-input-wrap { position: relative; display: flex; align-items: center; }
                .field-icon { position: absolute; left: 0.9rem; color: var(--text-muted); pointer-events: none; }
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
                    position: absolute; right: 0.9rem;
                    background: transparent; color: var(--text-muted);
                    padding: 4px; display: flex; border-radius: 4px;
                }
                .eye-toggle:hover { color: var(--primary); }
                .strength-checklist {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    padding: 0.6rem 0.875rem;
                    background: var(--bg-subtle);
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                    margin-top: 4px;
                }
                .strength-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.78rem;
                    color: var(--danger);
                    font-weight: 600;
                }
                .strength-item.met { color: var(--success); }
                .auth-submit-btn {
                    margin-top: 0.25rem;
                    width: 100%;
                }
                .auth-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
                .auth-switch { text-align: center; font-size: 0.875rem; color: var(--text-muted); }
                .auth-switch a { color: var(--primary); font-weight: 600; }
                .auth-switch a:hover { text-decoration: underline; }
            `}</style>
        </div>
    );
};

export default Register;
