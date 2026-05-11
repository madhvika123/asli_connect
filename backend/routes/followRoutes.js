const express = require('express');
const { followUnfollowController, acceptRequestController, declineRequestController,getNotificationsController} = require('../controllers/followController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// routes
// FOLLOW & UNFOLLOW || POST /api/follow/user-follow/:id
router.post('/user-follow/:id', authMiddleware, followUnfollowController);

// ACCEPT REQUEST || POST /api/follow/accept/:id
router.post('/request/accept/:id', authMiddleware, acceptRequestController);

// DECLINE REQUEST || POST /api/follow/decline/:id
router.post('/request/decline/:id', authMiddleware, declineRequestController);

// GET NOTIFICATION || GET /api/follow/get-notification
router.get("/get-notification", authMiddleware, getNotificationsController);

module.exports = router;