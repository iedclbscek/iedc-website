const express = require('express');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get user profile (protected)
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/invite', authMiddleware, async (req, res) => {
  if (req.user.role !== 'Nodal Officer') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { username, email, role } = req.body;

  try {
    const newUser = new User({ username, password: 'temporarypassword', role });
    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Invitation to Edit Profile',
      text: `You have been invited to edit your profile. Please log in with the following credentials and update your details:
      Username: ${username}
      Password: temporarypassword
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending email' });
      } else {
        res.json({ message: 'Invitation sent successfully' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/edit-profile', authMiddleware, async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (username) user.username = username;
    if (password) user.password = password;
    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
