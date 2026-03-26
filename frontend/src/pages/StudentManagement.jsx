import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, UserPlus, Edit, Trash2, Filter, GraduationCap, ChevronLeft } from 'lucide-react';

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
    const [formData, setFormData] = useState({ name: '', rollNo: '', universityRollNo: '', class: '' });
    const [classForm, setClassForm] = useState({ name: '', description: '' });

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

    const handleSaveClass = async (e) => {
        e.preventDefault();
        try {
            await api.post('/classes', classForm);
            fetchInitialData();
            setIsClassModalOpen(false);
            setClassForm({ name: '', description: '' });
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
                rollNo: student.rollNo, 
                universityRollNo: student.universityRollNo,
                class: student.class
            });
        } else {
            setEditingStudent(null);
            setFormData({ name: '', rollNo: '', universityRollNo: '', class: '' });
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
            <style>{`
                .classes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.5rem;
                    margin-top: 1rem;
                }
                .class-card {
                    padding: 2rem;
                    border-radius: 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: center;
                    position: relative;
                }
                .class-card:hover { transform: translateY(-5px); box-shadow: var(--shadow); }
                .class-icon { 
                    width: 60px; height: 60px; border-radius: 18px; background: #eef2ff; color: var(--primary);
                    display: flex; align-items: center; justify-content: center;
                }
                .class-info h3 { font-size: 1.25rem; margin-bottom: 4px; }
                .class-info p { font-size: 0.9rem; color: var(--secondary); }
                .class-student-count { font-weight: 600; color: var(--primary); font-size: 0.85rem; }
                
                .back-btn { display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--secondary); margin-bottom: 1rem; }
                .class-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
            `}</style>

            {viewMode === 'classes' ? (
                <>
                    <header className="page-header">
                        <div>
                            <h1>Academic Classes</h1>
                            <p>Manage school classes and departments.</p>
                        </div>
                        <button className="add-btn" onClick={() => setIsClassModalOpen(true)}>
                            <Plus size={20} />
                            <span>Add Class</span>
                        </button>
                    </header>
                    <div className="classes-grid">
                        {classes.map(cls => (
                            <div key={cls._id} className="class-card glass" onClick={() => { setSelectedClass(cls); setViewMode('students'); }}>
                                <div className="class-icon"><GraduationCap size={32} /></div>
                                <div className="class-info">
                                    <h3>{cls.name}</h3>
                                    <p>{cls.description || 'No description'}</p>
                                </div>
                                <div className="class-student-count">
                                    {students.filter(s => s.class === cls.name).length} Students
                                </div>
                                <button className="delete-class-mini" onClick={(e) => { e.stopPropagation(); handleDeleteClass(cls._id); }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <button className="back-btn" onClick={() => { setViewMode('classes'); setSelectedClass(null); }}>
                        <ChevronLeft size={20} /> <span>Back to Categories</span>
                    </button>
                    <header className="class-header-row">
                        <div>
                            <h1>Class {selectedClass?.name}</h1>
                            <p>{students.filter(s => s.class === selectedClass?.name).length} registered students.</p>
                        </div>
                        <button className="add-btn" onClick={() => { setFormData({...formData, class: selectedClass.name}); setIsModalOpen(true); }}>
                            <Plus size={20} />
                            <span>Add Student to {selectedClass?.name}</span>
                        </button>
                    </header>

                    <div className="tbl-actions glass">
                        <div className="search-box">
                            <Search size={18} />
                            <input 
                                type="text" 
                                placeholder="Search by name, roll no..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="table-container glass custom-scrollbar">
                        <table className="student-table">
                            <thead>
                                <tr>
                                    <th>Roll No</th>
                                    <th>Name</th>
                                    <th>Uni. Roll No</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(student => (
                                    <tr key={student._id}>
                                        <td><span className="roll-badge">{student.rollNo}</span></td>
                                        <td className="st-name">{student.name}</td>
                                        <td className="st-email">{student.universityRollNo}</td>
                                        <td>
                                            <div className="actions">
                                                <button className="edit-btn" onClick={() => openModal(student)}>
                                                    <Edit size={16} />
                                                </button>
                                                <button className="delete-btn" onClick={() => handleDelete(student._id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {isClassModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass">
                        <h2>Add New Class</h2>
                        <form onSubmit={handleSaveClass}>
                            <div className="form-group">
                                <label>Class Name</label>
                                <input 
                                    type="text" required placeholder="e.g. 10-A"
                                    value={classForm.name}
                                    onChange={(e) => setClassForm({...classForm, name: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input 
                                    type="text" placeholder="e.g. Science Batch 2024"
                                    value={classForm.description}
                                    onChange={(e) => setClassForm({...classForm, description: e.target.value})}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsClassModalOpen(false)}>Cancel</button>
                                <button type="submit" className="save-btn">Create Class</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass">
                        <h2>{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input 
                                    type="text" required 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Roll Number</label>
                                    <input 
                                        type="text" required 
                                        value={formData.rollNo}
                                        onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Class/Section</label>
                                    <input 
                                        type="text" required 
                                        value={formData.class}
                                        onChange={(e) => setFormData({...formData, class: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>University Roll Number</label>
                                <input 
                                    type="text" required 
                                    value={formData.universityRollNo}
                                    onChange={(e) => setFormData({...formData, universityRollNo: e.target.value})}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="save-btn">Save Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .student-management {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .add-btn {
                    background: var(--primary);
                    color: white;
                    padding: 0.75rem 1.25rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .add-btn:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                }
                .tbl-actions {
                    padding: 1rem;
                    border-radius: 16px;
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                .search-box {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: #f1f5f9;
                    padding: 0.6rem 1rem;
                    border-radius: 10px;
                }
                .search-box input {
                    background: transparent;
                    border: none;
                    outline: none;
                    width: 100%;
                }
                .filter-btn {
                    padding: 0.6rem 1rem;
                    border-radius: 10px;
                    background: #f1f5f9;
                    color: var(--secondary);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 500;
                }
                .table-container {
                    border-radius: 20px;
                    overflow: hidden;
                    overflow-x: auto;
                }
                .student-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }
                .student-table th {
                    background: #f8fafc;
                    padding: 1rem 1.5rem;
                    font-weight: 600;
                    color: var(--secondary);
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .student-table td {
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid var(--border);
                }
                .delete-class-mini {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    width: 30px;
                    height: 30px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--danger);
                    background: #fef2f2;
                    opacity: 0;
                    transition: all 0.2s;
                }
                .class-card:hover .delete-class-mini { opacity: 1; }
                .delete-class-mini:hover { background: var(--danger); color: white; }
                
                .roll-badge {
                    background: #eef2ff;
                    color: var(--primary);
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 0.85rem;
                }
                .st-name {
                    font-weight: 600;
                }
                .st-email {
                    color: var(--secondary);
                    font-size: 0.9rem;
                }
                .actions {
                    display: flex;
                    gap: 8px;
                }
                .actions button {
                    width: 34px;
                    height: 34px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .edit-btn { background: #ecfdf5; color: var(--success); }
                .edit-btn:hover { background: var(--success); color: white; }
                .delete-btn { background: #fef2f2; color: var(--danger); }
                .delete-btn:hover { background: var(--danger); color: white; }
                
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    backdrop-filter: blur(4px);
                }
                .modal-content {
                    width: 100%;
                    max-width: 500px;
                    padding: 2rem;
                    border-radius: 24px;
                }
                .modal-content h2 { margin-bottom: 1.5rem; }
                .form-group { margin-bottom: 1.25rem; }
                .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem; }
                .form-group input { 
                    width: 100%; 
                    padding: 0.75rem; 
                    border-radius: 10px; 
                    border: 1.5px solid var(--border); 
                    outline: none;
                }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 2rem; }
                .cancel-btn { padding: 0.75rem 1.5rem; border-radius: 10px; background: #f1f5f9; font-weight: 600; }
                .save-btn { padding: 0.75rem 1.5rem; border-radius: 10px; background: var(--primary); color: white; font-weight: 600; }
            `}</style>
        </div>
    );
};

export default StudentManagement;
