const logger = require('../utils/logger');
const { reelsCreateService, getAllReelsService, getReelsByIdService, likeReelsService, commentService, editCmntService, deleteCmntService, toggleCmntService, reelsSaveService, reelsGetService, addReelsViewService, getReelsViewService, walletCoinsService } = require('../services/reelsService');
const { findById } = require('../models/reelsModel');

const reelCreateController = async (req, res) => {
    try {
        const rlsCrt = await reelsCreateService(req.user.id, req.body, req.file);
        res.status(rlsCrt.status).json(rlsCrt);
    }
    catch (err) {
        logger.error('Error in Reels Create API');
        return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

const getAllReelsController = async (req, res) => {
    try {
        const rlsLst = await getAllReelsService();
        res.status(rlsLst.status).json(rlsLst);
    }
    catch (err) {
        logger.error('Error in Get Reels List API', err);
        return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

// reels by id
const getReelsByIdController = async (req, res) => {
  try {
      const response = await getReelsByIdService(req.params.id);
      res.status(response.status).json(response);
  }
  catch (err) {
      logger.error('Error in Get Reels By ID API', err);
      return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const getReelsByIDController = async (req, res) => {
    try {
        const rlsLst = await findById();
        res.status(rlsLst.status).json(rlsLst);
    }
    catch (err) {
        logger.error('Error in Get Reels List API', err);
        return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

const likesReelController = async (req, res) => {
    try {
        const rlsLikes = await likeReelsService(req.params.id, req.user.id);
        res.status(rlsLikes.status).json(rlsLikes);
    }
    catch (err) {
        logger.error('Error in Reels Likes API', err);
        return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

const commentController = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: "Text is required" });
    }
    const response = await commentService(req.user.id, req.params.id, text);

    return res.status(response.status).json(response);
  } catch (err) {
    logger.error("Error in Comment Add API", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

const editCmntController = async (req, res) => {
  try {
    const body = req.body || {};

    const text = body.text || null;
    const commentId = body.commentId || null;

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: "Text is required" });
    }
    const response = await editCmntService(req.user.id, req.params.id, { text,commentId });

    return res.status(response.status).json(response);
  } catch (err) {
    logger.error("Error in Comment Edit API", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

const deleteCmntController = async (req, res) => {
try {
    const body = req.body || {};
    const commentId = body.commentId || null;

    const response = await deleteCmntService(req.user.id, req.params.id, { commentId });

    return res.status(response.status).json(response);
  } catch (err) {
    logger.error("Error in Comment DELETE API", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

const toggleReelController = async (req, res) => {
  try {
    const response = await toggleCmntService(req.user.id, req.params.id);
    return res.status(response.status).json(response);
  } catch (err) {
    logger.error("Error in Comment TOGGLE API", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

const reelsSaveController = async (req, res) => {
 try {
    const response = await reelsSaveService(req.user.id, req.params.id);
    return res.status(response.status).json(response);
  } catch (err) {
    logger.error("Error in Comment TOGGLE API", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

const reelsGetController = async (req, res) => {
 try {
    const response = await reelsGetService(req.user.id);
    return res.status(response.status).json(response);
  } catch (err) {
    logger.error("Error in Comment TOGGLE API", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

// add reels viewed by specific user controller
const addReelsViewController = async (req, res) => {
  try {
    const response = await addReelsViewService(req.user.id, req.params.id);
    return res.status(response.status).json(response);
  } catch (err) {
    logger.error("Error in ADD Reel View API", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

// get reels viewed by specific user controller
const getReelsViewController = async (req, res) => {
  try {
    const response = await getReelsViewService(req.params.id);
    return res.status(response.status).json(response);
  } catch (err) {
    logger.error("Error in Get Reel View API", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

// wallet coins
const walletCoinsController = async (req, res) => {
 try {
    const { userId, amount, itemName } = req.body;

    const response = await walletCoinsService(userId, amount, itemName);
    return res.status(response.status).json(response);
  } catch (err) {
    logger.error("Error in Get Reel View API", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

module.exports = { reelCreateController, getAllReelsController, getReelsByIdController, likesReelController, commentController, editCmntController, deleteCmntController, toggleReelController,  reelsSaveController, reelsGetController, addReelsViewController, getReelsViewController, walletCoinsController };