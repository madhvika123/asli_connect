const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { followController, unfollowController, acceptRequestController, declineRequestController, blockUserController, unblockUserController, removeFollowerController, followersListController, followingListController, blockedUsersListController, pendingRequestsListController } = require('../controllers/userRelationController');


const router = express.Router();

// FOLLOW ROUTES || POST
router.patch("/follow/:targetUserId", authMiddleware, followController);

// UNFOLLOW ROUTES || POST
router.delete("/unfollow/:targetUserId", authMiddleware, unfollowController);

// ACCEPT REQUEST ROUTES || POST
router.post('/accept/:targetUserId', authMiddleware, acceptRequestController);

// DECLINE REQUEST ROUTES || DELETE
router.delete('/decline/:targetUserId', authMiddleware, declineRequestController);

// BLOCK USER ROUTES || POST
router.post('/block/:targetUserId', authMiddleware, blockUserController);

// UNBLOCK USER ROUTES || POST
router.delete('/unblock/:targetUserId', authMiddleware, unblockUserController);

// REMOVE FOLLOWER ROUTES || DELETE
router.delete('/remove-follower/:targetUserId', authMiddleware, removeFollowerController);

// FOLLOWERS LIST || GET
router.get('/followers', authMiddleware, followersListController);

// FOLLOWING LIST || GET
router.get('/following', authMiddleware, followingListController);

// BLOCKED USERS LIST || GET
router.get('/blocked', authMiddleware, blockedUsersListController);

// PENDING REQUESTS || GET
router.get('/requests', authMiddleware, pendingRequestsListController);

module.exports = router;