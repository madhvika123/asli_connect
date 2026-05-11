const logger = require('../utils/logger');
const { updtUsrValidation, chngePswdValidation } = require('../validations/profileValidation');
const { getProfileDetailsService, updateProfileImageService, updtUsrPrflService, chngePswdService, twofaSendOtpService, twofaVerifyOtpService, forgotPasswordService, verifyOtpService, rstPswdService,  visibilityService, blockUserService, blockUserListService, unblockUserService } = require('../services/profileServcie');

const profileDetailsController = async (req, res) => {
  try {    
    const profileDetails = await getProfileDetailsService(req.user.id);
    res.status(profileDetails.status).json(profileDetails);
  } catch (err) {
    logger.error('Error in User Profile View API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const updateProfileImageController = async (req, res) => {
   try {
        const updtImg = await updateProfileImageService(req.user.id,req.file);
        res.status(updtImg.status).json(updtImg);
    }
    catch (err) {
        logger.error('Error in Profile Image API');
        return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

const updateUserProfileController = async (req, res) => {
  const updtUsr = updtUsrValidation(req.body);
  if(updtUsr.success) {
      try {
          const updtUsrPrfl = await updtUsrPrflService(req.user.id,req.body);
          res.status(updtUsrPrfl.status).json(updtUsrPrfl);
      } catch (err) {
          logger.error('Error in Update User Profile API');
          return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
      }
  } else return res.status(400).send({ success: false, message: updtUsr.message });
};

const chngePswdController = async (req, res) => {
  const pswdVldn = chngePswdValidation(req.body);
  if(pswdVldn.success) {
      try {
        const chngPswd = await chngePswdService(req.user.id, req.body);
        res.status(chngPswd.status).json(chngPswd);
      } catch (err) {
        logger.error('Error in Change Password API');
        return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
      }
  } else return res.status(400).send({ success: false, message: pswdVldn.message });
};

const twofaSendOtpController = async (req, res) => {
  try {
    const sendOtp = await twofaSendOtpService(req.user.id);
    res.status(sendOtp.status).json(sendOtp);
  } catch (err) {
    logger.error('Error in 2FA SEND OTP API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const twofaVerifyOtpController = async (req, res) => {
  try {
    const verifyOtp = await twofaVerifyOtpService(req.body);
    res.status(verifyOtp.status).json(verifyOtp);
  } catch (err) {
    logger.error('Error in 2FA VERIFY OTP API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const fgtPswd = await forgotPasswordService(req.body);
    res.status(fgtPswd.status).json(fgtPswd);
  } catch (err) {
    logger.error('Error in Forgot Password API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};  

const vrfyOtpController = async (req, res) => {
  try {
    const vrfyOtp = await verifyOtpService(req.body);
    res.status(vrfyOtp.status).json(vrfyOtp);
  } catch (error) {
    logger.error('Error in Verify OTP API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const visibilityController = async (req, res) => {
   try {
    const vsbility = await visibilityService(req.user.id, req.body);
    res.status(vsbility.status).json(vsbility);
  } catch (err) {
    logger.error('Error in Profile Visibility API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const rstPswdController = async (req, res) => { 
  try {
    const rstPswd = await rstPswdService(req.body);
    res.status(rstPswd.status).json(rstPswd);
  } catch (err) {
    logger.error('Error in Reset Password API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};


 
const blockUserController = async (req, res) => {
  try {
    const response = await blockUserService(req.user.id, req.params.id);
    res.status(response.status).json(response);
  } catch (err) {
    logger.error('Error in Block User API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const blockUserListController = async (req, res) => {
  try {
    const response = await blockUserListService(req.user.id);
    res.status(response.status).json(response);
  } catch (err) {
    logger.error('Error in Block User List API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const unblockUserController = async (req, res) => {
  try {
    const response = await unblockUserService(req.user.id, req.params.id);
    res.status(response.status).json(response);
  } catch (err) {
    logger.error('Error in Block User API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

module.exports = { profileDetailsController, updateProfileImageController, updateUserProfileController, forgotPasswordController, vrfyOtpController, rstPswdController, chngePswdController, visibilityController, blockUserController, blockUserListController, unblockUserController, twofaSendOtpController, twofaVerifyOtpController };