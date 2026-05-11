const otpModel = require("../models/otpModel");
const userModel = require("../models/userModel");


const registerValidation = (body) => {
  const { name, email, phoneNo, password, confirmPassword, userName, dob } = body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const startDigitRegex = /^[6-9]/;
  const tenDigitRegex = /^\d{10}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  const userNameRegex = /^(?!.*\.$)[a-zA-Z0-9._]{3,30}$/;

  if (!name || !email || !phoneNo || !password || !confirmPassword || !userName || !dob) {
    return { status: 400, success: false, message: "Please provide all required fields" };
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedPhone = phoneNo.trim();
  const trimmedUserName = userName.trim();

  if (!trimmedName || !trimmedUserName) {
    return { status: 400, success: false, message: "Name and username cannot be empty" };
  }

  if (!emailRegex.test(trimmedEmail)) {
    return { status: 400, success: false, message: "Invalid email format" };
  }

  if (!startDigitRegex.test(trimmedPhone)) {
    return { status: 400, success: false, message: "Phone number must start with 6,7,8,9 digits only" };
  }

  if (!tenDigitRegex.test(trimmedPhone)) {
    return { status: 400, success: false, message: "Phone number must be 10 digits" };
  }

  if (!passwordRegex.test(password)) {
    return { status: 400, success: false, message: "Password must contain uppercase, lowercase, number and special character" };
  }

  if (!passwordRegex.test(password)) {
    return { status: 400, success: false, message: "Password must contain uppercase, lowercase, number and special character" };
  }

  if (password !== confirmPassword) {
    return { status: 400, success: false, message: "Password and confirm password must match" };
  }

  if (!userNameRegex.test(trimmedUserName)) {
    return { status: 400, success: false, message: "Username must be 3–20 characters using letters, numbers, dot or underscore" };
  }

  const dobRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dobRegex.test(dob)) {
    return { status: 400, success: false, message: "DOB must be in YYYY-MM-DD format" };
  }

  const birthDate = new Date(`${dob}T00:00:00`);

  if (isNaN(birthDate.getTime())) {
    return { status: 400, success: false, message: "Invalid date of birth" };
  }

  const today = new Date();

  if (birthDate > today) {
    return { status: 400, success: false, message: "DOB cannot be future date" };
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 18) {
    return { status: 400, success: false, message: "User must be at least 18 years old" };
  }

  return { success: true };
};

// const verifyEmailValidation = (body) => {
//     const { email, otp } = body;

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if(!email || !otp) { 
//       return { status: 400, success: false, message: 'Please provide all required fields' };
//     } 

//     const trimmedEmail = email.trim();
    
//     if (!emailRegex.test(trimmedEmail)) {
//     return { status: 400, success: false, message: "Invalid email format" };
//     }

//     if(otp.length !== 6) {
//       return { status: 400, success: false, message: "OTP must be 6 digits" };
//     }

//     return { success: true };
// };
 
// validation/authValidation.js

 const verifyEmailValidation = async (body) => {
    try {

        const { email, otp } = body;

        // Email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Required fields
        if (!email || !otp) {
            return {
                status: 400,
                success: false,
                message: 'Please provide all required fields'
            };
        }

        // Trim email
        const trimmedEmail = email.trim().toLowerCase();

        // Validate email
        if (!emailRegex.test(trimmedEmail)) {
            return {
                status: 400,
                success: false,
                message: 'Invalid email format'
            };
        }

        // Validate OTP
        if (!/^\d{6}$/.test(String(otp))) {
            return {
                status: 400,
                success: false,
                message: 'OTP must be 6 digits'
            };
        }

        // Check user exists
        const existingUser = await userModel.findOne({
            email: trimmedEmail
        });

        if (!existingUser) {
            return {
                status: 404,
                success: false,
                message: 'User not found'
            };
        }

        // Find OTP from OTP collection
        const existingOtp = await otpModel.findOne({
            email: trimmedEmail,
            otp: String(otp),
            purpose: 'email_verification'
        });

        // OTP not found
        if (!existingOtp) {
            return {
                status: 400,
                success: false,
                message: 'Invalid OTP'
            };
        }

        // Check OTP expiry
        if (new Date() > new Date(existingOtp.expiresAt)) {
            return {
                status: 400,
                success: false,
                message: 'OTP expired'
            };
        }

        // Update user verification
        existingUser.isEmailVerified = true;

        await existingUser.save();

        // Delete OTP after success
        await otpModel.deleteOne({
            _id: existingOtp._id
        });

        return {
            status: 200,
            success: true,
            message: 'Email verified successfully',
            user: existingUser
        };

    } catch (error) {

        return {
            status: 500,
            success: false,
            message: error.message || 'Internal server error'
        };

    }
};

 

const loginValidation = (body = {}) => {
  const { userName, email, password } = body;

  if ((!userName && !email) || !password) {
    return { status: 400, success: false, message: "Please provide are required fields" };
  }

  return { success: true };
};

const verifyTwoFactorOtpValidation = (body) => {
  const { email, otp } = body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !otp) {
    return { status: 400, success: false, message: "Please provide all required fields" };
  }

  const trimmedEmail = email.trim();

  if (!emailRegex.test(trimmedEmail)) {
    return { status: 400, success: false, message: "Invalid email format" };
  } 
  if (otp.length !== 6) {
    return { status: 400, success: false, message: "OTP must be 6 digits" };
  } 

  return { success: true };
}


module.exports = { registerValidation, verifyEmailValidation, loginValidation, verifyTwoFactorOtpValidation };