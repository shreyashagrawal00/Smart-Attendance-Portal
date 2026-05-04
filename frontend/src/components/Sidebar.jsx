import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    CheckSquare, 
    History, 
    BarChart3, 
    LogOut,
    GraduationCap,
    Info,
    X
} from 'lucide-react';

const Sidebar = ({ isOpen, closeSidebar }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
        window.location.reload();
    };

    const navItems = [
        { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { path: '/students', name: 'Students', icon: <Users size={18} /> },
        { path: '/attendance', name: 'Mark Attendance', icon: <CheckSquare size={18} /> },
        { path: '/records', name: 'Records', icon: <History size={18} /> },
        { path: '/analytics', name: 'Analytics', icon: <BarChart3 size={18} /> },
        { path: '/about', name: 'About GLA', icon: <Info size={18} /> },
    ];

    return (
        <aside className={`sidebar glass ${isOpen ? 'open' : ''} slide-up`}>
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <div className="brand-logo">
                        <div className="brand-icon-wrap">
                            <GraduationCap size={22} />
                        </div>
                        <div className="brand-text-group">
                            <span className="brand-name">e-हाज़री</span>
                            <span className="brand-tagline">Smart Attendance Portal</span>
                        </div>
                    </div>
                    <button className="mobile-close-btn" onClick={closeSidebar}>
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="nav-section-label">NAVIGATION</div>

            <nav className="sidebar-nav custom-scrollbar">
                <ul>
                    {navItems.map((item, index) => (
                        <li key={item.path} className={`stagger-${index + 1} slide-up`}>
                            <NavLink 
                                to={item.path} 
                                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                onClick={closeSidebar}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer stagger-5 slide-up">
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>

            <style>{`
                .sidebar {
                    width: var(--sidebar-width);
                    height: calc(100vh - 2rem);
                    position: fixed;
                    left: 1rem;
                    top: 1rem;
                    border-radius: var(--radius-xl);
                    display: flex;
                    flex-direction: column;
                    z-index: 1000;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid var(--border);
                }
                .sidebar-header {
                    padding: 1.5rem 1.25rem 1.25rem;
                    border-bottom: 1px solid var(--border);
                }
                .sidebar-brand {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .brand-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .brand-icon-wrap {
                    width: 52px;
                    height: 52px;
                    background: linear-gradient(135deg, #2D4A32 0%, #4B6B50 100%);
                    color: white;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    box-shadow: 0 8px 20px rgba(26, 43, 28, 0.4);
                }
                .brand-text-group {
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                }
                .brand-name {
                    font-size: 1.45rem;
                    font-weight: 900;
                    color: #1A2B1C;
                    font-family: 'Outfit', sans-serif;
                    letter-spacing: -0.03em;
                    line-height: 1.2;
                }
                .brand-tagline {
                    font-size: 0.62rem;
                    font-weight: 800;
                    color: #2D4A32;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    opacity: 1;
                }
                .mobile-close-btn {
                    display: none;
                    background: transparent;
                    color: var(--text-muted);
                    padding: 4px;
                    border-radius: 6px;
                }
                .nav-section-label {
                    padding: 1.5rem 1.5rem 0.5rem;
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    color: var(--text-muted);
                    opacity: 0.6;
                }
                .sidebar-nav {
                    flex: 1;
                    padding: 0 0.75rem;
                    overflow-y: auto;
                }
                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 0.85rem 1.15rem;
                    border-radius: var(--radius-md);
                    color: var(--text-sub);
                    font-size: 0.95rem;
                    font-weight: 600;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    margin-bottom: 4px;
                }
                .nav-link:hover {
                    background: rgba(75, 107, 80, 0.08);
                    color: var(--primary);
                    transform: translateX(4px);
                }
                .nav-link.active {
                    background: var(--primary);
                    color: white;
                    font-weight: 700;
                    box-shadow: 0 8px 16px rgba(75, 107, 80, 0.2);
                }
                .nav-link.active .nav-icon { color: white; transform: scale(1.1); }
                .nav-icon { 
                    display: flex;
                    width: 20px;
                    flex-shrink: 0;
                    transition: transform 0.3s ease;
                }
                .sidebar-footer {
                    padding: 1rem 0.75rem;
                    border-top: 1px solid var(--border);
                }
                .logout-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 0.725rem 0.875rem;
                    border-radius: var(--radius-md);
                    color: var(--danger);
                    background: transparent;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .logout-btn:hover {
                    background: var(--danger-bg);
                }
                @media (max-width: 1024px) {
                    .sidebar {
                        left: 0;
                        top: 0;
                        height: 100vh;
                        border-radius: 0;
                        transform: translateX(-100%);
                    }
                    .sidebar.open {
                        transform: translateX(0);
                    }
                    .mobile-close-btn { display: flex; }
                }
            `}</style>
        </aside>
    );
};

export default Sidebar;
