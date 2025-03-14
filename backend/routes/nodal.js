const express = require('express');
const User = require('../models/Users');
const authMiddleware = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const router = express.Router();

// 📌 Assign a Lead (Only Nodal Officers Can Do This)
router.post('/assign-lead', authMiddleware, async (req, res) => {
    if (req.user.role !== "Nodal Officer") {
        return res.status(403).json({ message: "Access Denied" });
    }

    const { name, email, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create New Lead Without a Password
        const newUser = new User({ name, email, role });
        await newUser.save();

        res.json({ message: "Lead assigned successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 📌 Send Email to Lead for Password Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/send-reset-email', authMiddleware, async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate Reset Token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Set Your Password',
            text: `Click here to set your password: ${resetLink}`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Reset email sent" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
