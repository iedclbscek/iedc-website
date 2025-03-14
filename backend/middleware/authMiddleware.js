const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password'); // Exclude password
        if (!req.user) return res.status(401).json({ message: 'User not found' });
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
