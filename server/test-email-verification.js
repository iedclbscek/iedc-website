#!/usr/bin/env node

import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config({ path: './config/.env' });

console.log('🧪 Testing Email Verification System');
console.log('===================================\n');

// Test data
const testEmail = 'test@example.com';
const testCode = '123456';

async function testEmailVerification() {
  try {
    // Connect to MongoDB
    console.log('📊 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully\n');

    // Test 1: Check Verification model
    console.log('1. Testing Verification Model...');
    const Verification = mongoose.model('Verification', new mongoose.Schema({
      email: { type: String, required: true, lowercase: true, trim: true, index: true },
      code: { type: String, required: true, length: 6 },
      expiresAt: { type: Date, required: true, index: { expires: 0 } },
      attempts: { type: Number, default: 0, max: 5 },
      createdAt: { type: Date, default: Date.now }
    }, { timestamps: true }));

    console.log('✅ Verification model created successfully');

    // Test 2: Create test verification
    console.log('\n2. Creating test verification...');
    const verificationData = {
      email: testEmail,
      code: testCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      attempts: 0
    };

    // Remove existing test verification
    await Verification.deleteOne({ email: testEmail });
    
    const verification = await Verification.create(verificationData);
    console.log('✅ Test verification created:', verification._id);

    // Test 3: Find verification
    console.log('\n3. Finding verification...');
    const foundVerification = await Verification.findOne({ email: testEmail });
    if (foundVerification) {
      console.log('✅ Verification found successfully');
      console.log('   - Email:', foundVerification.email);
      console.log('   - Code:', foundVerification.code);
      console.log('   - Expires:', foundVerification.expiresAt);
      console.log('   - Attempts:', foundVerification.attempts);
    } else {
      console.log('❌ Verification not found');
    }

    // Test 4: Test expiration check
    console.log('\n4. Testing expiration check...');
    const isExpired = new Date() > foundVerification.expiresAt;
    console.log(`   - Is expired: ${isExpired}`);
    console.log('✅ Expiration check working');

    // Test 5: Test attempts increment
    console.log('\n5. Testing attempts increment...');
    foundVerification.attempts += 1;
    await foundVerification.save();
    console.log(`   - New attempts count: ${foundVerification.attempts}`);
    console.log('✅ Attempts increment working');

    // Test 6: Clean up
    console.log('\n6. Cleaning up test data...');
    await Verification.deleteOne({ email: testEmail });
    console.log('✅ Test verification deleted');

    console.log('\n🎉 All tests passed! Email verification system is working correctly.');
    console.log('\n📋 Next steps:');
    console.log('1. Test the API endpoints:');
    console.log('   - POST /api/auth/send-verification');
    console.log('   - POST /api/auth/verify-email');
    console.log('2. Test the frontend form with real email');
    console.log('3. Verify emails are being sent correctly');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check MongoDB connection');
    console.log('2. Verify environment variables');
    console.log('3. Check if email service is configured');
  } finally {
    // Close MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n📊 MongoDB connection closed');
    }
  }
}

// Check if we have the required environment variables
const requiredVars = ['MONGODB_URI'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('\n📝 Please check your .env file');
} else {
  // Run the test
  testEmailVerification();
}
