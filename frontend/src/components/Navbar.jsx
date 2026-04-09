import React from 'react';
import { Search, User, Menu, LogOut } from 'lucide-react';

const Navbar = ({ toggleSidebar, onLogout }) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    return (
        <header className="navbar glass">
            <div className="navbar-left">
                <button className="mobile-menu-btn" onClick={toggleSidebar} id="mobile-menu-toggle">
                    <Menu size={22} />
                </button>
                <div className="search-bar">
                    <Search size={16} className="search-icon" />
                    <input type="text" placeholder="Search students, classes..." />
                </div>
            </div>
                <div className="nav-actions slide-up stagger-1">
                    <div className="divider"></div>
                    <div className="user-profile">
                        <div className="user-info">
                            <span className="user-name">{userInfo?.name || 'Admin'}</span>
                            <span className="user-role">{userInfo?.isAdmin ? 'Administrator' : 'Staff'}</span>
                        </div>
                        <div className="avatar">
                            <User size={18} />
                        </div>
                    </div>
                    <button className="logout-btn" onClick={onLogout} title="Logout" id="navbar-logout-btn">
                        <LogOut size={18} />
                    </button>
                </div>

            <style>{`
                .navbar {
                    height: var(--navbar-height);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 1.5rem;
                    position: sticky;
                    top: 1rem;
                    margin: 1rem 1.5rem 1.5rem calc(var(--sidebar-width) + 1.5rem);
                    z-index: 900;
                    border-radius: var(--radius-lg);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .navbar-left {
                    display: flex;
                    align-items: center;
                    gap: 0.875rem;
                    flex: 1;
                }
                .mobile-menu-btn {
                    display: none;
                    background: transparent;
                    color: var(--text-main);
                    padding: 6px;
                    border-radius: var(--radius-sm);
                }
                .mobile-menu-btn:hover { background: var(--bg-subtle); }
                .search-bar {
                    display: flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.5);
                    border: 1px solid var(--border);
                    padding: 0.6rem 1.15rem;
                    border-radius: var(--radius-md);
                    width: 100%;
                    max-width: 320px;
                    gap: 12px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .search-bar:focus-within {
                    border-color: var(--primary);
                    background: white;
                    box-shadow: 0 0 0 3px rgba(75, 107, 80, 0.08);
                }
                .search-bar input {
                    background: transparent;
                    border: none;
                    outline: none;
                    width: 100%;
                    font-size: 0.875rem;
                    color: var(--text-main);
                }
                .search-bar input::placeholder { color: var(--text-muted); }
                .search-icon { color: var(--text-muted); flex-shrink: 0; }
                .nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 0.875rem;
                }
                .notif-btn {
                    display: none;
                }
                .divider {
                    width: 1px;
                    height: 28px;
                    background: var(--border);
                }
                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: var(--radius-md);
                    transition: background 0.2s;
                }
                .user-profile:hover { background: var(--bg-subtle); }
                .user-info {
                    display: flex;
                    flex-direction: column;
                    text-align: right;
                    gap: 1px;
                }
                .user-name {
                    font-weight: 600;
                    font-size: 0.875rem;
                    color: var(--text-main);
                }
                .user-role {
                    font-size: 0.7rem;
                    color: var(--text-sub);
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.02em;
                    opacity: 0.8;
                }
                .avatar {
                    width: 36px;
                    height: 36px;
                    background: var(--primary);
                    color: white;
                    border-radius: var(--radius-sm);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .logout-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    background: transparent;
                    color: var(--text-muted);
                    border-radius: var(--radius-sm);
                    transition: all 0.2s;
                    flex-shrink: 0;
                }
                .logout-btn:hover {
                    background: var(--danger-bg);
                    color: var(--danger);
                }
                @media (max-width: 1024px) {
                    .navbar { margin-left: 1.5rem; width: auto; }
                }
                @media (max-width: 768px) {
                    .mobile-menu-btn { display: flex; }
                    .search-bar { display: none; }
                    .user-info { display: none; }
                    .navbar { padding: 0 1rem; margin: 0.75rem 1rem 1rem; }
                }
            `}</style>
        </header>
    );
};

export default Navbar;
