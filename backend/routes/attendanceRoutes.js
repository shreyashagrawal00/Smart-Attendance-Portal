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

    const attendanceDate = new Date(date ? new Date(date) : new Date());
    attendanceDate.setHours(0, 0, 0, 0);

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
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        query.date = { $gte: attendanceDate, $lte: endOfDay };
    }

    let attendance = await Attendance.find(query).populate('student');

    // Filter out orphaned records where the student was deleted
    attendance = attendance.filter(a => a.student !== null);

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
        const Class = require('../models/Class');
        
        // --- 1. Basic Stats & Enrollment per Class ---
        let studentQuery = {};
        if (studentClass && studentClass !== 'All Classes') {
            studentQuery.class = studentClass;
        }
        const totalStudentsCount = await Student.countDocuments(studentQuery);
        
        const allAvailableClasses = await Class.find({});
        const classDistribution = await Promise.all(allAvailableClasses.map(async (cls) => ({
            class: cls.name,
            count: await Student.countDocuments({ class: cls.name })
        })));

        // --- 2. Overall Status Distribution ---
        let statusAggMatch = {};
        if (studentClass && studentClass !== 'All Classes') {
            // Need to join with student to filter by class
            const classStudents = await Student.find({ class: studentClass }).select('_id');
            statusAggMatch.student = { $in: classStudents.map(s => s._id) };
        }
        
        const overallStatus = await Attendance.aggregate([
            { $match: statusAggMatch },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const statusDistribution = [
            { name: 'Present', value: overallStatus.find(s => s._id === 'Present')?.count || 0 },
            { name: 'Absent', value: overallStatus.find(s => s._id === 'Absent')?.count || 0 },
            { name: 'Late', value: overallStatus.find(s => s._id === 'Late')?.count || 0 }
        ];

        // --- 3. Today's specifically (for Dashboard) ---
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        let todayQuery = { date: { $gte: startOfToday, $lte: endOfToday } };
        if (studentClass && studentClass !== 'All Classes') {
            const classStudents = await Student.find({ class: studentClass }).select('_id');
            todayQuery.student = { $in: classStudents.map(s => s._id) };
        }

        const todayRecords = await Attendance.find(todayQuery);
        const todayPresent = todayRecords.filter(r => r.status === 'Present').length;
        const todayAbsent = todayRecords.filter(r => r.status === 'Absent').length;

        // --- 4. Weekly Trend (Last 7 Days) ---
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            const endD = new Date(d);
            endD.setHours(23, 59, 59, 999);
            
            let dayQuery = { date: { $gte: d, $lte: endD } };
            if (studentClass && studentClass !== 'All Classes') {
                const classStudents = await Student.find({ class: studentClass }).select('_id');
                dayQuery.student = { $in: classStudents.map(s => s._id) };
            }
            
            const dayRecords = await Attendance.find(dayQuery);
            const present = dayRecords.filter(r => r.status === 'Present').length;
            const absent = dayRecords.filter(r => r.status === 'Absent').length;
            
            last7Days.push({
                name: d.toLocaleDateString('en-US', { weekday: 'short' }),
                fullDate: d,
                present,
                absent
            });
        }

        // --- 4. Low Attendance Calculation (< 75%) ---
        // Get all students and check their attendance
        const allStudents = await Student.find(studentQuery);
        const lowAttendanceStudents = [];
        let totalPresentAllTime = 0;
        let totalPossibleAllTime = 0;

        for (const student of allStudents) {
            const studentRecords = await Attendance.find({ student: student._id });
            const presentCount = studentRecords.filter(r => r.status === 'Present').length;
            const totalCount = studentRecords.length;
            
            totalPresentAllTime += presentCount;
            totalPossibleAllTime += totalCount;

            const percentage = totalCount > 0 ? (presentCount / totalCount) * 100 : 100;
            if (percentage < 75 && totalCount > 0) {
                lowAttendanceStudents.push({ 
                    name: student.name, 
                    rollNo: student.rollNo, 
                    percentage: percentage.toFixed(1) 
                });
            }
        }

        const overallAttendancePercentage = totalPossibleAllTime > 0 
            ? (totalPresentAllTime / totalPossibleAllTime) * 100 
            : 0;

        res.json({
            totalStudents: totalStudentsCount,
            attendancePercentage: overallAttendancePercentage.toFixed(1),
            statusDistribution,
            classDistribution,
            weeklyTrend: last7Days,
            lowAttendanceCount: lowAttendanceStudents.length,
            lowAttendanceList: lowAttendanceStudents,
            totalClasses: allAvailableClasses.length,
            presentCount: todayPresent,
            absentCount: todayAbsent
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
