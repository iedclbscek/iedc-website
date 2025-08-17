import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  code: {
    type: String,
    required: true,
    length: 6
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index - automatically delete expired documents
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
verificationSchema.index({ email: 1, createdAt: -1 });

// Method to check if verification is expired
verificationSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Method to check if max attempts reached
verificationSchema.methods.maxAttemptsReached = function() {
  return this.attempts >= 5;
};

// Method to increment attempts
verificationSchema.methods.incrementAttempts = function() {
  this.attempts += 1;
  return this.save();
};

// Static method to clean expired verifications
verificationSchema.statics.cleanExpired = async function() {
  const now = new Date();
  return this.deleteMany({ expiresAt: { $lt: now } });
};

// Pre-save middleware to ensure code is exactly 6 digits
verificationSchema.pre('save', function(next) {
  if (this.code && this.code.length !== 6) {
    return next(new Error('Verification code must be exactly 6 digits'));
  }
  next();
});

const Verification = mongoose.model('Verification', verificationSchema);

export default Verification;
