import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    return (
        <header className="navbar glass">
            <div className="navbar-left">
                <button className="mobile-menu-btn" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search students, classes..." />
                </div>
            </div>
            <div className="nav-actions">
                <button className="icon-btn">
                    <Bell size={20} />
                </button>
                <div className="user-profile">
                    <div className="user-info">
                        <span className="user-name">{userInfo?.name || 'Admin'}</span>
                        <span className="user-role">{userInfo?.isAdmin ? 'Teacher' : 'Staff'}</span>
                    </div>
                    <div className="avatar">
                        <User size={20} />
                    </div>
                </div>
            </div>
            <style>{`
                .navbar {
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 2rem;
                    position: sticky;
                    top: 0;
                    z-index: 900;
                    border-bottom: 1px solid var(--border);
                }
                .navbar-left {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex: 1;
                }
                .mobile-menu-btn {
                    display: none;
                    background: transparent;
                    color: var(--text-main);
                    padding: 8px;
                    border-radius: 8px;
                }
                .search-bar {
                    display: flex;
                    align-items: center;
                    background: rgba(109, 139, 116, 0.05);
                    padding: 0.5rem 1rem;
                    border-radius: 10px;
                    width: 100%;
                    max-width: 300px;
                    gap: 10px;
                }
                .search-bar input {
                    background: transparent;
                    border: none;
                    outline: none;
                    width: 100%;
                    font-size: 0.9rem;
                }
                .search-icon {
                    color: var(--secondary);
                }
                .nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .icon-btn {
                    background: transparent;
                    color: var(--secondary);
                    padding: 8px;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                .icon-btn:hover {
                    background: rgba(109, 139, 116, 0.05);
                    color: var(--primary);
                }
                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding-left: 1.5rem;
                    border-left: 1px solid var(--border);
                }
                .user-info {
                    display: flex;
                    flex-direction: column;
                    text-align: right;
                }
                .user-name {
                    font-weight: 600;
                    font-size: 0.95rem;
                }
                .user-role {
                    font-size: 0.75rem;
                    color: var(--primary);
                    opacity: 0.9;
                }
                .avatar {
                    width: 38px;
                    height: 38px;
                    background: var(--primary);
                    color: white;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                @media (max-width: 768px) {
                    .mobile-menu-btn {
                        display: flex;
                    }
                    .search-bar {
                        display: none; /* Hide full search bar on very small screens to save space */
                    }
                    .user-info {
                        display: none; /* Hide name/role text on mobile, just show avatar */
                    }
                    .navbar {
                        padding: 0 1rem;
                    }
                }
            `}</style>
        </header>
    );
};

export default Navbar;
