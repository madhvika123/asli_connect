const logger = require('../../utils/logger');
const { adminRegisterValidation, adminLoginValidation } = require('../../validations/adminValidation/authValidation')
const  { adminRegisterUserService, adminLoginUserService, forgotPasswordService, verifyOtpService, rstPswdService } = require('../../services/adminServices/authService');

const adminRegisterController = async (req, res) => {
  const userRegVal = adminRegisterValidation(req.body);
  if (userRegVal.success) {
    try {
      const user = await adminRegisterUserService(req.body);
      res.status(user.status).json(user);
    }
    catch (err) {
      logger.error('Error in Admin Register API');
      return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
    }
  } else return res.status(400).send({ success: false, message: userRegVal.message });

};

const adminLoginController = async (req, res) => {
    const lgnVal = adminLoginValidation(req.body);
    if(lgnVal.success) {
        try {
            const lgnUsr = await adminLoginUserService(req.body);
            res.status(lgnUsr.status).json(lgnUsr);
        } catch (err) {
            logger.error('Error in Admin Login API');
            return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
        }
    } else return res.status(400).send({ success: false, message: lgnVal.message });
};

  const forgotPasswordController = async (req, res) => {
      try {
        const fgtPswd = await forgotPasswordService(req.body);
        res.status(fgtPswd.status).json(fgtPswd);
      } catch (err) {
        logger.error('Error in Admin Forgot Password API');
        return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
      }
  }; 

const vrfyOtpController = async (req, res) => {
  try {
    const vrfyOtp = await verifyOtpService(req.body);
    res.status(vrfyOtp.status).json(vrfyOtp);
  } catch (error) {
    logger.error('Error in Admin Verify OTP API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const rstPswdController = async (req, res) => { 
  try {
    const rstPswd = await rstPswdService(req.body);
    res.status(rstPswd.status).json(rstPswd);
  } catch (err) {
    logger.error('Error in Admin Reset Password API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

module.exports = { adminRegisterController, adminLoginController, forgotPasswordController, vrfyOtpController, rstPswdController };