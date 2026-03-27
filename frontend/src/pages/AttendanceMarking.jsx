import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, Check, X, Clock, Save, ChevronRight, UserCheck, Users, AlertCircle } from 'lucide-react';

const AttendanceMarking = () => {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [attendance, setAttendance] = useState({}); // studentId: status
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchStudentsAndClasses();
    }, []);

    const fetchStudentsAndClasses = async () => {
        try {
            const [stRes, clRes] = await Promise.all([
                api.get('/students'),
                api.get('/classes')
            ]);
            setStudents(stRes.data);
            setClasses(clRes.data);
            
            // Initialize attendance: all null by default
            const initialAttendance = {};
            stRes.data.forEach(s => initialAttendance[s._id] = null);
            setAttendance(initialAttendance);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = selectedClass === 'All Classes' 
        ? students 
        : students.filter(s => s.class === selectedClass);

    const handleMarkAllPresent = () => {
        const markedAll = { ...attendance };
        filteredStudents.forEach(s => markedAll[s._id] = 'Present');
        setAttendance(markedAll);
    };

    const handleStatusChange = (studentId, status) => {
        setAttendance({ ...attendance, [studentId]: status });
    };

    const handleSubmit = async () => {
        // Check if all filtered students are marked
        const unmarkedCount = filteredStudents.filter(s => !attendance[s._id]).length;
        if (unmarkedCount > 0) {
            setMessage({ type: 'error', text: `Please mark attendance for all students (${unmarkedCount} remaining).` });
            return;
        }

        setSaving(true);
        try {
            const attendanceRecords = filteredStudents.map(s => ({
                studentId: s._id,
                status: attendance[s._id]
            }));
            await api.post('/attendance', { attendanceRecords, date });
            setMessage({ type: 'success', text: 'Attendance records saved successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save records.' });
        } finally {
            setSaving(false);
        }
    };

    const getStats = () => {
        const counts = { Present: 0, Absent: 0, Late: 0, Unmarked: 0 };
        filteredStudents.forEach(s => {
            const status = attendance[s._id];
            if (status) counts[status]++;
            else counts.Unmarked++;
        });
        return counts;
    };

    const stats = getStats();

    return (
        <div className="attendance-marking fade-in">
            <header className="page-header">
                <div className="header-title">
                    <h1>Mark Attendance</h1>
                    <p>Daily roll call for academic sessions.</p>
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
                    <div className="date-input-wrap glass">
                        <Calendar size={16} />
                        <input 
                            type="date" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <button className="icon-btn-text primary" onClick={handleMarkAllPresent} disabled={filteredStudents.length === 0}>
                        <UserCheck size={18} />
                        <span>Mark All Present</span>
                    </button>
                </div>
            </header>

            {message && (
                <div className={`notification-banner ${message.type}`}>
                    {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                    <span>{message.text}</span>
                    <button className="close-notif" onClick={() => setMessage(null)}>×</button>
                </div>
            )}

            <div className="marking-layout">
                <div className="marking-main">
                    <div className="list-card glass">
                        <div className="list-card-header">
                            <div className="header-info">
                                <Users size={18} />
                                <span>{filteredStudents.length} Students in Roster</span>
                            </div>
                            <div className="header-stats">
                                <span className="stat-label">Unmarked: <span className="stat-val">{stats.Unmarked}</span></span>
                            </div>
                        </div>

                        <div className="student-rows-container custom-scrollbar">
                            {loading ? (
                                <div className="loading-state slide-up stagger-1">
                                    <div className="spinner"></div>
                                    <p>Retrieving roster...</p>
                                </div>
                            ) : filteredStudents.length === 0 ? (
                                <div className="empty-state-simple slide-up stagger-1">
                                    <Users size={40} />
                                    <p>No students found for the selected category.</p>
                                </div>
                            ) : (
                                filteredStudents.map((student, index) => (
                                    <div key={student._id} className={`marking-row slide-up stagger-${(index % 8) + 1}`}>
                                        <div className="student-profile">
                                            <div className="student-avatar-box">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div className="student-info-text">
                                                <div className="student-name">{student.name}</div>
                                                <div className="student-meta">Roll: {student.rollNo} • {student.class}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="status-selector-group">
                                            <button 
                                                className={`status-chip present ${attendance[student._id] === 'Present' ? 'active' : ''}`}
                                                onClick={() => handleStatusChange(student._id, 'Present')}
                                            >
                                                <Check size={14} />
                                                <span>Present</span>
                                            </button>
                                            <button 
                                                className={`status-chip absent ${attendance[student._id] === 'Absent' ? 'active' : ''}`}
                                                onClick={() => handleStatusChange(student._id, 'Absent')}
                                            >
                                                <X size={14} />
                                                <span>Absent</span>
                                            </button>
                                            <button 
                                                className={`status-chip late ${attendance[student._id] === 'Late' ? 'active' : ''}`}
                                                onClick={() => handleStatusChange(student._id, 'Late')}
                                            >
                                                <Clock size={14} />
                                                <span>Late</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="marking-sidebar slide-up stagger-2">
                    <div className="summary-card glass scale-in">
                        <h3>Session Summary</h3>
                        <div className="stat-blocks-grid">
                            <div className="stat-block present slide-up stagger-3">
                                <span className="stat-num">{stats.Present}</span>
                                <span className="stat-name">Present</span>
                            </div>
                            <div className="stat-block absent slide-up stagger-4">
                                <span className="stat-num">{stats.Absent}</span>
                                <span className="stat-name">Absent</span>
                            </div>
                            <div className="stat-block late slide-up stagger-5">
                                <span className="stat-num">{stats.Late}</span>
                                <span className="stat-name">Late</span>
                            </div>
                        </div>
                        
                        <div className="submission-prompt slide-up stagger-5">
                            <p>Verify all marked statuses before finalizing the records for this session.</p>
                            <button 
                                className="action-btn primary full-width" 
                                onClick={handleSubmit}
                                disabled={saving || loading || filteredStudents.length === 0}
                            >
                                {saving ? (
                                    <>
                                        <div className="spinner-mini"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Submit Records</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .attendance-marking {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .selector-wrapper { padding: 2px 4px; border-radius: var(--radius-md); }
                .class-selector {
                    padding: 0.55rem 0.8rem; border: none; background: transparent;
                    color: var(--text-main); font-weight: 600; font-size: 0.85rem; outline: none;
                }
                .date-input-wrap {
                    display: flex; align-items: center; gap: 8px;
                    padding: 0.55rem 0.8rem; border-radius: var(--radius-md);
                    color: var(--text-muted);
                }
                .date-input-wrap input {
                    border: none; background: transparent; outline: none;
                    color: var(--text-main); font-family: inherit; font-size: 0.85rem; font-weight: 600;
                }
                .icon-btn-text {
                    font-weight: 700 !important;
                }

                .notification-banner {
                    display: flex; align-items: center; gap: 12px;
                    padding: 0.875rem 1.25rem; border-radius: var(--radius-md);
                    font-size: 0.9rem; font-weight: 500; position: relative;
                }
                .notification-banner.success { background: var(--success-bg); color: var(--success); }
                .notification-banner.error { background: var(--danger-bg); color: var(--danger); }
                .close-notif { position: absolute; right: 1rem; font-size: 1.2rem; cursor: pointer; opacity: 0.6; }

                .marking-layout {
                    display: grid; grid-template-columns: 1fr 300px; gap: 1.5rem;
                    align-items: start;
                }
                .list-card { border-radius: var(--radius-xl); overflow: hidden; }
                .list-card-header {
                    padding: 1.25rem 1.5rem; background: var(--bg-subtle);
                    display: flex; justify-content: space-between; align-items: center;
                    border-bottom: 1px solid var(--border);
                }
                .header-info { display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--text-main); font-size: 0.9rem; }
                .stat-label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); }
                .stat-val { color: var(--primary); font-weight: 800; }

                .student-rows-container {
                    padding: 0.75rem; max-height: calc(100vh - 350px); overflow-y: auto;
                }
                .marking-row {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 0.85rem 1.15rem; border-radius: var(--radius-lg);
                    margin-bottom: 0.5rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid transparent;
                }
                .marking-row:hover { 
                    background: rgba(255, 255, 255, 0.5); 
                    border-color: var(--border); 
                    transform: translateX(4px);
                    box-shadow: var(--shadow-sm);
                }

                .student-profile { display: flex; align-items: center; gap: 12px; }
                .student-avatar-box {
                    width: 38px; height: 38px; background: var(--primary); color: white;
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    font-weight: 700; font-size: 0.9rem;
                }
                .student-name { font-weight: 700; color: var(--text-main); font-size: 0.95rem; }
                .student-meta { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }

                .status-selector-group { display: flex; gap: 6px; }
                .status-chip {
                    display: flex; align-items: center; gap: 8px; padding: 0.6rem 1rem;
                    border-radius: 10px; font-weight: 700; font-size: 0.775rem;
                    background: var(--bg-card); color: var(--text-sub);
                    border: 1.5px solid var(--border);
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .status-chip:hover { transform: translateY(-1px); border-color: var(--primary); color: var(--primary); }
                .status-chip.active { color: white !important; }
                
                .status-chip.present.active { background: var(--success); box-shadow: 0 3px 8px var(--success-bg); }
                .status-chip.absent.active { background: var(--danger); box-shadow: 0 3px 8px var(--danger-bg); }
                .status-chip.late.active { background: var(--warning); box-shadow: 0 3px 8px var(--warning-bg); }

                .summary-card { padding: 1.5rem; border-radius: var(--radius-xl); display: flex; flex-direction: column; gap: 1.25rem; }
                .summary-card h3 { font-size: 1.1rem; }
                .stat-blocks-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
                .stat-block {
                    display: flex; flex-direction: column; align-items: center; padding: 12px 4px;
                    border-radius: var(--radius-md); background: var(--bg-subtle);
                }
                .stat-num { font-size: 1.25rem; font-weight: 800; font-family: 'Outfit', sans-serif; }
                .stat-name { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
                
                .stat-block.present { color: var(--success); }
                .stat-block.absent { color: var(--danger); }
                .stat-block.late { color: var(--warning); }

                .submission-prompt {
                    padding-top: 1.25rem; border-top: 1px solid var(--border);
                    display: flex; flex-direction: column; gap: 1.25rem;
                }
                .submission-prompt p { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; }
                .full-width { width: 100%; justify-content: center; }

                .loading-state { padding: 4rem; text-align: center; color: var(--text-muted); }
                .spinner {
                    width: 30px; height: 30px; border: 3px solid var(--bg-subtle);
                    border-top-color: var(--primary); border-radius: 50%;
                    margin: 0 auto 1rem; animation: spin 1s linear infinite;
                }
                .spinner-mini {
                    width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white; border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                @media (max-width: 900px) {
                    .marking-layout { grid-template-columns: 1fr; }
                    .marking-sidebar { order: -1; }
                }
                @media (max-width: 600px) {
                    .page-header { flex-direction: column; align-items: stretch; gap: 1.25rem; }
                    .header-actions { flex-direction: column; width: 100%; }
                    .selector-wrapper, .date-input-wrap, .icon-btn-text { width: 100%; justify-content: center; }
                    .marking-row { flex-direction: column; align-items: flex-start; gap: 1rem; padding: 1.25rem 1rem; }
                    .status-selector-group { width: 100%; }
                    .status-chip { flex: 1; justify-content: center; }
                }
            `}</style>
        </div>
    );
};

export default AttendanceMarking;
