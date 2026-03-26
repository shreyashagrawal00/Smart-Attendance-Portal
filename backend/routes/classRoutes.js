const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const Student = require('../models/Student');
const { protect } = require('../config/authMiddleware');

// @desc    Get all classes
// @route   GET /api/classes
router.get('/', protect, async (req, res) => {
    try {
        const classes = await Class.find({});
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create new class
// @route   POST /api/classes
router.post('/', protect, async (req, res) => {
    try {
        const { name, description } = req.body;
        const classExists = await Class.findOne({ name });
        if (classExists) {
            return res.status(400).json({ message: 'Class already exists' });
        }
        
        const classData = { name, description };
        if (req.user && req.user._id) {
            classData.teacher = req.user._id;
        }

        const newClass = await Class.create(classData);
        res.status(201).json(newClass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete class
// @route   DELETE /api/classes/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const cls = await Class.findById(req.params.id);
        if (cls) {
            await cls.deleteOne();
            res.json({ message: 'Class removed' });
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
