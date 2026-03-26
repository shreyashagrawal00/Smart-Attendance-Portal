import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, AlertTriangle, Users, BookOpen } from 'lucide-react';

const Analytics = () => {
    const [stats, setStats] = useState(null);
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
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/attendance/analytics?class=${encodeURIComponent(selectedClass)}`);
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [selectedClass]);

    // Mock data for charts if backend doesn't provide enough history yet
    const weeklyData = [
        { name: 'Mon', present: 85, absent: 15 },
        { name: 'Tue', present: 92, absent: 8 },
        { name: 'Wed', present: 78, absent: 22 },
        { name: 'Thu', present: 88, absent: 12 },
        { name: 'Fri', present: 95, absent: 5 },
    ];

    const COLORS = ['#5F7161', '#6D8B74', '#D0C9C0', '#ef4444'];

    return (
        <div className="analytics">
            <header className="page-header">
                <div>
                    <h1>Insights & Analytics</h1>
                    <p>Deep dive into attendance patterns and student performance.</p>
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
                </div>
            </header>

            <div className="analytics-grid">
                <div className="chart-card glass large">
                    <div className="card-header">
                        <h3>Weekly Attendance Trend</h3>
                        <TrendingUp size={18} className="icon-trend" />
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={weeklyData}>
                                <defs>
                                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#5F7161" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#5F7161" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(95, 113, 97, 0.1)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#5F7161aa', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#5F7161aa', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(109, 139, 116, 0.2)', boxShadow: '0 10px 15px -3px rgba(95, 113, 97, 0.1)' }}
                                    itemStyle={{ color: '#5F7161' }}
                                />
                                <Area type="monotone" dataKey="present" stroke="#5F7161" strokeWidth={3} fillOpacity={1} fill="url(#colorPresent)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="side-stats">
                    <div className="insight-card glass highlight">
                        <div className="insight-icon alert">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="insight-content">
                            <h4>Low Attendance Alert</h4>
                            <p>5 students have below 75% attendance this month.</p>
                            <button className="view-link">View List</button>
                        </div>
                    </div>
                    <div className="insight-card glass">
                        <div className="insight-icon students">
                            <Users size={24} />
                        </div>
                        <div className="insight-content">
                            <h4>Total Enrollment</h4>
                            <p>Current total of 124 students across 6 classes.</p>
                        </div>
                    </div>
                </div>

                <div className="chart-card glass">
                    <h3>Status Distribution</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Present', value: 85 },
                                        { name: 'Absent', value: 10 },
                                        { name: 'Late', value: 5 }
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {COLORS.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card glass">
                    <h3>Enrollment by Class</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={[
                                { class: '10-A', count: 32 },
                                { class: '10-B', count: 28 },
                                { class: '11-A', count: 35 },
                                { class: '12-A', count: 29 }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(95, 113, 97, 0.1)" />
                                <XAxis dataKey="class" axisLine={false} tickLine={false} tick={{fill: '#5F7161aa'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#5F7161aa'}} />
                                <Tooltip 
                                    contentStyle={{ background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(109, 139, 116, 0.2)' }}
                                />
                                <Bar dataKey="count" fill="#5F7161" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <style>{`
                .analytics {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
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
                .analytics-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    grid-template-rows: auto auto;
                    gap: 1.5rem;
                }
                .chart-card {
                    padding: 1.5rem;
                    border-radius: 24px;
                }
                .chart-card.large {
                    grid-column: span 1;
                }
                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .chart-card h3 {
                    font-size: 1.1rem;
                    margin-bottom: 1rem;
                }
                .chart-container {
                    width: 100%;
                }
                .side-stats {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .insight-card {
                    padding: 1.5rem;
                    border-radius: 20px;
                    display: flex;
                    gap: 1rem;
                }
                .insight-card.highlight {
                    border-left: 4px solid var(--danger);
                }
                .insight-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .insight-icon.alert { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
                .insight-icon.students { background: rgba(109, 139, 116, 0.05); color: var(--primary); }
                .insight-content h4 { font-size: 0.95rem; margin-bottom: 4px; }
                .insight-content p { font-size: 0.85rem; color: var(--secondary); }
                .view-link {
                    background: transparent;
                    color: var(--primary);
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin-top: 8px;
                    padding: 0;
                }
                @media (max-width: 1024px) {
                    .analytics-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default Analytics;
