import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, Filter, Download, User, Search, ChevronRight, History, FileText, XCircle } from 'lucide-react';

const AttendanceRecords = () => {
    const [records, setRecords] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchRecords();
    }, [date, selectedClass]);

    const fetchInitialData = async () => {
        try {
            const { data } = await api.get('/classes');
            setClasses(data);
        } catch (err) {
            console.error('Failed to fetch classes', err);
        }
    };

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/attendance?date=${date}&class=${selectedClass}`);
            setRecords(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (records.length === 0) return alert('No records to export');
        
        const headers = ['Student Name', 'Roll No', 'Class', 'Status', 'Date'];
        const csvRows = [
            headers.join(','),
            ...records.map(r => {
                const rawDate = r.date ? new Date(r.date).toISOString().split('T')[0] : date;
                return [
                    `"${r.student.name}"`,
                    `"${r.student.rollNo}"`,
                    `"${r.student.class}"`,
                    `"${r.status}"`,
                    `"${rawDate} "` // Added a trailing space inside quotes to force text mode
                ].join(',');
            })
        ];
        
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `attendance_${date}_${selectedClass || 'all'}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const filteredRecords = records.filter(r => 
        r.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.student.rollNo.includes(searchTerm)
    );

    return (
        <div className="attendance-records fade-in">
            <header className="page-header">
                <div className="header-title">
                    <h1>Attendance Records</h1>
                    <p>Access historical logs and export detailed reports.</p>
                </div>
                <button className="action-btn secondary" onClick={handleExportCSV} disabled={records.length === 0}>
                    <Download size={18} />
                    <span>Download CSV</span>
                </button>
            </header>

            <div className="controls-stack">
                <div className="filter-toolbar glass slide-up stagger-1">
                    <div className="tool-group">
                        <label><Calendar size={14} /> Log Date</label>
                        <input 
                            type="date" 
                            className="tool-input" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                        />
                    </div>
                    <div className="tool-divider"></div>
                    <div className="tool-group">
                        <label><Filter size={14} /> Class Group</label>
                        <select 
                            className="tool-select" 
                            value={selectedClass} 
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            <option value="">All Classes</option>
                            {classes.map(c => <option key={c._id || c} value={c.name || c}>{c.name || c}</option>)}
                        </select>
                    </div>
                    <div className="tool-spacer"></div>
                    <div className="tool-search">
                        <Search size={16} />
                        <input 
                            type="text" 
                            placeholder="Find by name or roll..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="records-main">
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Syncing records...</p>
                    </div>
                ) : filteredRecords.length === 0 ? (
                    <div className="empty-state-card glass">
                        <div className="empty-icon-wrap">
                            <History size={40} />
                        </div>
                        <h3>No logs found</h3>
                        <p>Adjust your filters or check a different date to see available records.</p>
                        {selectedClass || searchTerm ? (
                            <button className="reset-link" onClick={() => { setSelectedClass(''); setSearchTerm(''); }}>Clear all filters</button>
                        ) : null}
                    </div>
                ) : (
                    <div className="table-responsive glass">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Student Entry</th>
                                    <th>Roll No</th>
                                    <th>Class Section</th>
                                    <th>Status</th>
                                    <th className="text-right">Activity</th>
                                </tr>
                            </thead>
                            <tbody>
                                 {filteredRecords.map((record, index) => (
                                    <tr key={record._id} className={`slide-up stagger-${(index % 10) + 1}`}>
                                        <td>
                                            <div className="student-profile-cell">
                                                <div className="mini-avatar">{record.student.name.charAt(0)}</div>
                                                <span className="profile-name">{record.student.name}</span>
                                            </div>
                                        </td>
                                        <td><span className="badge-outline">{record.student.rollNo}</span></td>
                                        <td><span className="class-label">{record.student.class}</span></td>
                                        <td>
                                            <div className={`status-indicator ${record.status.toLowerCase()}`}>
                                                <div className="indicator-dot"></div>
                                                <span>{record.status}</span>
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <button className="row-action-btn">
                                                <span>View Log</span>
                                                <ChevronRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`
                .attendance-records {
                    display: flex;
                    flex-direction: column;
                    gap: 1.75rem;
                }
                .controls-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .filter-toolbar {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem 1.25rem;
                    border-radius: var(--radius-lg);
                    gap: 1.25rem;
                }
                .tool-group {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .tool-group label {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: var(--text-sub);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .tool-input, .tool-select {
                    background: transparent;
                    border: none;
                    color: var(--text-main);
                    font-weight: 600;
                    font-size: 0.85rem;
                    outline: none;
                    cursor: pointer;
                    font-family: inherit;
                }
                .tool-divider {
                    width: 1px;
                    height: 32px;
                    background: var(--border);
                }
                .tool-spacer { flex: 1; }
                .tool-search {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: var(--bg-subtle);
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                    min-width: 260px;
                    transition: all 0.2s;
                }
                .tool-search:focus-within {
                    border-color: var(--primary);
                    background: white;
                    box-shadow: 0 0 0 3px rgba(75, 107, 80, 0.08);
                }
                .tool-search input {
                    background: transparent;
                    border: none;
                    outline: none;
                    width: 100%;
                    font-size: 0.85rem;
                    color: var(--text-main);
                }
                .tool-search input::placeholder { color: var(--text-muted); }

                .table-responsive { border-radius: var(--radius-xl); overflow: hidden; }
                .custom-table { width: 100%; border-collapse: collapse; }
                .custom-table th {
                    background: var(--bg-subtle); padding: 1rem 1.5rem;
                    text-align: left; font-size: 0.75rem; font-weight: 800;
                    color: var(--text-sub); text-transform: uppercase; letter-spacing: 0.05em;
                }
                .custom-table td {
                    padding: 1rem 1.5rem; border-bottom: 1px solid var(--border);
                    vertical-align: middle;
                }
                .custom-table tr {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .custom-table tr:hover { 
                    background: rgba(255, 255, 255, 0.5); 
                    transform: scale(1.002);
                }

                .student-profile-cell { display: flex; align-items: center; gap: 12px; }
                .mini-avatar {
                    width: 32px; height: 32px; background: var(--primary);
                    color: white; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 700; font-size: 0.8rem;
                }
                .profile-name { font-weight: 600; color: var(--text-main); font-size: 0.9rem; }
                
                .badge-outline {
                    padding: 3px 8px; border: 1.5px solid var(--border);
                    border-radius: 6px; font-weight: 700; font-size: 0.75rem;
                    color: var(--text-sub);
                }
                .class-label { font-size: 0.85rem; font-weight: 600; color: var(--text-sub); }

                .status-indicator {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 0.75rem;
                    letter-spacing: 0.02em;
                }
                .indicator-dot { width: 6px; height: 6px; border-radius: 50%; }
                
                .status-indicator.present { background: var(--success-bg); color: var(--success); }
                .status-indicator.present .indicator-dot { background: var(--success); }
                
                .status-indicator.absent { background: var(--danger-bg); color: var(--danger); }
                .status-indicator.absent .indicator-dot { background: var(--danger); }
                
                .status-indicator.late { background: var(--warning-bg); color: var(--warning); }
                .status-indicator.late .indicator-dot { background: var(--warning); }

                .text-right { text-align: right; }
                .row-action-btn {
                    background: transparent; color: var(--primary);
                    font-weight: 700; font-size: 0.8rem;
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 6px 12px; border-radius: 8px;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .row-action-btn:hover { background: var(--bg-subtle); transform: translateX(4px); }

                .empty-state-card {
                    padding: 5rem 2rem; display: flex; flex-direction: column;
                    align-items: center; text-align: center; gap: 1.25rem;
                    border-radius: var(--radius-xl);
                }
                .empty-icon-wrap {
                    width: 80px; height: 80px; background: var(--bg-subtle);
                    border-radius: 50%; display: flex; align-items: center;
                    justify-content: center; color: var(--text-muted); opacity: 0.5;
                }
                .reset-link {
                    background: transparent; color: var(--primary);
                    font-weight: 600; font-size: 0.85rem; text-decoration: underline;
                    margin-top: 0.5rem;
                }

                .loading-container { padding: 5rem; text-align: center; color: var(--text-muted); }
                .spinner {
                    width: 32px; height: 32px; border: 3px solid var(--bg-subtle);
                    border-top-color: var(--primary); border-radius: 50%;
                    margin: 0 auto 1.25rem; animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                @media (max-width: 900px) {
                    .filter-toolbar { flex-wrap: wrap; gap: 1rem; }
                    .tool-spacer, .tool-divider { display: none; }
                    .tool-search { min-width: 100%; order: 3; }
                }
                @media (max-width: 600px) {
                    .page-header { flex-direction: column; align-items: stretch; gap: 1rem; }
                    .action-btn { width: 100%; justify-content: center; }
                    .tool-group { width: 45%; }
                    .custom-table { min-width: 600px; }
                }
            `}</style>
        </div>
    );
};

export default AttendanceRecords;
