import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iedc';

async function seedIicAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if iic_admin already exists
    const existingUser = await User.findOne({ username: 'iic_admin' });
    if (existingUser) {
      console.log('iic_admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('iic@lbscek', 12);

    // Create the iic_admin user
    const iicAdmin = new User({
      name: 'IIC Administrator',
      username: 'iic_admin',
      email: 'iic@lbscek.ac.in',
      password: hashedPassword,
      role: 'iic_admin',
      department: 'Computer Science and Engineering',
      phoneNumber: '9876543210',
      year: 4,
      teamYear: '2025',
      teamYears: [2025],
      displayOrder: 0,
      yearlyDisplayOrders: new Map([['2025', 0]]), // Use string key instead of number
      yearlyRoles: [{
        year: 2025,
        role: 'iic_admin',
        teamRole: 'IIC Administrator',
        order: 0
      }]
    });

    await iicAdmin.save();
    console.log('iic_admin user created successfully');
    console.log('Username: iic_admin');
    console.log('Password: iic@lbscek');

  } catch (error) {
    console.error('Error seeding iic_admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedIicAdmin();


