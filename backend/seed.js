const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');
const Attendance = require('./models/Attendance');
const Class = require('./models/Class');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
        console.log('MongoDB Connected for Seeding...');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await User.deleteMany();
        await Student.deleteMany();
        await Attendance.deleteMany();
        await Class.deleteMany();

        console.log('Data Cleared!');

        // Create Admin
        const admin = await User.create({
            name: 'Teacher Admin',
            email: 'admin@school.com',
            password: 'password123',
            isAdmin: true
        });

        console.log('Admin User Created (email: admin@school.com, password: password123)');

        // Create Classes
        await Class.create([
            { name: 'SB', subjectName: 'Science Section A' },
            { name: '10-B', subjectName: 'Science Section B' },
            { name: '10-C', subjectName: 'Commerce Section A' },
            { name: '11-A', subjectName: 'Higher Secondary A' },
            { name: '12-A', subjectName: 'Senior Secondary A' },
        ]);
        console.log('Classes Created!');

        // Create Students
        const students = await Student.create([
            { name: 'John Doe', rollNo: '101', universityRollNo: 'UNI2024001', class: '10-A' },
            { name: 'Jane Smith', rollNo: '102', universityRollNo: 'UNI2024002', class: '10-B' },
            { name: 'Alice Brown', rollNo: '103', universityRollNo: 'UNI2024003', class: '10-A' },
            { name: 'Bob Wilson', rollNo: '104', universityRollNo: 'UNI2024004', class: '10-C' },
            { name: 'Charlie Davis', rollNo: '105', universityRollNo: 'UNI2024005', class: '10-B' },
        ]);

        console.log(`${students.length} Students Created!`);

        // Create some attendance records for yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0,0,0,0);

        await Attendance.insertMany([
            { student: students[0]._id, date: yesterday, status: 'Present', markedBy: admin._id },
            { student: students[1]._id, date: yesterday, status: 'Absent', markedBy: admin._id },
            { student: students[2]._id, date: yesterday, status: 'Present', markedBy: admin._id }
        ]);

        console.log('Sample Attendance Records Created!');
        process.exit();
    } catch (error) {
        console.error(`Error with seeding: ${error.message}`);
        process.exit(1);
    }
};

seedData();
