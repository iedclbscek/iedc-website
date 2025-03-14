const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Feedback = require('../models/Feedback'); // You need a Feedback model
const router = express.Router();

// Submit Feedback (Only Authenticated Users)
router.post('/', authMiddleware, async (req, res) => {
    const { eventId, feedback, remarks } = req.body;

    if (!eventId || !feedback) {
        return res.status(400).json({ message: 'Event ID and feedback are required' });
    }

    try {
        const newFeedback = new Feedback({
            eventId,
            userId: req.user._id,
            feedback,
            remarks,
        });

        await newFeedback.save();
        res.status(201).json(newFeedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get Feedback for an Event (Only CQO Can Access)
router.get('/:eventId', authMiddleware, async (req, res) => {
    if (req.user.role !== 'CQO') {
        return res.status(403).json({ message: 'Access Denied' });
    }

    try {
        const feedbacks = await Feedback.find({ eventId: req.params.eventId });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
