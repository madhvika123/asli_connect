const fs = require("fs");
const path = require("path");
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const otpModel = require('../models/otpModel');
const { sendEmail } = require('../services/emailService');

const getProfileDetailsService = async (userId) => {
  const user = await userModel.findById(userId).select("-password -otp -__v");
  if (!user) {
    return { status: 400, success: false, message: "Profile not found" };
  }

  return { status: 200, success: true, message: "Profile details retrieved successfully", data: { userId: user._id, name: user.name, email: user.email, phoneNo: user.phoneNo, dob: user.dob, userName: user.userName, status: user.status, profileVisibility: user.profileVisibility, isEmailVerified: user.isEmailVerified, profilePic: user.profilePic } };
};

const updateProfileImageService = async (userId, file) => {
  if (!file) return { status: 400, success: false, message: 'No image uploaded' };

  const newImagePath = `/uploads/profile/${file.filename}`;

  const userD = await userModel.findById(userId);
  if (!userD) return { status: 400, success: false, message: 'User not found' };

  // Delete old image if exists
  if (userD.profilePic) {
      const oldImagePath = path.join(__dirname, "..", userD.profilePic);
      if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
      }
  }

  // Update DB
  userD.profilePic = newImagePath;
  await userD.save();

  return { status: 200, success: true, message: 'Profile image updated successfully', image: newImagePath ? process.env.BASE_URL + newImagePath : null };
};

const updtUsrPrflService = async (usrId, data) => {
  const user = await userModel.findById(usrId);
  if (!user) return { status: 400, success: false, message: "User not found" };

  if (data.email) {
    const newEmail = data.email.trim().toLowerCase();

    if (newEmail !== user.email) {
      const exists = await userModel.findOne({ email: newEmail, _id: { $ne: usrId } });
      if (exists) return { status: 409, success: false, message: "Email already in use" };

      user.email = newEmail;
    }
  }

  if (data.phoneNo) {
    if (data.phoneNo !== user.phoneNo) {
      const exists = await userModel.findOne({ phoneNo: data.phoneNo, _id: { $ne: usrId } });
      if (exists) return { status: 409, success: false, message: "Phone already in use" };

      user.phoneNo = data.phoneNo;
    }
  }

  if (data.userName) {
    if (data.userName !== user.userName) {
      const exists = await userModel.findOne({ userName: data.userName, _id: { $ne: usrId } });
      if (exists) return { status: 409, success: false, message: "Username taken" };

      user.userName = data.userName;
    }
  }

  if (data.name !== undefined) user.name = data.name;

  await user.save();

  return { status: 200, success: true, message: "Profile updated successfully", data: { userId: user._id, name: user.name, email: user.email, phoneNo: user.phoneNo, userName: user.userName } };
};

const chngePswdService = async (usrID, data) => {
  const { currentPassword, newPassword } = data;

  const userChg = await userModel.findById(usrID).select('+password');
  if(!userChg) return { status: 400, success: false, message: "User not found" };

  const isMatch = await bcrypt.compare(currentPassword, userChg.password);
  if(!isMatch) return { status: 400, success: false, message: "Current password is incorrect" };

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  userChg.password = hashedNewPassword;

  await userChg.save();

  return { status: 200, success: true, message: "Password changed successfully" };
};

const twofaSendOtpService = async (userId) => {
  const user = await userModel.findById(userId);
  if(!user) return { status: 404, success: false, message: "User Not Found" };

  if(user.twoFactorEnabled) return { status: 401, success: false, message: "2FA already enabled" };

  // generate email OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // remove old otp (important)
  await otpModel.deleteMany({ email: user.email });

  await otpModel.create({ email: user.email, otp, purpose: 'two_factor', otpHash, expiresAt });

  // send OTP email
  await sendEmail({ to: user.email, subject: 'Two Factor Authentication OTP', text: `Your OTP for 2FA is ${otp}. Expires in 10 minutes.` });      
  return { status: 200, success: true, message: 'OTP sent to email for 2FA' };
};

const twofaVerifyOtpService = async (data) => {
  const otpRecord = await otpModel.findOne({ email: data.email, otp: data.otp, purpose: 'two_factor', expiresAt: { $gt: new Date() } });
  if (!otpRecord) return { status: 400, success: false, message: 'Invalid or expired OTP' };  

  const match = await bcrypt.compare(data.otp, otpRecord.otpHash);
  if (!match) return { status: 400, success: false, message: "Invalid OTP" };

  await userModel.updateOne( { email: data.email }, { twoFactorEnabled: true } );

  await otpModel.deleteMany({ email: data.email });
  return { status: 200, success: true, message: 'Two-factor authentication enabled' };
};

const visibilityService = async (userId, data) => {
  await userModel.findByIdAndUpdate(userId, { profileVisibility: data.profileVisibility });
  return { status: 200, success: true, message: "Profile Visibility Updated Successfully" };
};





// const forgotPasswordService = async (data) => {
//   const user = await userModel.findOne({ email: data.email });
//   if(!user) {
//     return { status: 404, success: false, message: "User with this email does not exist" };
//   };

//    // generate email OTP
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//   // remove old otp (important)
//   await otpModel.deleteMany({ email: data.email });

//   await otpModel.create({ email: data.email, otp, purpose: 'password_reset', expiresAt });  
//   // send OTP email
//   await sendEmail({ to: data.email, subject: 'Password Reset OTP', text: `Your OTP for password reset is ${otp}. Expires in 10 minutes.` });      
//   return { status: 200, success: true, message: 'OTP sent to email for password reset' };
// };

// const verifyOtpService = async (data) => {
//   const otpRecord = await otpModel.findOne({ email: data.email, otp: data.otp, purpose: 'password_reset', expiresAt: { $gt: new Date() } });
//   if (!otpRecord) {
//     return { status: 400, success: false, message: 'Invalid or expired OTP' };  
//   }
//   return { status: 200, success: true, message: 'OTP verified successfully' };
// };

// const rstPswdService = async (data) => {
//   const user = await userModel.findOne({ email: data.email });    
//   if(!user) {
//     return { status: 404, success: false, message: "User with this email does not exist" };
//   };

//   const hashedPassword = await bcrypt.hash(data.newPassword, 10);
//   user.password = hashedPassword;
//   await user.save();
//   // delete OTP after successful password reset
//   await otpModel.deleteMany({ email: data.email, purpose: 'password_reset' });

//   return { status: 200, success: true, message: 'Password reset successfully' };
// };  


// const blockUserService = async (loginUserId, targetUserId) => {
//   if(loginUserId === targetUserId) return { status: 400, success: false, message: "You Cannot block yourself" };

//   const me = await userModel.findById(loginUserId);
//   const target = await userModel.findById(targetUserId);

//   if (!me)
//     return { status: 404, success: false, message: "Logged-in user not found" };

//   if (!target)
//     return { status: 404, success: false, message: "Target user not found" }

//   if(me.blockedUsers.includes(targetUserId)) return { status: 200, success: true, message: "User Already Blocked" }; //if already blocked

//   // remove followers, following and friends
//   me.following.pull(targetUserId);
//   me.followers.pull(targetUserId);
//   me.friends.pull(targetUserId);

//   target.following.pull(loginUserId);
//   target.followers.pull(loginUserId);
//   target.friends.pull(loginUserId);

//   me.followRequests.pull(targetUserId);
//   target.followRequests.pull(loginUserId);

//   me.blockedUsers.push(targetUserId);

//   await me.save();
//   await target.save();

//   return { status: 200, success: true, message: "User blocked successfully" };
// };

// const blockUserListService = async (userId) => {
//   const user = await userModel.findById(userId).populate("blockedUsers", "name email profilePic");

//   return { status: 200, success: true, count: user.blockedUsers.length, blockedUsers: user.blockedUsers };
// };

// const unblockUserService = async (loginUserId, targetUserId) => {
//   const me = await userModel.findById(loginUserId);
//   const target = await userModel.findById(targetUserId);
//   if(!me.blockedUsers.includes(targetUserId)) return { status: 400, success: false, message: "Uer not in blocked list" };
  
//   me.blockedUsers.pull(targetUserId);
//   await me.save();

//   return { status: 200, success: true, message: "User unblocked successfully", unblockedUser: { _id: target._id, name: target.name, email: target.email, profilePic: target.profilePic }};
// };




module.exports = { getProfileDetailsService, updateProfileImageService, updtUsrPrflService, chngePswdService,  twofaSendOtpService, twofaVerifyOtpService, visibilityService };