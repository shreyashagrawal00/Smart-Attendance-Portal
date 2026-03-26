const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect } = require('../config/authMiddleware');

// @desc    Mark attendance
// @route   POST /api/attendance
router.post('/', protect, async (req, res) => {
    const { attendanceRecords, date } = req.body; // array of { studentId, status }

    if (!attendanceRecords || attendanceRecords.length === 0) {
        return res.status(400).json({ message: 'No attendance records provided' });
    }

    const attendanceDate = date ? new Date(date).setHours(0,0,0,0) : new Date().setHours(0,0,0,0);

    try {
        const promises = attendanceRecords.map(async (record) => {
            return await Attendance.findOneAndUpdate(
                { student: record.studentId, date: attendanceDate },
                { status: record.status, markedBy: req.user._id },
                { upsert: true, new: true }
            );
        });

        await Promise.all(promises);
        res.status(201).json({ message: 'Attendance marked successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get attendance for a date or class
// @route   GET /api/attendance
router.get('/', protect, async (req, res) => {
    const { date, class: studentClass } = req.query;
    let query = {};

    if (date) {
        const attendanceDate = new Date(date).setHours(0,0,0,0);
        query.date = attendanceDate;
    }

    let attendance = await Attendance.find(query).populate('student');

    if (studentClass) {
        attendance = attendance.filter(a => a.student.class === studentClass);
    }

    res.json(attendance);
});

// @desc    Get attendance analytics
// @route   GET /api/attendance/analytics
router.get('/analytics', protect, async (req, res) => {
    try {
        const { class: studentClass } = req.query;
        const Student = require('../models/Student');
        
        // 1. Total students
        let studentQuery = {};
        if (studentClass && studentClass !== 'All Classes') {
            studentQuery.class = studentClass;
        }
        const totalStudents = await Student.countDocuments(studentQuery);

        // 2. All attendance records for percentages
        let attendanceRecords = await Attendance.find({}).populate('student');
        if (studentClass && studentClass !== 'All Classes') {
            attendanceRecords = attendanceRecords.filter(a => a.student && a.student.class === studentClass);
        }

        const presentCountAllTime = attendanceRecords.filter(a => a.status === 'Present').length;
        const totalRecords = attendanceRecords.length;
        const attendancePercentage = totalRecords > 0 ? (presentCountAllTime / totalRecords) * 100 : 0;

        // 3. Today's specifically
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        
        let todaysRecords = await Attendance.find({
            date: { $gte: startOfToday }
        }).populate('student');
        
        if (studentClass && studentClass !== 'All Classes') {
            todaysRecords = todaysRecords.filter(a => a.student && a.student.class === studentClass);
        }

        const presentCount = todaysRecords.filter(a => a.status === 'Present').length;
        const absentCount = todaysRecords.filter(a => a.status === 'Absent').length;
        // If some students are unmarked today, the frontend can calculate absent as totalStudents - presentCount,
        // but it's simpler to just pass exactly who is present/absent today.

        res.json({
            totalStudents,
            attendancePercentage,
            totalRecords,
            presentCount,
            absentCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
