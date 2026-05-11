const express = require('express');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');
const { profileDetailsController, updateProfileImageController, updateUserProfileController, forgotPasswordController, vrfyOtpController, rstPswdController, chngePswdController, visibilityController, blockUserController, blockUserListController, unblockUserController, twofaSendOtpController, twofaVerifyOtpController } = require('../controllers/profileController');

const router = express.Router();

// routes
// Profile Details || GET
router.get("/profile-view", authMiddleware, profileDetailsController);

// Profile Image || PUT
router.put("/profile-image", authMiddleware, (req, res, next) => { 
    req.uploadFolder = "profile";  
    next();
  }, upload.single("profilePic"), updateProfileImageController );

// UPDATE USER PROFILE DATA || PUT
router.put("/update/:id", authMiddleware, updateUserProfileController);

// CHANGE PASSWORD || PUT
router.put('/change-password', authMiddleware, chngePswdController);

// SEND OTP FOR 2FA
router.post('/enabled/send-otp', authMiddleware, twofaSendOtpController);

// VERIFY OTP FOR 2FA
router.post('/enabled/verify-otp', authMiddleware, twofaVerifyOtpController);

// PROFILE VISIBILTY || PATCH
router.patch('/visibility', authMiddleware, visibilityController);








// FORGOT PASSWORD || POST 
router.post('/forgot-password', authMiddleware, forgotPasswordController);

// VERIFY OTP || POST
router.post('/verify-otp', authMiddleware, vrfyOtpController);

// RESET PASSWORD || POST
router.post('/reset-password', authMiddleware, rstPswdController);







// BLOCK || POST
router.post('/block/:id', authMiddleware, blockUserController);

// BLOCK USER LIST BASED ON ID || GET
router.get('/block-list', authMiddleware, blockUserListController);

// UNBLOCK USER || POST
router.post('/unblock/:id', authMiddleware, unblockUserController);

module.exports = router;