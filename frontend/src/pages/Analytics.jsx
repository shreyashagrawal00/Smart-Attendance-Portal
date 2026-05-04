import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { TrendingUp, AlertTriangle, Users, BookOpen, ChevronRight, BarChart3, PieChart as PieChartIcon, AlertCircle, Download } from 'lucide-react';

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
                        <span className="value">{stats?.totalStudents || 0}</span>
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
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .main-chart { grid-column: 1 / -1; }
                .chart-card { padding: 1.75rem; border-radius: var(--radius-xl); display: flex; flex-direction: column; background: white; }
                .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .header-info { display: flex; align-items: center; gap: 10px; color: var(--text-main); font-weight: 700; }
                .header-info h3 { font-size: 1.1rem; }

                .stat-card {
                    flex: 1; display: flex; align-items: center; gap: 1.25rem;
                    padding: 1.5rem 1.75rem; border-radius: var(--radius-xl);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative; overflow: hidden; background: white;
                }
                .stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
                .stat-icon {
                    width: 50px; height: 50px; background: var(--bg-subtle);
                    color: var(--primary); border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                }
                .stat-brief { display: flex; flex-direction: column; gap: 2px; }
                .stat-brief .label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                .stat-brief .value { font-size: 1.5rem; font-weight: 800; color: var(--text-main); line-height: 1.1; }
                
                .badge {
                    padding: 4px 10px; background: var(--bg-subtle); color: var(--primary);
                    font-size: 0.65rem; font-weight: 800; border-radius: 20px; text-transform: uppercase;
                }

                .bottom-chart { grid-column: span 1; }
                .chart-container.centered { display: flex; align-items: center; justify-content: center; flex: 1; }
                .chart-container { width: 100%; }

                .report-footer-actions {
                    display: flex; gap: 1.5rem; justify-content: flex-start;
                    margin-top: 1rem; padding-bottom: 2rem;
                }
                .report-btn {
                    display: flex; align-items: center; gap: 10px;
                    padding: 0.8rem 1.5rem; border-radius: 12px; font-weight: 700;
                    font-size: 0.9rem; cursor: pointer; transition: all 0.2s;
                    border: 1.5px solid transparent;
                }
                .report-btn.primary { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(75, 107, 80, 0.2); }
                .report-btn.primary:hover { transform: translateY(-3px); box-shadow: 0 6px 15px rgba(75, 107, 80, 0.3); }
                .report-btn.secondary { background: white; color: var(--primary); border-color: var(--primary); }
                .report-btn.secondary:hover { background: var(--bg-subtle); transform: translateY(-3px); }

                /* Modal Specifics */
                .modal-overlay {
                    position: fixed; inset: 0; background: rgba(26, 43, 28, 0.4);
                    backdrop-filter: blur(8px); display: flex; align-items: center;
                    justify-content: center; z-index: 2000; padding: 1.5rem;
                }
                .modal-card { width: 100%; max-width: 500px; background: white; padding: 2.25rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); }
                .modal-card.large { max-width: 600px; }
                .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .modal-header h2 { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin-bottom: 4px; }
                .modal-header p { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }
                .close-x { font-size: 1.75rem; color: var(--text-muted); line-height: 1; transition: color 0.2s; background: transparent; border: none; cursor: pointer; }
                .close-x:hover { color: var(--danger); }
                .modal-body { max-height: 60vh; overflow-y: auto; }
                .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 2rem; }

                .table-responsive.small { border: 1.5px solid var(--border); border-radius: 12px; overflow: hidden; }
                .custom-table { width: 100%; border-collapse: collapse; }
                .custom-table th { background: var(--bg-subtle); padding: 1rem 1.25rem; text-align: left; font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                .custom-table td { padding: 1rem 1.25rem; border-bottom: 1px solid var(--border); vertical-align: middle; }
                
                .st-info-mini { display: flex; align-items: center; gap: 12px; }
                .roll-tag { font-size: 0.75rem; font-weight: 700; color: var(--primary); background: var(--bg-subtle); padding: 2px 8px; border-radius: 4px; width: fit-content; }
                .name-bold { font-weight: 700; color: var(--text-main); font-size: 0.95rem; }
                .rate-value.danger { color: #C1121F; font-weight: 800; font-size: 1rem; }
                
                .mini-progress-track { width: 100%; height: 6px; background: var(--bg-subtle); border-radius: 6px; margin-top: 8px; overflow: hidden; }
                .mini-progress-fill { height: 100%; background: #C1121F; border-radius: 6px; }

                @media (max-width: 1024px) {
                    .analytics-grid { grid-template-columns: 1fr; }
                    .bottom-chart { grid-column: auto; }
                }
                @media (max-width: 768px) {
                    .analytics-stats-row { grid-template-columns: 1fr; }
                    .report-footer-actions { flex-direction: column; gap: 0.75rem; }
                    .report-btn { width: 100%; justify-content: center; }
                    .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
                    .header-actions { width: 100%; }
                    .selector-wrapper, .class-selector { width: 100%; }
                    .modal-card { padding: 1.5rem; }
                    .modal-header h2 { font-size: 1.25rem; }
                }
                @media (max-width: 480px) {
                    .chart-card { padding: 1rem; }
                    .stat-card { padding: 1rem; }
                    .stat-icon { width: 40px; height: 40px; }
                    .stat-brief .value { font-size: 1.25rem; }
                }
            `}</style>
        </div>
    );
};

export default Analytics;
