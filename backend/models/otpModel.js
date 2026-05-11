const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true }, // associated email for which OTP is generated
    otp: { type: String, required: true }, // OTP value
    purpose: { type: String, enum: ['email_verification', 'password_reset', 'two_factor'], default: 'email_verification' }, // purpose of OTP
    otpHash: { type: String }, // hashed version of OTP for security (optional, can be used if you want to store hashed OTPs)
    expiresAt: { type: Date, required: true }  // OTP expiration time  
}, { timestamps: true });

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto remove expired OTP docs

module.exports = mongoose.model('Otp', otpSchema);