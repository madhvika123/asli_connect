const logger = require('../../utils/logger');
const { viewUsrPrflService, updtUsrPrflService } = require('../../services/adminServices/profileService');

const profileViewController = async (req, res) => {
  try {
    const id = req.params.id;
    const prflVw = await viewUsrPrflService(id);
    res.status(prflVw.status).json(prflVw);
  }
  catch (err) {
    logger.error('Error in Admin Profile View API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const updateUserProfileController = async (req, res) => {
  try {
    const id = req.params.id;
    const updtPrfl = await updtUsrPrflService(id,req.body);
    res.status(updtPrfl.status).json(updtPrfl);
  }
  catch (err) {
    logger.error('Error in User Profile Update API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

module.exports = { profileViewController, updateUserProfileController };