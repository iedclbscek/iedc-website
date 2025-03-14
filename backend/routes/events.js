const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Event = require('../models/Event'); // You need an Event model
const router = express.Router();

// Get All Events (Authenticated Users)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
