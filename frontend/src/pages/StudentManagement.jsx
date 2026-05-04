import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, Edit, Trash2, GraduationCap, ChevronLeft, UserPlus, BookOpen, Users, Grid, ArrowLeft } from 'lucide-react';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [viewMode, setViewMode] = useState('classes'); // 'classes' or 'students'
    const [selectedClass, setSelectedClass] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', rollNo: '', universityRollNo: '', class: '' });
    const [classForm, setClassForm] = useState({ name: '', subjectName: '' });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [stRes, clRes] = await Promise.all([
                api.get('/students'),
                api.get('/classes')
            ]);
            setStudents(stRes.data);
            setClasses(clRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/students');
            setStudents(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveClass = async (e) => {
        e.preventDefault();
        try {
            await api.post('/classes', classForm);
            fetchInitialData();
            setIsClassModalOpen(false);
            setClassForm({ name: '', subjectName: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving class');
        }
    };

    const handleDeleteClass = async (id) => {
        if (window.confirm('Are you sure you want to delete this class? Students will remain but won\'t be grouped here.')) {
            try {
                await api.delete(`/classes/${id}`);
                fetchInitialData();
            } catch (err) {
                alert('Error deleting class');
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingStudent) {
                await api.put(`/students/${editingStudent._id}`, formData);
            } else {
                await api.post('/students', formData);
            }
            fetchInitialData();
            closeModal();
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving student');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.delete(`/students/${id}`);
                fetchStudents();
            } catch (err) {
                alert('Error deleting student');
            }
        }
    };

    const openModal = (student = null) => {
        if (student) {
            setEditingStudent(student);
            setFormData({ 
                name: student.name, 
                email: student.email || '',
                rollNo: student.rollNo, 
                universityRollNo: student.universityRollNo,
                class: student.class
            });
        } else {
            setEditingStudent(null);
            setFormData({ name: '', email: '', rollNo: '', universityRollNo: '', class: selectedClass ? selectedClass.name : '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingStudent(null);
    };

    const filteredStudents = (selectedClass ? students.filter(s => s.class === selectedClass.name) : students).filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.rollNo.includes(searchTerm) ||
        (s.universityRollNo && s.universityRollNo.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="student-management">
            <div className="main-layout slide-up">
                <div className="content-area">
                    {loading ? (
                        <div className="loading-wrapper fade-in">
                            <div className="loading-card glass scale-in">
                                <div className="spinner-box">
                                    <GraduationCap size={40} />
                                    <div className="pulse-ring"></div>
                                </div>
                                <h3>Syncing Academic Data</h3>
                                <p>Please wait while we fetch your classes and student records.</p>
                                <div className="loading-bar-container">
                                    <div className="loading-bar-fill"></div>
                                </div>
                            </div>
                        </div>
                    ) : !selectedClass ? (
                        <div className="class-selection-view fade-in">
                            <header className="page-header">
                                <div className="header-title">
                                    <h1>Academic Sections</h1>
                                    <p>Select a class box to manage student enrollments and records.</p>
                                </div>
                                <button className="add-btn primary" onClick={() => setIsClassModalOpen(true)}>
                                    <Plus size={18} />
                                    <span>Create New Class</span>
                                </button>
                            </header>

                            <div className="classes-grid custom-scrollbar">
                                {classes.map((cls, index) => (
                                    <div 
                                        key={cls._id} 
                                        className={`class-card glass slide-up stagger-${(index % 8) + 1}`}
                                        onClick={() => setSelectedClass(cls)}
                                    >
                                        <div className="class-card-header">
                                            <div className="class-icon-box">
                                                <GraduationCap size={24} />
                                            </div>
                                            <button className="delete-class-btn" onClick={(e) => { e.stopPropagation(); handleDeleteClass(cls._id); }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="class-card-body">
                                            <h3>{cls.name}</h3>
                                            <p>{cls.subjectName}</p>
                                            <div className="student-count-badge">
                                                <Users size={14} />
                                                <span>{cls.studentCount || 0} Students</span>
                                            </div>
                                        </div>
                                        <div className="class-card-footer">
                                            <span>Manage Roster</span>
                                            <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
                                        </div>
                                    </div>
                                ))}
                                {classes.length === 0 && (
                                    <div className="empty-classes-grid glass slide-up">
                                        <BookOpen size={48} />
                                        <h3>No Classes Defined</h3>
                                        <p>Get started by creating your first academic section below.</p>
                                        <button className="add-btn primary" onClick={() => setIsClassModalOpen(true)}>
                                            <Plus size={18} />
                                            <span>Add Class</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="student-list-container slide-up stagger-2">
                            <header className="page-header unified-command-bar">
                                <div className="header-left">
                                    <button className="back-btn-mini" onClick={() => setSelectedClass(null)} title="Back to Classes">
                                        <ChevronLeft size={22} />
                                    </button>
                                    <div className="breadcrumb-title">
                                        <span className="bc-label">Academic Roster</span>
                                        <span className="bc-separator">/</span>
                                        <h1>{selectedClass?.name}</h1>
                                        <div className="student-count-pill">
                                            {filteredStudents.length} Students
                                        </div>
                                    </div>
                                </div>
                                <div className="header-right">
                                    <div className="unified-search glass">
                                        <Search size={18} />
                                        <input 
                                            type="text" 
                                            placeholder={`Find student in ${selectedClass?.name}...`}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <button className="add-btn primary" onClick={() => openModal()}>
                                        <UserPlus size={18} />
                                        <span>Enlist Student</span>
                                    </button>
                                </div>
                            </header>

                            <div className="table-responsive glass">
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>Roll Number</th>
                                            <th>Student Name</th>
                                            <th>Uni. Roll Number</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStudents.map(student => (
                                            <tr key={student._id}>
                                                <td><span className="roll-number-tag">{student.rollNo}</span></td>
                                                <td>
                                                    <div className="student-info-cell">
                                                        <div className="student-avatar-mini">{student.name.charAt(0)}</div>
                                                        <span className="student-name-text">{student.name}</span>
                                                    </div>
                                                </td>
                                                <td className="uni-roll-text">{student.universityRollNo}</td>
                                                <td className="text-right">
                                                    <div className="action-buttons-group">
                                                        <button className="icon-btn edit" title="Edit Student" onClick={() => openModal(student)}>
                                                            <Edit size={16} />
                                                        </button>
                                                        <button className="icon-btn delete" title="Delete Student" onClick={() => handleDelete(student._id)}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredStudents.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="empty-table-row">
                                                    {searchTerm ? 'No matches found for your search.' : 'No students registered in this class.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Class Modal */}
            {isClassModalOpen && (
                <div className="modal-overlay fade-in">
                    <div className="modal-card glass scale-in">
                        <div className="modal-header">
                            <div>
                                <h2>Define New Class</h2>
                                <p>Set up a new grouping for students.</p>
                            </div>
                            <button className="close-x" onClick={() => setIsClassModalOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleSaveClass}>
                            <div className="modal-body">
                                <div className="form-field">
                                    <label>Section / Class Name</label>
                                    <input 
                                        type="text" required placeholder="e.g. BCA-A"
                                        value={classForm.name}
                                        onChange={(e) => setClassForm({...classForm, name: e.target.value})}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Academic Subject</label>
                                    <input 
                                        type="text" required placeholder="e.g. Software Engineering"
                                        value={classForm.subjectName}
                                        onChange={(e) => setClassForm({...classForm, subjectName: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="action-btn secondary" onClick={() => setIsClassModalOpen(false)}>Cancel</button>
                                <button type="submit" className="action-btn primary">Create Class</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Student Modal */}
            {isModalOpen && (
                <div className="modal-overlay fade-in">
                    <div className="modal-card glass scale-in">
                        <div className="modal-header">
                            <div>
                                <h2>{editingStudent ? 'Update Details' : 'Register Student'}</h2>
                                <p>{editingStudent ? 'Modify the student profile.' : 'Add a new member to this class.'}</p>
                            </div>
                            <button className="close-x" onClick={closeModal}>×</button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="modal-body">
                                <div className="form-field">
                                    <label>Full Legal Name</label>
                                    <input 
                                        type="text" required placeholder="Enter student's full name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Email Address</label>
                                    <input 
                                        type="email" required placeholder="student@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                                <div className="form-row-split">
                                    <div className="form-field">
                                        <label>Class Roll No.</label>
                                        <input 
                                            type="text" required placeholder="e.g. 01"
                                            value={formData.rollNo}
                                            onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Uni. Roll Number</label>
                                        <input 
                                            type="text" required placeholder="e.g. 2115000..."
                                            value={formData.universityRollNo}
                                            onChange={(e) => setFormData({...formData, universityRollNo: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="action-btn secondary" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="action-btn primary">
                                    {editingStudent ? 'Update Profile' : 'Complete Registration'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .student-management {
                    animation: fadeIn 0.4s ease;
                    display: flex;
                    height: 100%; /* Ensure it takes full height */
                }
                .fade-in { animation: fadeIn 0.4s ease; }
                .scale-in { animation: scaleIn 0.3s ease; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

                /* Staggered animations */
                .slide-up {
                    opacity: 0;
                    transform: translateY(20px);
                    animation: slideUp 0.5s ease forwards;
                }
                @keyframes slideUp {
                    to { opacity: 1; transform: translateY(0); }
                }

                .loading-wrapper {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                }
                .loading-card {
                    width: 100%;
                    max-width: 400px;
                    padding: 3rem 2rem;
                    border-radius: var(--radius-xl);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 1.5rem;
                    box-shadow: var(--shadow-lg);
                }
                .spinner-box {
                    position: relative;
                    width: 80px;
                    height: 80px;
                    background: var(--bg-subtle);
                    color: var(--primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 0.5rem;
                }
                .pulse-ring {
                    position: absolute;
                    inset: -4px;
                    border: 2px solid var(--primary);
                    border-radius: 50%;
                    opacity: 0.3;
                    animation: pulse 1.5s ease-out infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(1.3); opacity: 0; }
                }
                .loading-card h3 { font-size: 1.25rem; color: var(--text-main); font-weight: 800; }
                .loading-card p { font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; }
                
                .loading-bar-container {
                    width: 100%;
                    height: 4px;
                    background: var(--bg-subtle);
                    border-radius: 10px;
                    overflow: hidden;
                    margin-top: 0.5rem;
                }
                .loading-bar-fill {
                    height: 100%;
                    width: 30%;
                    background: var(--primary);
                    border-radius: 10px;
                    animation: loadingBar 2s ease-in-out infinite;
                }
                @keyframes loadingBar {
                    0% { transform: translateX(-100%); width: 30%; }
                    50% { width: 60%; }
                    100% { transform: translateX(400%); width: 30%; }
                }

                .stagger-1 { animation-delay: 0.1s; }
                .stagger-2 { animation-delay: 0.2s; }
                .stagger-3 { animation-delay: 0.3s; }
                .stagger-4 { animation-delay: 0.4s; }
                .stagger-5 { animation-delay: 0.5s; }

                .main-layout { display: flex; flex-direction: column; width: 100%; gap: 1.5rem; }
                .content-area { width: 100%; display: flex; flex-direction: column; gap: 1.5rem; }
                
                .class-selection-view { flex: 1; display: flex; flex-direction: column; gap: 2rem; }
                .classes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.5rem;
                    padding-bottom: 2rem;
                }
                
                .class-card {
                    padding: 1.5rem;
                    border-radius: var(--radius-xl);
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid transparent;
                }
                .class-card:hover {
                    transform: translateY(-8px);
                    border-color: var(--primary);
                    box-shadow: 0 12px 30px rgba(75, 107, 80, 0.15);
                }
                
                .class-card-header { display: flex; justify-content: space-between; align-items: flex-start; }
                .class-icon-box {
                    width: 48px; height: 48px; background: var(--bg-subtle); color: var(--primary);
                    border-radius: 12px; display: flex; align-items: center; justify-content: center;
                }
                .delete-class-btn {
                    width: 32px; height: 32px; border-radius: 8px; background: var(--danger-bg); color: var(--danger);
                    display: flex; align-items: center; justify-content: center; opacity: 0; transition: all 0.2s;
                }
                .class-card:hover .delete-class-btn { opacity: 1; }
                .delete-class-btn:hover { background: var(--danger); color: white; }
                
                .class-card-body h3 { font-size: 1.25rem; font-weight: 800; margin-bottom: 4px; }
                .class-card-body p { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }
                .student-count-badge {
                    display: flex; align-items: center; gap: 6px; margin-top: 1rem;
                    color: var(--primary); font-weight: 700; font-size: 0.8rem;
                }
                
                .class-card-footer {
                    margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border);
                    display: flex; justify-content: space-between; align-items: center;
                    font-size: 0.75rem; font-weight: 700; color: var(--primary); opacity: 0.8;
                }
                
                .empty-classes-grid {
                    grid-column: 1 / -1; padding: 5rem 2rem; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; text-align: center; gap: 1.25rem;
                    border-radius: var(--radius-xl); color: var(--text-muted);
                }
                .empty-classes-grid h3 { font-size: 1.5rem; color: var(--text-main); }
                
                .back-to-grid-btn {
                    display: flex; align-items: center; gap: 8px; background: transparent;
                    color: var(--primary); font-weight: 700; font-size: 0.85rem;
                    padding: 6px 12px; border-radius: 8px; margin-bottom: 1.25rem;
                    transition: all 0.2s; border: 1.5px solid var(--primary); width: fit-content;
                }
                .back-to-grid-btn:hover { background: var(--primary); color: white; }
                
                .header-title-flex { display: flex; flex-direction: column; }
                
                .header-title-flex { display: flex; flex-direction: column; }
                
                .unified-command-bar {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 0.75rem 0; border-bottom: 2px solid var(--border);
                    margin-bottom: 2rem; gap: 2rem;
                }
                
                .breadcrumb-title { display: flex; align-items: center; gap: 10px; }
                .bc-label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                .bc-separator { color: var(--border); font-weight: 300; font-size: 1.25rem; }
                .breadcrumb-title h1 { font-size: 1.5rem; font-weight: 800; color: var(--text-main); line-height: 1; }
                
                .student-count-pill {
                    padding: 4px 10px; background: var(--bg-subtle); color: var(--primary);
                    border-radius: 20px; font-size: 0.7rem; font-weight: 800; border: 1px solid var(--border);
                }
                
                .header-right { display: flex; align-items: center; gap: 1.25rem; }
                .unified-search {
                    display: flex; align-items: center; gap: 12px;
                    background: var(--bg-subtle); border: 1.5px solid var(--border);
                    padding: 0.65rem 1.25rem; border-radius: 12px; min-width: 320px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .unified-search:focus-within {
                    border-color: var(--primary); background: white;
                    box-shadow: 0 8px 25px rgba(75, 107, 80, 0.1);
                    transform: translateY(-2px);
                }
                .unified-search input { background: transparent; border: none; outline: none; width: 100%; font-size: 0.9rem; color: var(--text-main); }
                
                .back-btn-mini {
                    width: 42px; height: 42px; border-radius: 12px; display: flex;
                    align-items: center; justify-content: center; background: white;
                    color: var(--primary); transition: all 0.2s; border: 1.5px solid var(--border);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .back-btn-mini:hover { background: var(--primary); color: white; border-color: var(--primary); transform: translateX(-4px); }

                .table-responsive { border-radius: var(--radius-xl); overflow: hidden; }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0; 
                }
                .header-title h1 { font-size: 2rem; margin-bottom: 0.5rem; }
                .header-title p { font-size: 0.9rem; color: var(--text-muted); }

                .class-badge {
                    display: inline-block;
                    padding: 4px 10px;
                    background: var(--primary);
                    color: white;
                    font-size: 0.7rem;
                    font-weight: 700;
                    border-radius: 6px;
                    text-transform: uppercase;
                    margin-bottom: 0.5rem;
                }

                .classes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-top: 2rem;
                }

                .class-card {
                    padding: 1.75rem;
                    border-radius: var(--radius-xl);
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.3s ease;
                    overflow: hidden;
                }
                .class-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--primary);
                    box-shadow: var(--shadow-lg);
                }

                .class-card-icon {
                    width: 50px; height: 50px;
                    background: var(--bg-subtle);
                    color: var(--primary);
                    border-radius: var(--radius-md);
                    display: flex; align-items: center; justify-content: center;
                }
                .class-card-body h3 { font-size: 1.25rem; margin-bottom: 4px; }
                .class-card-body p { font-size: 0.85rem; color: var(--text-muted); }

                .student-count-badge {
                    display: flex; align-items: center; gap: 6px;
                    margin-top: 1rem; color: var(--primary);
                    font-weight: 700; font-size: 0.8rem;
                }

                .delete-class-btn {
                    position: absolute; top: 1.25rem; right: 1.25rem;
                    width: 32px; height: 32px; border-radius: 8px;
                    background: var(--danger-bg); color: var(--danger);
                    display: flex; align-items: center; justify-content: center;
                    opacity: 0; transition: all 0.2s;
                }
                .class-card:hover .delete-class-btn { opacity: 1; }
                .delete-class-btn:hover { background: var(--danger); color: white; }

                .card-footer-tip {
                    margin-top: auto; padding-top: 1rem;
                    border-top: 1px solid var(--border);
                    display: flex; align-items: center; gap: 4px;
                    font-size: 0.75rem; font-weight: 600; color: var(--primary);
                    opacity: 0.8;
                }

                .empty-state {
                    grid-column: 1 / -1;
                    padding: 4rem 2rem;
                    display: flex; flex-direction: column; align-items: center;
                    gap: 1.25rem; text-align: center;
                    border-radius: var(--radius-xl);
                }
                .empty-icon { color: var(--text-muted); opacity: 0.3; }

                .table-controls { padding: 1rem 1.5rem; border-radius: var(--radius-lg); margin-bottom: 1.5rem; }
                .search-wrapper {
                    display: flex; align-items: center; gap: 12px;
                    background: var(--bg-subtle); border: 1px solid var(--border);
                    padding: 0.6rem 1.25rem; border-radius: var(--radius-md);
                }
                .search-wrapper input {
                    background: transparent; border: none; outline: none;
                    width: 100%; color: var(--text-main); font-size: 0.9rem;
                }

                .table-responsive { border-radius: var(--radius-xl); overflow: hidden; }
                .custom-table { width: 100%; border-collapse: collapse; }
                .custom-table th {
                    background: var(--bg-subtle); padding: 1.1rem 1.5rem;
                    text-align: left; font-size: 0.75rem; font-weight: 700;
                    color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;
                }
                .custom-table td {
                    padding: 1.1rem 1.5rem; border-bottom: 1px solid var(--border);
                    vertical-align: middle;
                }
                .custom-table tr:hover { background: rgba(75, 107, 80, 0.02); }

                .roll-number-tag {
                    display: inline-block; padding: 4px 10px;
                    background: var(--success-bg); color: var(--success);
                    font-weight: 700; font-size: 0.8rem; border-radius: 6px;
                }
                .student-info-cell { display: flex; align-items: center; gap: 12px; }
                .student-avatar-mini {
                    width: 32px; height: 32px; background: var(--primary);
                    color: white; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 700; font-size: 0.8rem;
                }
                .student-name-text { font-weight: 600; color: var(--text-main); }
                .uni-roll-text { font-size: 0.85rem; color: var(--text-muted); font-family: monospace; }
                .text-right { text-align: right; }
                .action-buttons-group { display: flex; justify-content: flex-end; gap: 6px; }
                .icon-btn {
                    width: 34px; height: 34px; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s;
                }
                .icon-btn.edit { background: var(--bg-subtle); color: var(--primary); }
                .icon-btn.edit:hover { background: var(--primary); color: white; }
                .icon-btn.delete { background: var(--danger-bg); color: var(--danger); }
                .icon-btn.delete:hover { background: var(--danger); color: white; }
                .empty-table-row { padding: 3rem; text-align: center; color: var(--text-muted); font-style: italic; }

                .modal-overlay {
                    position: fixed; inset: 0; background: rgba(26, 43, 28, 0.4);
                    backdrop-filter: blur(8px); display: flex; align-items: center;
                    justify-content: center; z-index: 2000; padding: 1.5rem;
                }
                .modal-card { width: 100%; max-width: 500px; padding: 2.25rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); }
                .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .modal-header h2 { font-size: 1.5rem; }
                .modal-header p { font-size: 0.85rem; }
                .close-x { font-size: 1.75rem; color: var(--text-muted); line-height: 1; }
                .modal-body { display: flex; flex-direction: column; gap: 1.25rem; }
                .form-field { display: flex; flex-direction: column; gap: 6px; }
                .form-field label { font-size: 0.85rem; font-weight: 600; color: var(--text-main); }
                .form-field input {
                    padding: 0.75rem 1rem; border-radius: var(--radius-md);
                    border: 1.5px solid var(--border); font-size: 0.9rem;
                    color: var(--text-main); transition: all 0.2s;
                }
                .form-field input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 3px rgba(75, 107, 80, 0.1); }
                .form-row-split { display: grid; grid-template-columns: 1fr 1.2fr; gap: 1rem; }
                .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 2rem; }
                .action-btn.secondary { background: var(--bg-subtle) !important; border-color: var(--primary) !important; color: var(--text-main) !important; }

                @media (max-width: 768px) {
                    .page-header { flex-direction: column; align-items: stretch; gap: 1.25rem; }
                    .form-row-split { grid-template-columns: 1fr; }
                    .custom-table { min-width: 600px; }
                }
            `}</style>
        </div>
    );
};

export default StudentManagement;
