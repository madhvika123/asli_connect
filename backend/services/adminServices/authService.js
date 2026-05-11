const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');
const otpModel = require('../../models/otpModel');
const { sendEmail } = require('../../services/emailService');

const SALT_ROUNDS = 10;

const generateToken = (usr) => {
  const payload = { id: usr._id, email: usr.email, name: usr.name, phoneNo: usr.phoneNo, role: usr.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const adminRegisterUserService = async (data) => {
  const exists = await userModel.findOne({ $or: [{ email: data.email }, { phoneNo: data.phoneNo }] });
  if (exists) {
    return { status: 409, success: false, message: 'Admin Already Registered' };
  }

   const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);
   const admin = await userModel.create({ name: data.name, email: data.email, password: hashed, phoneNo: data.phoneNo, role: 'admin', isEmailVerified: true });

  return { status: 201, success: true, message: 'Admin Registered Successfully', admin: {id:admin._id,name:admin.name,email:admin.email,phoneNo:admin.phoneNo,role:admin.role} };
};

const adminLoginUserService = async (data) => {
    const lgnUser = await userModel.findOne({ email: data.email, role: 'admin' }).select('+password');
    if (!lgnUser) return { status: 400, success: false, message: 'Invalid credentials' };

    const ok = await bcrypt.compare(data.password, lgnUser.password);
    if (!ok) return { status: 400,  success: false, message: 'Invalid credentials' };

    const token = generateToken(lgnUser);
    const admin = {
        _id: lgnUser._id,
        name: lgnUser.name,
        email: lgnUser.email,
        phoneNo: lgnUser.phoneNo,
        isEmailVerified: lgnUser.isEmailVerified,
        role: lgnUser.role,
        createdAt: lgnUser.createdAt
    };
    return { status: 201, success: true, message: 'Login Successful', token, admin };
};

const forgotPasswordService = async (data) => {
  const user = await userModel.findOne({ email: data.email });
  if(!user) {
    return { status: 404, success: false, message: "User with this email does not exist" };
  };

  // generate email OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // remove old otp (important)
  await otpModel.deleteMany({ email: data.email });

  await otpModel.create({ email: data.email, otp, purpose: 'password_reset', expiresAt });

  // send OTP email
  await sendEmail({ to: data.email, subject: 'Admin Password Reset OTP', text: `Admin Your OTP for password reset is ${otp}. Expires in 10 minutes.` });      
  return { status: 201, success: true, message: 'OTP sent to email for password reset' };
};

const verifyOtpService = async (data) => {
  const otpRecord = await otpModel.findOne({ email: data.email, otp: data.otp, purpose: 'password_reset', expiresAt: { $gt: new Date() } });
  if (!otpRecord) {
    return { status: 400, success: false, message: 'Invalid or expired OTP' };  
  }
  return { status: 200, success: true, message: 'OTP verified successfully' };
};

const rstPswdService = async (data) => {
  const user = await userModel.findOne({ email: data.email });    
  if(!user) {
    return { status: 404, success: false, message: "User with this email does not exist" };
  };

  const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);
  user.password = hashedNewPassword;
  await user.save();

  // delete OTP after successful password reset
  await otpModel.deleteMany({ email: data.email, purpose: 'password_reset' });

  return { status: 200, success: true, message: 'Password reset successfully' };
};  

module.exports = { adminRegisterUserService, adminLoginUserService, forgotPasswordService, verifyOtpService, rstPswdService };