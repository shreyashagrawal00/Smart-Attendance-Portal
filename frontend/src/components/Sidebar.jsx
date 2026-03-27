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
        { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/students', name: 'Students', icon: <Users size={20} /> },
        { path: '/attendance', name: 'Mark Attendance', icon: <CheckSquare size={20} /> },
        { path: '/records', name: 'Records', icon: <History size={20} /> },
        { path: '/analytics', name: 'Analytics', icon: <BarChart3 size={20} /> },
        { path: '/about', name: 'About GLA', icon: <Info size={20} /> },
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="brand">
                    <GraduationCap className="logo-icon" size={32} />
                    <span>SmartAttend</span>
                </div>
                <button className="mobile-close-btn" onClick={closeSidebar}>
                    <X size={24} />
                </button>
            </div>
            <nav className="sidebar-nav custom-scrollbar">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink 
                                to={item.path} 
                                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                onClick={closeSidebar}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
            <style>{`
                .sidebar {
                    width: var(--sidebar-width);
                    height: 100vh;
                    position: fixed;
                    left: 0;
                    top: 0;
                    background: var(--bg-card);
                    border-right: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    z-index: 1000;
                    transition: all 0.3s ease;
                }
                .sidebar-header {
                    padding: 2rem 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary);
                }
                .mobile-close-btn {
                    display: none;
                    background: transparent;
                    color: var(--secondary);
                }
                .logo-icon {
                    color: var(--primary);
                }
                .sidebar-nav {
                    flex: 1;
                    padding: 0 1rem;
                    overflow-y: auto;
                }
                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 0.875rem 1rem;
                    border-radius: 12px;
                    color: var(--secondary);
                    font-weight: 500;
                    transition: all 0.2s;
                    margin-bottom: 4px;
                }
                .nav-link:hover {
                    background: rgba(109, 139, 116, 0.1);
                    color: var(--primary);
                }
                .nav-link.active {
                    background: var(--primary);
                    color: var(--bg-main);
                    font-weight: 700;
                }
                .sidebar-footer {
                    padding: 1.5rem;
                    border-top: 1px solid var(--border);
                }
                .logout-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 0.875rem 1rem;
                    border-radius: 12px;
                    color: var(--danger);
                    background: transparent;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .logout-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                }
                @media (max-width: 768px) {
                    .sidebar {
                        transform: translateX(-100%);
                    }
                    .sidebar.open {
                        transform: translateX(0);
                    }
                    .mobile-close-btn {
                        display: block;
                    }
                }
            `}</style>
        </aside>
    );
};

export default Sidebar;
