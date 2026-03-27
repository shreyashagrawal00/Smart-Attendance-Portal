import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import { Users, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalStudents: 0,
        attendancePercentage: 0,
        todayPresent: 0,
        todayAbsent: 0
    });
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('All Classes');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const { data } = await api.get('/classes');
                setClasses(data);
            } catch (err) {
                console.error("Failed to load classes:", err);
            }
        };
        fetchClasses();
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/attendance/analytics?class=${encodeURIComponent(selectedClass)}`);
                setStats({
                    totalStudents: data.totalStudents || 0,
                    attendancePercentage: Math.round(data.attendancePercentage) || 0,
                    todayPresent: data.presentCount || 0,
                    todayAbsent: data.absentCount !== undefined ? data.absentCount : (data.totalStudents - data.presentCount) || 0
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [selectedClass]);

    return (
        <div className="dashboard">
            <header className="page-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p>Welcome back! Here's what's happening today.</p>
                </div>
                <div className="header-actions">
                    <select 
                        className="class-selector glass"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        <option value="All Classes">All Classes</option>
                        {classes.map(cls => (
                            <option key={cls._id} value={cls.name}>{cls.name}</option>
                        ))}
                    </select>
                    <div className="date-display glass">
                        <Calendar size={18} />
                        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </header>

            <div className="stats-grid">
                <StatsCard 
                    title="Total Students" 
                    value={stats.totalStudents} 
                    icon={<Users size={24} />} 
                    color="#4B5D4E"
                    trend={{ value: 12, positive: true }}
                />
                <StatsCard 
                    title="Avg Attendance" 
                    value={`${stats.attendancePercentage}%`} 
                    icon={<CheckCircle size={24} />} 
                    color="#2D6A4F"
                    trend={{ value: 5, positive: true }}
                />
                <StatsCard 
                    title="Today Present" 
                    value={stats.todayPresent} 
                    icon={<CheckCircle size={24} />} 
                    color="#6D8B74"
                />
                <StatsCard 
                    title="Today Absent" 
                    value={stats.todayAbsent} 
                    icon={<XCircle size={24} />} 
                    color="#C1121F"
                />
            </div>

            <div className="dashboard-content">
                <div className="recent-activity glass">
                    <h3>Today's Attendance Status</h3>
                    <div className="status-chart-placeholder">
                        <div className="chart-info">
                            <span className="percentage">{stats.attendancePercentage}%</span>
                            <span>Marked Today</span>
                        </div>
                    </div>
                    <div className="status-list">
                        <div className="status-item">
                            <div className="dot present"></div>
                            <span>Present</span>
                            <span className="count">{stats.todayPresent}</span>
                        </div>
                        <div className="status-item">
                            <div className="dot absent"></div>
                            <span>Absent</span>
                            <span className="count">{stats.todayAbsent}</span>
                        </div>
                    </div>
                </div>

                <div className="quick-actions glass">
                    <h3>Quick Actions</h3>
                    <div className="actions-grid">
                        <button className="action-btn" onClick={() => navigate('/attendance')}>Mark Attendance</button>
                        <button className="action-btn secondary" onClick={() => navigate('/students')}>Add New Student</button>
                        <button className="action-btn secondary" onClick={() => navigate('/records')}>View Records</button>
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .class-selector {
                    padding: 0.75rem 1.25rem;
                    border-radius: 12px;
                    border: 1.5px solid var(--border);
                    background: var(--bg-card);
                    color: var(--text-main);
                    font-weight: 500;
                    outline: none;
                    cursor: pointer;
                    min-width: 150px;
                }
                .date-display {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 0.75rem 1.25rem;
                    border-radius: 12px;
                    color: var(--secondary);
                    font-weight: 500;
                    font-size: 0.9rem;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 1.5rem;
                }
                .dashboard-content {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1.5rem;
                }
                .recent-activity, .quick-actions {
                    padding: 1.5rem;
                    border-radius: 20px;
                }
                .recent-activity h3, .quick-actions h3 {
                    margin-bottom: 1.5rem;
                    font-size: 1.1rem;
                }
                .status-chart-placeholder {
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(109, 139, 116, 0.03);
                    margin-bottom: 1.5rem;
                    border-radius: 50%;
                    width: 200px;
                    margin: 0 auto 1.5rem;
                    border: 8px solid rgba(109, 139, 116, 0.05);
                }
                .chart-info {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .percentage {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--primary);
                }
                .status-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .status-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 0.75rem;
                    border-radius: 10px;
                    background: rgba(109, 139, 116, 0.03);
                }
                .dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                }
                .dot.present { background: var(--success); }
                .dot.absent { background: var(--danger); }
                .count {
                    margin-left: auto;
                    font-weight: 600;
                }
                .actions-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .action-btn {
                    padding: 0.875rem;
                    border-radius: 12px;
                    font-weight: 700;
                    background: var(--primary);
                    color: var(--bg-main);
                    transition: all 0.2s;
                }
                .action-btn.secondary {
                    background: rgba(109, 139, 116, 0.1);
                    color: var(--primary);
                }
                .action-btn:hover {
                    opacity: 0.9;
                    transform: translateX(5px);
                }
                @media (max-width: 1024px) {
                    .dashboard-content {
                        grid-template-columns: 1fr;
                    }
                }
                @media (max-width: 768px) {
                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }
                    .header-actions {
                        flex-wrap: wrap;
                        width: 100%;
                    }
                    .class-selector, .date-display {
                        flex: 1;
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
