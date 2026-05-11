const logger = require('../utils/logger');
const  { registerValidation, verifyEmailValidation, loginValidation, verifyTwoFactorOtpValidation } = require('../validations/authValidation');
const  { registerUserService, vrfyEmailService, loginUserService, verifyTwoFactorOtpService } = require('../services/authServices');


const registerController = async (req, res) => {
  const userRegVal = registerValidation(req.body);
  if (userRegVal.success) {
    try {
      const user = await registerUserService(req.body);
      res.status(user.status).json(user);
    }
    catch (err) {
      logger.error('Error in Register API');
      return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
    }
  } else return res.status(400).send({ success: false, message: userRegVal.message });

};

// const verifyEmailOtpController = async (req, res) => {
//     const vrfyEmlVal = verifyEmailValidation(req.body);
//     if (vrfyEmlVal.success) {
//         try {
//             const vrfyEmil = await vrfyEmailService(req.body);
//             res.status(vrfyEmil.status).json(vrfyEmil);
//         }
//         catch (err) {
//             logger.error('Error in Verify Email API');
//             return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
//         }
//     } else return res.status(400).send({ success: false, message: vrfyEmlVal.message });
// };
// controllers/authController.js

 
const verifyEmailOtpController = async (req, res) => {

    try {

        const validation = await verifyEmailValidation(req.body);

        // Validation failed
        if (!validation.success) {

            return res.status(validation.status).json({
                success: false,
                message: validation.message
            });

        }

        // Success response
        return res.status(200).json({
            success: true,
            message: validation.message,
            data: {
                id: validation.user._id,
                name: validation.user.name,
                email: validation.user.email,
                isEmailVerified: validation.user.isEmailVerified
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });

    }

};

 
const loginController = async (req, res) => {
    const lgnVal = loginValidation(req.body);
    if(lgnVal.success) {
        try {
            const lgnUsr = await loginUserService(req.body, req);
            res.status(lgnUsr.status).json(lgnUsr);
        } catch (err) {
            logger.error('Error in Login API');
            return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
        }
    } else return res.status(400).send({ success: false, message: lgnVal.message });
};

const verifyTwoFactorOtpController = async (req, res) => {
    const otpVrfyVldtn = verifyTwoFactorOtpValidation(req.body);
    if(otpVrfyVldtn.success) {
        try {
            const lgnUsr = await verifyTwoFactorOtpService(req.body, req);
            res.status(lgnUsr.status).json(lgnUsr);
        } catch (err) {
            logger.error('Error in Verify Two Factor OTP API');
            return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
        }
    } else return res.status(400).send({ success: false, message: otpVrfyVldtn.message });
};



module.exports = { registerController, verifyEmailOtpController, loginController, verifyTwoFactorOtpController };