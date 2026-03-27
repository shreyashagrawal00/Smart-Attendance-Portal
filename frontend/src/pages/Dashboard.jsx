import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import { Users, CheckCircle, XCircle, Calendar, ArrowRight, Zap } from 'lucide-react';
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
                <div className="header-title">
                    <h1>Dashboard Overview</h1>
                    <p>Welcome back! Here's a summary of today's attendance.</p>
                </div>
                <div className="header-actions">
                    <div className="selector-wrapper glass">
                        <select 
                            className="class-selector"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            <option value="All Classes">All Classes</option>
                            {classes.map(cls => (
                                <option key={cls._id} value={cls.name}>{cls.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="date-display glass">
                        <Calendar size={16} />
                        <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
            </header>

            <div className="stats-grid slide-up stagger-1">
                <StatsCard 
                    title="Total Enrollment" 
                    value={stats.totalStudents} 
                    icon={<Users size={22} />} 
                    color="var(--primary)"
                    trend={{ value: 0, positive: true }}
                />
                <StatsCard 
                    title="Average Attendance" 
                    value={`${stats.attendancePercentage}%`} 
                    icon={<Zap size={22} />} 
                    color="var(--secondary)"
                    trend={{ value: 0, positive: true }}
                />
                <StatsCard 
                    title="Present Today" 
                    value={stats.todayPresent} 
                    icon={<CheckCircle size={22} />} 
                    color="var(--success)"
                />
                <StatsCard 
                    title="Absent Today" 
                    value={stats.todayAbsent} 
                    icon={<XCircle size={22} />} 
                    color="var(--danger)"
                />
            </div>

            <div className="dashboard-content slide-up stagger-2">
                <div className="card-section activity-section glass scale-in">
                    <div className="section-header">
                        <h3>Attendance Summary</h3>
                        <span className="badge">Today</span>
                    </div>
                    
                    <div className="summary-visual">
                        <div className="progress-circle" style={{ '--percent': stats.attendancePercentage }}>
                            <div className="circle-inner">
                                <span className="percent-val">{stats.attendancePercentage}%</span>
                                <span className="percent-label">Rate</span>
                            </div>
                        </div>
                        
                        <div className="status-breakdown">
                            <div className="status-row">
                                <div className="status-label">
                                    <span className="dot present"></span>
                                    <span>Present Students</span>
                                </div>
                                <span className="status-count">{stats.todayPresent}</span>
                            </div>
                            <div className="status-row">
                                <div className="status-label">
                                    <span className="dot absent"></span>
                                    <span>Absent Students</span>
                                </div>
                                <span className="status-count">{stats.todayAbsent}</span>
                            </div>
                            <div className="divider"></div>
                            <div className="status-row total">
                                <span>Total Strength</span>
                                <span className="status-count">{stats.totalStudents}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-section actions-section glass scale-in">
                    <div className="section-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div className="actions-list">
                        <button className="action-button primary-action slide-up stagger-3" onClick={() => navigate('/attendance')}>
                            <div className="action-icon"><CheckCircle size={18} /></div>
                            <div className="action-text">
                                <span className="action-title">Mark Attendance</span>
                                <span className="action-desc">Take today's attendance</span>
                            </div>
                            <ArrowRight size={16} className="chevron" />
                        </button>
                        
                        <button className="action-button secondary-action slide-up stagger-4" onClick={() => navigate('/students')}>
                            <div className="action-icon"><Users size={18} /></div>
                            <div className="action-text">
                                <span className="action-title">Manage Students</span>
                                <span className="action-desc">Add or edit records</span>
                            </div>
                            <ArrowRight size={16} className="chevron" />
                        </button>
                        
                        <button className="action-button secondary-action slide-up stagger-5" onClick={() => navigate('/records')}>
                            <div className="action-icon"><Calendar size={18} /></div>
                            <div className="action-text">
                                <span className="action-title">View History</span>
                                <span className="action-desc">Check past records</span>
                            </div>
                            <ArrowRight size={16} className="chevron" />
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    animation: fadeIn 0.5s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .selector-wrapper {
                    padding: 2px 4px;
                    border-radius: var(--radius-md);
                }
                .class-selector {
                    padding: 0.6rem 1rem;
                    border: none;
                    background: transparent;
                    color: var(--text-main);
                    font-weight: 600;
                    font-size: 0.875rem;
                    outline: none;
                    cursor: pointer;
                    min-width: 140px;
                }
                .date-display {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 0.6rem 1.1rem;
                    border-radius: var(--radius-md);
                    color: var(--primary);
                    font-weight: 600;
                    font-size: 0.85rem;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 1.5rem;
                }
                .dashboard-content {
                    display: grid;
                    grid-template-columns: 1.6fr 1fr;
                    gap: 1.5rem;
                    align-items: start;
                }
                .card-section {
                    padding: 1.75rem;
                    border-radius: var(--radius-xl);
                }
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .section-header h3 {
                    font-size: 1.15rem;
                    color: var(--text-main);
                }
                .badge {
                    padding: 4px 12px;
                    background: var(--bg-subtle);
                    color: var(--primary);
                    font-size: 0.7rem;
                    font-weight: 700;
                    border-radius: 20px;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                }
                .summary-visual {
                    display: flex;
                    align-items: center;
                    gap: 3rem;
                    padding: 0.5rem 0;
                }
                .progress-circle {
                    --size: 160px;
                    --thickness: 12px;
                    width: var(--size);
                    height: var(--size);
                    border-radius: 50%;
                    background: conic-gradient(var(--primary) calc(var(--percent) * 1%), var(--bg-subtle) 0);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .circle-inner {
                    width: calc(var(--size) - var(--thickness) * 2);
                    height: calc(var(--size) - var(--thickness) * 2);
                    background: white;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
                }
                .percent-val {
                    font-size: 2rem;
                    font-weight: 800;
                    color: var(--text-main);
                    font-family: 'Outfit', sans-serif;
                }
                .percent-label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .status-breakdown {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .status-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .status-label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--text-sub);
                }
                .dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                }
                .dot.present { background: var(--success); box-shadow: 0 0 8px var(--success-bg); }
                .dot.absent { background: var(--danger); box-shadow: 0 0 8px var(--danger-bg); }
                .status-count {
                    font-weight: 700;
                    color: var(--text-main);
                    font-size: 1rem;
                }
                .divider {
                    height: 1px;
                    background: var(--border);
                    margin: 4px 0;
                }
                .status-row.total {
                    color: var(--text-main);
                    font-weight: 600;
                    font-size: 0.95rem;
                }
                .actions-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .action-button {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 1.15rem 1.5rem;
                    border-radius: var(--radius-lg);
                    text-align: left;
                    width: 100%;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1.5px solid transparent;
                }
                .action-button.primary-action {
                    background: var(--primary);
                    color: white !important;
                    box-shadow: 0 4px 15px rgba(75, 107, 80, 0.2);
                }
                .action-button.primary-action:hover {
                    background: var(--primary-hover);
                    transform: translateX(6px);
                    box-shadow: 0 8px 25px rgba(75, 107, 80, 0.3);
                }
                .action-button.secondary-action {
                    background: white;
                    border: 1.5px solid var(--border);
                    color: var(--text-main) !important;
                }
                .action-button.secondary-action:hover {
                    border-color: var(--primary);
                    background: var(--bg-subtle);
                    transform: translateX(6px);
                    color: var(--primary) !important;
                }
                .action-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.15);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .action-button.secondary .action-icon {
                    background: var(--bg-subtle);
                    color: var(--primary);
                }
                .action-text {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                .action-title {
                    font-weight: 700;
                    font-size: 0.95rem;
                }
                .action-desc {
                    font-size: 0.75rem;
                    opacity: 0.8;
                    font-weight: 500;
                }
                .chevron {
                    opacity: 0.4;
                    transition: transform 0.2s;
                }
                .action-button:hover .chevron {
                    opacity: 1;
                    transform: translateX(2px);
                }
                @media (max-width: 1100px) {
                    .summary-visual {
                        flex-direction: column;
                        gap: 2rem;
                        text-align: center;
                    }
                    .status-breakdown {
                        width: 100%;
                    }
                }
                @media (max-width: 900px) {
                    .dashboard-content {
                        grid-template-columns: 1fr;
                    }
                }
                @media (max-width: 600px) {
                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1.5rem;
                    }
                    .header-actions {
                        width: 100%;
                        flex-direction: column;
                    }
                    .selector-wrapper, .date-display {
                        width: 100%;
                    }
                    .class-selector {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
