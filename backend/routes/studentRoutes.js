const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect } = require('../config/authMiddleware');

// @desc    Get all students
// @route   GET /api/students
router.get('/', protect, async (req, res) => {
    const students = await Student.find({});
    res.json(students);
});

// @desc    Create new student
// @route   POST /api/students
router.post('/', protect, async (req, res) => {
    try {
        const { name, rollNo, universityRollNo, class: studentClass, phone } = req.body;

        const studentExists = await Student.findOne({ rollNo });
        if (studentExists) {
            res.status(400).json({ message: 'Student already exists' });
            return;
        }

        const student = await Student.create({ name, rollNo, universityRollNo, class: studentClass, phone });
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update student
// @route   PUT /api/students/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const { name, rollNo, universityRollNo, class: studentClass, phone } = req.body;
        const student = await Student.findById(req.params.id);

        if (student) {
            student.name = name || student.name;
            student.rollNo = rollNo || student.rollNo;
            student.universityRollNo = universityRollNo || student.universityRollNo;
            student.class = studentClass || student.class;
            student.phone = phone || student.phone;

            const updatedStudent = await student.save();
            res.json(updatedStudent);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete student
// @route   DELETE /api/students/:id
router.delete('/:id', protect, async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (student) {
        // Cascade delete associated attendance records
        const Attendance = require('../models/Attendance');
        await Attendance.deleteMany({ student: student._id });

        await student.deleteOne();
        res.json({ message: 'Student removed' });
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
});

module.exports = router;
