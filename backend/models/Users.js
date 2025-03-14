const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const rolesEnum = [
  "Nodal Officer",
  "Lead & CIO",
  "Lead & CEO",
  "Operations Lead & COO",
  "Operations Co-Lead",
  "Technology Lead & CTO",
  "Technology Co-Lead",
  "Marketing Lead & CMO",
  "Marketing Co-Lead",
  "Creative Lead & CCO",
  "Creative Co-Lead",
  "Women Innovation Lead",
  "Women Innovation Co-Lead",
  "Community Lead",
  "Community Co-Lead",
  "Finance Lead & CFO",
  "Finance Co-Lead",
  "Chief Quality Officer",
  "IPR & Research Lead",
  "IPR & Research Co-Lead",
  "Innovation Coordinator",
  "Startup Coordinator",
  "Internship Coordinator",
  "IPR Coordinator",
  "Social Media Coordinator"
];

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: rolesEnum },
  password: { type: String },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
