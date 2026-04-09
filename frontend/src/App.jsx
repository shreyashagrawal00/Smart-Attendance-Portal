import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentManagement from './pages/StudentManagement';
import AttendanceMarking from './pages/AttendanceMarking';
import AttendanceRecords from './pages/AttendanceRecords';
import Analytics from './pages/Analytics';
import About from './pages/About';
import './index.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userInfo'));
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogin = useCallback(() => setIsAuthenticated(true), []);
    const handleLogout = useCallback(() => {
        localStorage.removeItem('userInfo');
        setIsAuthenticated(false);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <Router>
            <div className="app-container">
                {isAuthenticated && <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />}
                {isAuthenticated && isSidebarOpen && <div className="mobile-overlay" onClick={closeSidebar}></div>}
                <div className={isAuthenticated ? "main-content" : "full-content"}>
                    {isAuthenticated && <Navbar toggleSidebar={toggleSidebar} onLogout={handleLogout} />}
                    <div className="page-wrapper">
                        <Routes>
                            <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
                            <Route path="/register" element={!isAuthenticated ? <Register onLogin={handleLogin} /> : <Navigate to="/" />} />
                            <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                            <Route path="/students" element={isAuthenticated ? <StudentManagement /> : <Navigate to="/login" />} />
                            <Route path="/attendance" element={isAuthenticated ? <AttendanceMarking /> : <Navigate to="/login" />} />
                            <Route path="/records" element={isAuthenticated ? <AttendanceRecords /> : <Navigate to="/login" />} />
                            <Route path="/analytics" element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />} />
                            <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/login" />} />
                        </Routes>
                    </div>
                </div>
            </div>
            <style>{`
                .app-container {
                    display: flex;
                    min-height: 100vh;
                }
                .main-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    margin-left: calc(var(--sidebar-width) + 2.5rem);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .full-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                .page-wrapper {
                    padding: 0.5rem 2rem 2rem 0;
                    flex: 1;
                }
                .mobile-overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(46, 58, 47, 0.4);
                    backdrop-filter: blur(2px);
                    z-index: 999;
                }
                @media (max-width: 1024px) {
                    .main-content { margin-left: 0; }
                    .page-wrapper { padding: 1.5rem; }
                }
                @media (max-width: 768px) {
                    .page-wrapper {
                        padding: 1.25rem 1rem;
                    }
                    .mobile-overlay {
                        display: block;
                    }
                }
            `}</style>
        </Router>
    );
};

export default App;
