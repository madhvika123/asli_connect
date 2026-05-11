const express = require('express');
const router = express.Router();
const { registerController, verifyEmailOtpController, loginController, verifyTwoFactorOtpController } = require('../controllers/authController');

// routes
// REGISTER || POST
router.post('/register', registerController);

// SEND OTP || POST
router.post('/verify-email-otp', verifyEmailOtpController);

// VERIFY PASSWORD || POST
router.post('/login/verify-password', loginController);

// VERIFY 2FA OTP || POST
router.post('/login/verify-2fa-otp', verifyTwoFactorOtpController);

module.exports = router;