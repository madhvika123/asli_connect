const express = require('express');
const router = express.Router();
const { adminRegisterController, adminLoginController, forgotPasswordController, vrfyOtpController, rstPswdController } = require('../../controllers/adminController/authController.js');

// routes
// REGISTER || POST
router.post('/auth/create', adminRegisterController);

// VERIFY OTP || POST
router.post('/auth/login',adminLoginController);

// FORGOT PASSWORD || POST 
router.post('/forgot-password',forgotPasswordController);

// VERIFY OTP || POST
router.post('/verify-otp', vrfyOtpController);

// RESET PASSWORD || POST
router.post('/reset-password', rstPswdController);

module.exports = router;