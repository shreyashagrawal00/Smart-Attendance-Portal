import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, Filter, Download, User, Search, ChevronRight, History } from 'lucide-react';

const AttendanceRecords = () => {
    const [records, setRecords] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState('');
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present': return 'var(--success)';
            case 'Absent': return 'var(--danger)';
            case 'Late': return 'var(--warning)';
            default: return 'var(--secondary)';
        }
    };

    const handleExportCSV = () => {
        if (records.length === 0) return alert('No records to export');
        
        const headers = ['Student Name', 'Roll No', 'Class', 'Status', 'Date'];
        const csvRows = [
            headers.join(','),
            ...records.map(r => [
                `"${r.student.name}"`,
                r.student.rollNo,
                r.student.class,
                r.status,
                date
            ].join(','))
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

    return (
        <div className="attendance-records">
            <header className="page-header">
                <div>
                    <h1>Attendance History</h1>
                    <p>Review and filter past attendance records.</p>
                </div>
                <button className="export-btn" onClick={handleExportCSV}>
                    <Download size={18} />
                    <span>Export CSV</span>
                </button>
            </header>

            <div className="filter-bar glass">
                <div className="filter-group">
                    <label><Calendar size={16} /> Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="filter-group">
                    <label><Filter size={16} /> Class</label>
                    <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                        <option value="">All Classes</option>
                        {classes.map(c => <option key={c._id || c} value={c.name || c}>{c.name || c}</option>)}
                    </select>
                </div>
                <div className="search-mini">
                    <Search size={16} />
                    <input type="text" placeholder="Search student..." />
                </div>
            </div>

            <div className="records-grid">
                {loading ? (
                    <div className="loading">Fetching records...</div>
                ) : records.length === 0 ? (
                    <div className="empty-state glass">
                        <History size={48} className="empty-icon" />
                        <h3>No records found</h3>
                        <p>Try changing the date or class filter.</p>
                    </div>
                ) : (
                    <div className="table-wrapper glass">
                        <table className="records-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Roll No</th>
                                    <th>Class</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map(record => (
                                    <tr key={record._id}>
                                        <td>
                                            <div className="st-cell">
                                                <div className="avatar-mini">{record.student.name.charAt(0)}</div>
                                                <span>{record.student.name}</span>
                                            </div>
                                        </td>
                                        <td>{record.student.rollNo}</td>
                                        <td>{record.student.class}</td>
                                        <td>
                                            <span className="status-badge" style={{ 
                                                backgroundColor: `${getStatusColor(record.status)}15`, 
                                                color: getStatusColor(record.status),
                                                borderColor: `${getStatusColor(record.status)}30`
                                            }}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="view-details">
                                                <span>Details</span>
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
                    gap: 1.5rem;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .export-btn {
                    background: var(--bg-card);
                    color: var(--primary);
                    border: 1px solid var(--border);
                    padding: 0.75rem 1.25rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .export-btn:hover { background: rgba(109, 139, 116, 0.1); }
                
                .filter-bar {
                    padding: 1.25rem;
                    border-radius: 16px;
                    display: flex;
                    gap: 2rem;
                    align-items: center;
                }
                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .filter-group label {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--secondary);
                }
                .filter-group input, .filter-group select {
                    padding: 0.5rem 0.75rem;
                    border-radius: 8px;
                    border: 1px solid var(--border);
                    background: var(--bg-card);
                    color: var(--text-main);
                    outline: none;
                    font-family: inherit;
                }
                .search-mini {
                    margin-left: auto;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    padding: 0.6rem 1rem;
                    border-radius: 10px;
                    width: 240px;
                }
                .search-mini input {
                    background: transparent;
                    border: none;
                    outline: none;
                    width: 100%;
                }
                
                .table-wrapper {
                    border-radius: 20px;
                    overflow: hidden;
                }
                .records-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .records-table th {
                    background: rgba(109, 139, 116, 0.05);
                    padding: 1rem 1.5rem;
                    text-align: left;
                    font-size: 0.85rem;
                    color: var(--primary);
                }
                .records-table td {
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid var(--border);
                }
                .st-cell {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 600;
                }
                .avatar-mini {
                    width: 32px;
                    height: 32px;
                    background: rgba(109, 139, 116, 0.1);
                    color: var(--primary);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.85rem;
                }
                .status-badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    border: 1px solid transparent;
                }
                .view-details {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    background: transparent;
                    color: var(--primary);
                    font-size: 0.85rem;
                    font-weight: 600;
                }
                .empty-state {
                    padding: 4rem;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }
                .empty-icon { color: var(--border); }
                .empty-state h3 { color: var(--text-main); }
                .empty-state p { color: var(--secondary); }
            `}</style>
        </div>
    );
};

export default AttendanceRecords;
