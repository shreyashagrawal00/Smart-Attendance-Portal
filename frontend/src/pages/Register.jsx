import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, Lock, User, GraduationCap, ArrowRight } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/register', { name, email, password, isAdmin: true });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass">
                <div className="login-header">
                    <div className="logo-box">
                        <GraduationCap size={40} />
                    </div>
                    <h1>Create Account</h1>
                    <p>Join the Smart Attendance Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-msg">{error}</div>}
                    
                    <div className="input-group">
                        <label>Full Name</label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={20} />
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                                required 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={20} />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@school.com"
                                required 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Account'}
                        <ArrowRight size={20} />
                    </button>
                    
                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    </div>
                </form>
            </div>

            <style>{`
                .login-container {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-main);
                    padding: 2rem;
                }
                .login-card {
                    width: 100%;
                    max-width: 450px;
                    padding: 2.5rem 3rem;
                    border-radius: 24px;
                    color: var(--text-main);
                }
                .login-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .logo-box {
                    width: 60px;
                    height: 60px;
                    background: var(--primary);
                    color: white;
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                    box-shadow: 0 10px 15px -3px rgba(109, 139, 116, 0.2);
                }
                .login-header h1 {
                    font-size: 1.75rem;
                    margin-bottom: 0.25rem;
                }
                .login-header p {
                    color: var(--secondary);
                }
                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                .input-group label {
                    display: block;
                    font-size: 0.85rem;
                    font-weight: 500;
                    margin-bottom: 0.4rem;
                }
                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .input-icon {
                    position: absolute;
                    left: 1rem;
                    color: var(--secondary);
                }
                .input-wrapper input {
                    width: 100%;
                    padding: 0.875rem 1rem 0.875rem 3rem;
                    border: 1.5px solid var(--border);
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: all 0.2s;
                    background: #ffffff;
                    color: var(--text-main);
                }
                .input-wrapper input:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px rgba(109, 139, 116, 0.1);
                }
                .login-btn {
                    background: var(--primary);
                    color: white;
                    padding: 0.875rem;
                    border-radius: 12px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 0.5rem;
                    transition: all 0.2s;
                }
                .login-btn:hover:not(:disabled) {
                    background: var(--primary-hover);
                    transform: translateY(-1px);
                }
                .login-btn:disabled { opacity: 0.7; }
                .error-msg {
                    background: rgba(239, 68, 68, 0.1);
                    color: var(--danger);
                    padding: 0.75rem;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }
                .auth-footer {
                    text-align: center;
                    margin-top: 0.5rem;
                    font-size: 0.9rem;
                    color: var(--secondary);
                }
                .auth-footer a {
                    color: var(--primary);
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
};

export default Register;
