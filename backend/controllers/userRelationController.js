const logger = require('../utils/logger');
const { followService, unfollowService, acceptRequestService, declineRequestService, blockUserService, unblockUserService, removeFollowerService, followersListService, followingListService, blockedUsersListService, pendingRequestsListService } = require('../services/userRelationService');

const followController = async (req, res) => {
  try {
    const follow = await followService(req.user.id, req.params.targetUserId);
    res.status(follow.status).json(follow);
  } catch (err) {
    logger.error('Error in User Follow API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const unfollowController = async (req, res) => {
  try {
    const unfollow = await unfollowService(req.user.id, req.params.targetUserId);
    res.status(unfollow.status).json(unfollow);
  } catch (err) {
    logger.error('Error in User Unfollow API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const acceptRequestController = async (req, res) => {
  try {
    const accept = await acceptRequestService(req.user.id, req.params.targetUserId);
    res.status(accept.status).json(accept);
  } catch (err) {
    logger.error('Error in Accept Follow Request API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const declineRequestController = async (req, res) => {
  try {
    const decline = await declineRequestService(req.user.id, req.params.targetUserId);  
    res.status(decline.status).json(decline);
  } catch (err) {
    logger.error('Error in Decline Follow Request API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  } 
};

const blockUserController = async (req, res) => { 
  try {
    const block = await blockUserService(req.user.id, req.params.targetUserId);  
    res.status(block.status).json(block);
  } catch (err) {
    logger.error('Error in Block User API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  } 
};

const unblockUserController = async (req, res) => {
  try {
    const unblock = await unblockUserService(req.user.id, req.params.targetUserId); 
    res.status(unblock.status).json(unblock);
  } catch (err) {     
    logger.error('Error in Unblock User API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }   
};

const removeFollowerController = async (req, res) => {
  try {
    const removeFollower = await removeFollowerService(req.user.id, req.params.targetUserId); 
    res.status(removeFollower.status).json(removeFollower);
  } catch (err) {
    logger.error('Error in Remove Follower API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const followersListController = async (req, res) => {
  try {
    const followers = await followersListService(req.user.id);
    res.status(followers.status).json(followers);
  } catch (err) {
    logger.error('Error in Followers List API'); 
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message }); 
  }  
};

const followingListController = async (req, res) => { 
  try {
    const following = await followingListService(req.user.id);
    res.status(following.status).json(following);
  } catch (err) {
    logger.error('Error in Following List API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const blockedUsersListController = async (req, res) => {
  try {
    const blocked = await blockedUsersListService(req.user.id);   
    res.status(blocked.status).json(blocked);
  } catch (err) { 
    logger.error('Error in Blocked Users List API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const pendingRequestsListController = async (req, res) => {
  try { 
    const pending = await pendingRequestsListService(req.user.id); 
    res.status(pending.status).json(pending); 
  } catch (err) { 
    logger.error('Error in Pending Follow Requests List API'); 
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message }); 
  }
};

module.exports = { followController, unfollowController, acceptRequestController, declineRequestController, blockUserController, unblockUserController, removeFollowerController, followersListController, followingListController, blockedUsersListController, pendingRequestsListController };