const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const otpModel = require('../models/otpModel');
const { sendEmail } = require('../services/emailService');

const SALT_ROUNDS = 10;

const generateToken = (usr) => {
  const payload = { id: usr._id, email: usr.email, name: usr.name, phoneNo: usr.phoneNo, role: usr.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUserService = async (data) => {
  console.log("Register Service Called with data:", data);
  const emailExists = await userModel.findOne({ email: data.email });
  if (emailExists) return { status: 409, success: false, message: 'Email is already Registered' };

  const phNoExists = await userModel.findOne({ phoneNo: data.phoneNo });
  if (phNoExists) return { status: 409, success: false, message: 'Phone number is already Registered' };

  const userNameExists = await userModel.findOne({ userName: data.userName });
  if (userNameExists) return { status: 409, success: false, message: 'Username is already taken' };

  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);
  await userModel.create({ name: data.name, email: data.email, password: hashed, phoneNo: data.phoneNo, dob: data.dob, userName: data.userName, isEmailVerified: false });

  // generate email OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // remove old otp (important)
  await otpModel.deleteMany({ email: data.email });

  await otpModel.create({ email: data.email, otp: otp, purpose: 'email_verification', expiresAt });

  // send OTP email
  await sendEmail({ to: data.email, subject: 'Email Verification – OTP Code', html: `
    <h2>Email Verification</h2>
    <p>Welcome,</p>
    <p>Thank you for registering with us. Please use the OTP below to verify your email address:</p>
    
    <h3 style="letter-spacing:2px;">${otp}</h3>

    <p>This OTP is valid for <b>10 minutes</b>.</p>
    <p>Please do not share this code with anyone.</p>

    <p>If you did not request this verification, please ignore this email.</p>

    <p>Regards,<br/>Support Team</p>` });
  
  return { status: 201, success: true, message: 'User registered. Verify email OTP to activate account.' };
};

const vrfyEmailService = async (data) => {
    const record = await otpModel.findOne({ email: data.email, otp: Number(data.otp), purpose: 'email_verification' });
    if (!record) return { status: 400, success: false, message: 'Invalid or expired OTP' };

    // mark user verified
    const vrfyUser = await userModel.findOneAndUpdate({ email: data.email }, { isEmailVerified: true }, { new: true });
    if (!vrfyUser) return { status:404, success: false, message: 'User not found' };

    // delete OTP
    await record.deleteOne();

    const token = generateToken(vrfyUser);
    return { status: 200, success: true, message: 'Email verified and User created successfully', token, data: { userId: vrfyUser._id, name: vrfyUser.name, email: vrfyUser.email , phoneNo: vrfyUser.phoneNo, dob: vrfyUser.dob, userName: vrfyUser.userName, status: vrfyUser.status, profileVisibility: vrfyUser.profileVisibility, isEmailVerified: vrfyUser.isEmailVerified } };
};

const loginUserService = async (data, req) => {
  const identifier = data.email || data.userName;

  const lgnUser = await userModel.findOne({ $or: [{ email: identifier }, { userName: identifier }]}).select("+password");
  if (!lgnUser) return { status: 400, success: false, message: "Invalid Email or Username" };
  
  const pswdMatch = await bcrypt.compare(data.password, lgnUser.password);
  if (!pswdMatch) return { status: 400, success: false, message: "Invalid password" };

  if(!lgnUser.twoFactorEnabled) {
    const token = generateToken(lgnUser);
    return { status: 200, success: true, message: "Login Successful", token, data: { userId: lgnUser._id, name: lgnUser.name, email: lgnUser.email, phoneNo: lgnUser.phoneNo, dob: lgnUser.dob, userName: lgnUser.userName, status: lgnUser.status, profileVisibility: lgnUser.profileVisibility, isEmailVerified: lgnUser.isEmailVerified } };
  }

  // 2FA enabled -> send otp to email
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // remove old otp (important)
  await otpModel.deleteMany({ email: lgnUser.email });

  await otpModel.create({ email: lgnUser.email, otp, purpose: 'two_factor', otpHash, expiresAt });
  await sendEmail({ to: lgnUser.email, subject: 'Your OTP for 2FA Login OTP', text: `Your OTP for login is ${otp}. It is valid for 10 minutes.` });

  return { status: 200, success: true, twoFactorRequired: true, email: lgnUser.email, message: "OTP sent" };
};

const verifyTwoFactorOtpService = async (data, req) => {
  const otpRecord = await otpModel.findOne({ email: data.email, purpose: 'two_factor', expiresAt: { $gt: new Date() } });
  if (!otpRecord) return { status: 400, success: false, message: 'Invalid or expired OTP' }; 

  const match = await bcrypt.compare(data.otp, otpRecord.otpHash);
  if (!match) return { status: 400, success: false, message: "Invalid OTP" };

  await otpRecord.deleteOne();

  const user = await userModel.findOne({ email: data.email });
  const token = generateToken(user);

  return { status: 200, success: true, message: 'Login successful', token, data: { userId: user._id, name: user.name, email: user.email, phoneNo: user.phoneNo, dob: user.dob, userName: user.userName, status: user.status, profileVisibility: user.profileVisibility, isEmailVerified: user.isEmailVerified } };
};

module.exports = { registerUserService, vrfyEmailService, loginUserService, verifyTwoFactorOtpService };