const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    rollNo: { type: String, required: true },
    universityRollNo: { type: String, required: true, unique: true },
    class: { type: String, required: true },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
