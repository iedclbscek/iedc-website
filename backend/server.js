const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events'); // Import event routes
const feedbackRoutes = require('./routes/feedback'); // Import feedback routes
const authMiddleware = require('./middleware/authMiddleware'); // Import authentication middleware
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes); // Protected User Routes
app.use('/api/events', authMiddleware, eventRoutes); // Protected Event Routes
app.use('/api/feedback', authMiddleware, feedbackRoutes); // Protected Feedback Routes

// Root Route (Optional)
app.get('/', (req, res) => {
  res.send('IEDC API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
