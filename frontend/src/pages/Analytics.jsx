import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { TrendingUp, AlertTriangle, Users, BookOpen, ChevronRight, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [showLowAttendanceModal, setShowLowAttendanceModal] = useState(false);

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

    const COLORS = ['#4B6B50', '#6B8F72', '#C1121F', '#E85D04', '#7A9980'];
    const CHART_TEXT_COLOR = '#3D5941';

    return (
        <div className="analytics fade-in">
            <header className="page-header">
                <div className="header-title">
                    <h1>Insights & Analytics</h1>
                    <p>Visualizing attendance patterns and performance metrics.</p>
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
                </div>
            </header>

            <div className="analytics-stats-row slide-up stagger-1">
                <div className="stat-card glass scale-in stagger-1">
                    <div className="stat-icon"><Users size={20} /></div>
                    <div className="stat-brief">
                        <span className="label">Total Students</span>
                        <span className="value">{students.length}</span>
                    </div>
                </div>
                <div className="stat-card glass scale-in stagger-2">
                    <div className="stat-icon"><TrendingUp size={20} /></div>
                    <div className="stat-brief">
                        <span className="label">Avg Attendance</span>
                        <span className="value">{stats?.averageAttendancePercentage ? `${stats.averageAttendancePercentage.toFixed(0)}%` : 'N/A'}</span>
                    </div>
                </div>
                <div className="stat-card glass scale-in stagger-3">
                    <div className="stat-icon"><AlertCircle size={20} /></div>
                    <div className="stat-brief">
                        <span className="label">Low Attendance</span>
                        <span className="value">{stats?.lowAttendanceCount || 0}</span>
                    </div>
                </div>
            </div>

            <div className="analytics-grid">
                <div className="chart-card glass main-chart">
                    <div className="card-header">
                        <div className="header-info">
                            <TrendingUp size={18} />
                            <h3>Weekly Attendance Trend</h3>
                        </div>
                        <span className="badge">Activity</span>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={stats?.weeklyTrend || []}>
                                <defs>
                                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4B6B50" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#4B6B50" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(75, 107, 80, 0.1)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fill: CHART_TEXT_COLOR, fontSize: 11, fontWeight: 600}}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fill: CHART_TEXT_COLOR, fontSize: 11, fontWeight: 600}}
                                />
                                <Tooltip
                                    contentStyle={{ background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(75, 107, 80, 0.2)', boxShadow: 'var(--shadow-lg)', fontSize: '12px' }}
                                    cursor={{ stroke: '#4B6B50', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="present"
                                    stroke="#4B6B50"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorPresent)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-wrapper glass scale-in stagger-2">
                    <div className="chart-header">
                        <h3>Attendance Trends</h3>
                        <p>Weekly variation in student presence.</p>
                    </div>
                    <div className="chart-placeholder">
                        <LineChart size={48} />
                        <p>Timeline Visualization Active</p>
                    </div>
                </div>

                <div className="chart-wrapper glass scale-in stagger-3">
                    <div className="chart-header">
                        <h3>Class Comparison</h3>
                        <p>Performance across different sections.</p>
                    </div>
                    <div className="chart-placeholder">
                        <PieChart size={48} />
                        <p>Comparative Data Analysis</p>
                    </div>
                </div>

                <div className="chart-card glass bottom-chart">
                    <div className="card-header">
                        <div className="header-info">
                            <PieChartIcon size={18} />
                            <h3>Status Breakdown</h3>
                        </div>
                    </div>
                    <div className="chart-container centered">
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={stats?.statusDistribution || [
                                        { name: 'Present', value: 0 },
                                        { name: 'Absent', value: 0 },
                                        { name: 'Late', value: 0 }
                                    ]}
                                    innerRadius={60}
                                    outerRadius={85}
                                    paddingAngle={8}
                                    dataKey="value"
                                    animationDuration={1500}
                                >
                                    {COLORS.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(75, 107, 80, 0.2)', boxShadow: 'var(--shadow-lg)' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span style={{ color: '#1A2B1C', fontWeight: 600, fontSize: '11px' }}>{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card glass bottom-chart">
                    <div className="card-header">
                        <div className="header-info">
                            <BarChart3 size={18} />
                            <h3>Enrollment Density</h3>
                        </div>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={stats?.classDistribution || []} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(75, 107, 80, 0.1)" />
                                <XAxis
                                    dataKey="class"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fill: CHART_TEXT_COLOR, fontSize: 11, fontWeight: 600}}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fill: CHART_TEXT_COLOR, fontSize: 11, fontWeight: 600}}
                                />
                                <Tooltip
                                    cursor={{fill: 'rgba(75, 107, 80, 0.05)'}}
                                    contentStyle={{ background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(75, 107, 80, 0.2)' }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#4B6B50"
                                    radius={[6, 6, 0, 0]}
                                    barSize={32}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="report-footer-actions slide-up stagger-4">
                <button className="report-btn primary" onClick={() => setShowLowAttendanceModal(true)}>
                    <AlertTriangle size={18} />
                    <span>Low Attendance Details</span>
                </button>
                <button className="report-btn secondary">
                    <Download size={18} />
                    <span>Generate Full Report</span>
                </button>
            </div>

            {showLowAttendanceModal && (
                <div className="modal-overlay fade-in">
                    <div className="modal-card glass scale-in large">
                        <div className="modal-header">
                            <div>
                                <h2>Low Attendance Warning</h2>
                                <p>Students with engagement levels below 75% threshold.</p>
                            </div>
                            <button className="close-x" onClick={() => setShowLowAttendanceModal(false)}>×</button>
                        </div>
                        <div className="modal-body custom-scrollbar">
                            <div className="table-responsive small">
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>Student Identity</th>
                                            <th className="text-right">Attendance Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats?.lowAttendanceList?.length > 0 ? (
                                            stats.lowAttendanceList.map((st, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <div className="st-info-mini">
                                                            <span className="roll-tag">{st.rollNo}</span>
                                                            <span className="name-bold">{st.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-right">
                                                        <span className="rate-value danger">{st.percentage}%</span>
                                                        <div className="mini-progress-track">
                                                            <div className="mini-progress-fill" style={{ width: `${st.percentage}%` }}></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" className="empty-row">No students currently in warning zone.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="action-btn primary" onClick={() => setShowLowAttendanceModal(false)}>Acknowledge</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .analytics { display: flex; flex-direction: column; gap: 1.75rem; }
                .selector-wrapper { padding: 2px 4px; border-radius: var(--radius-md); }
                .class-selector {
                    padding: 0.6rem 1rem; border: none; background: transparent;
                    color: var(--text-main); font-weight: 600; font-size: 0.875rem; outline: none;
                    cursor: pointer; min-width: 150px;
                }

                .analytics-stats-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                }

                .analytics-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1.5rem;
                }
                .chart-card { padding: 1.75rem; border-radius: var(--radius-xl); display: flex; flex-direction: column; }
                .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .header-info { display: flex; align-items: center; gap: 10px; color: var(--text-main); font-weight: 700; }
                .header-info h3 { font-size: 1.1rem; }

                .main-chart { grid-row: span 1; }

                .stat-card {
                    flex: 1; display: flex; align-items: center; gap: 1rem;
                    padding: 1.25rem 1.5rem; border-radius: var(--radius-lg);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
                .stat-icon {
                    width: 44px; height: 44px; background: rgba(75, 107, 80, 0.1);
                    color: var(--primary); border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    margin-top: 12px; background: transparent; color: var(--primary);
                    font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; gap: 4px;
                }
                .text-action-btn:hover { text-decoration: underline; }

                .bottom-chart { grid-column: span 1; }
                .chart-container.centered { display: flex; align-items: center; justify-content: center; flex: 1; }

                .badge {
                    padding: 4px 10px; background: var(--bg-subtle); color: var(--primary);
                    font-size: 0.65rem; font-weight: 800; border-radius: 20px; text-transform: uppercase;
                }

                .st-info-mini { display: flex; align-items: center; gap: 12px; }
                .roll-tag { font-size: 0.75rem; font-weight: 700; color: var(--primary); background: var(--bg-subtle); padding: 2px 8px; border-radius: 4px; }
                .name-bold { font-weight: 600; color: var(--text-main); font-size: 0.9rem; }
                .rate-value.danger { color: var(--danger); font-weight: 800; font-size: 0.95rem; }
                
                .mini-progress-track { width: 100%; height: 4px; background: var(--bg-subtle); border-radius: 4px; margin-top: 6px; overflow: hidden; }
                .mini-progress-fill { height: 100%; background: var(--danger); border-radius: 4px; }
                .empty-row { padding: 3rem; text-align: center; color: var(--text-muted); font-style: italic; }

                @media (max-width: 1024px) {
                    .analytics-grid { grid-template-columns: 1fr; }
                    .bottom-chart { grid-column: auto; }
                }
            `}</style>
        </div>
    );
};

export default Analytics;
