const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 }, // full name
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, "Invalid email format"] }, // email
  password: { type: String, required: true, minlength: 8, select: false }, // password
  mobileCountryCode: { type: String, trim: true, default: "+91" }, // mobile country code
  phoneNo: { type: String, required: true, trim: true, unique: true, match: [/^\d{10}$/, "Phone number must be 10 digits"] }, // mobile number
  userName: { type: String, unique: true, trim: true, minlength: 3, maxlength: 30, sparse: true }, // username
  dob: { type: Date }, // date of birth format: YYYY-MM-DD
  role: { type: String, enum: ["USER", "ADMIN", "MODERATOR", "JOBS_ADMIN", "MARKETPLACE_ADMIN", "ADS_ADMIN", "WALLET_ADMIN", "SUPPORT"], default: "USER" },
  profilePic: { type: String }, // profile picture URL
  isEmailVerified: { type: Boolean, default: false }, // email verification status
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' }, // account status
  isDeleted: { type: Boolean, default: false }, // soft delete flag
  digilocker: { aadhar: { type: String }, verified: { type: Boolean, default: false }, profile: { name: String, dob: Date, gender: String, address: String, photo: String } }, // digilocker details
  walletBalance: { type: Number, default: 0, min: 0 }, // wallet balance
  profileVisibility: { type: String, enum: ['public', 'private', "friends"], default: 'public' }, // profile visibility
  location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], default: [0, 0] } }, // geo location - default to (Longitude,latitude)
  twoFactorEnabled: { type: Boolean, default: false }, // 2FA status
  lastLogin: { type: Date }, // last login timestamp 
}, { timestamps: true });

userSchema.index({ location: "2dsphere" });

// automatically add isDeleted: false condition to all find queries for soft delete functionality
userSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

module.exports = mongoose.model('User', userSchema);