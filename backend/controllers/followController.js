const logger = require('../utils/logger');
const { followUnfollowService, acceptRequestService, declineRequestService, getNotificationsService } = require('../services/followService');

// follow & unfollow controller
const followUnfollowController = async (req, res) => {
  try {
    const response = await followUnfollowService(req.user.id, req.params.id);
    res.status(response.status).json(response);
  }
  catch (err) {
    logger.error('Error in Follow & Unfollow API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

// accept request controller
const acceptRequestController = async (req, res) => {
  try {
    const response = await acceptRequestService(req.user.id, req.params.id);
    res.status(response.status).json(response);
  }
  catch (err) {
    logger.error('Error in Accept Request API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

// decline request controller
const declineRequestController = async (req, res) => {
  try {
    const response = await declineRequestService(req.user.id, req.params.id);
    res.status(response.status).json(response);
  }
  catch (err) {
    logger.error('Error in Decline Request API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
}


const getNotificationsController = async (req, res) => {
    try {
      const response = await getNotificationsService(req.user.id);
      res.status(response.status).json(response);
    }
    catch (err) {
      logger.error('Error in Follow & Unfollow API');
      return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
    }
}

module.exports = { followUnfollowController, getNotificationsController, declineRequestController,acceptRequestController };