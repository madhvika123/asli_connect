
const userModel = require('../models/userModel');
const relationModel = require('../models/userRelationModel');

const followService = async (currentUserId, targetUserId) => {
  const targetUser = await userModel.findById(targetUserId)
  if (!targetUser) return { status: 400, success: false, message: "User not found" };

  const relationType = targetUser.profileVisibility === 'public' ? 'following' : 'Requested';

  await relationModel.findOneAndUpdate({ fromUser: currentUserId, toUser: targetUserId }, { relationType }, { upsert: true, new: true });

  return { status: 200, success: true, message: "User followed successfully" };
};

const unfollowService = async (currentUserId, targetUserId) => {
  await relationModel.findOneAndDelete({ fromUser: currentUserId, toUser: targetUserId });
  return { status: 200, success: true, message: "User unfollowed successfully" };
};

const acceptRequestService = async (currentUserId, targetUserId) => { 
  await relationModel.findOneAndUpdate({ fromUser: targetUserId, toUser: currentUserId, relationType: 'Requested' }, { relationType: 'following' });
  return { status: 200, success: true, message: "Follow request accepted successfully" };
};

const declineRequestService = async (currentUserId, targetUserId) => { 
  await relationModel.findOneAndDelete({ fromUser: targetUserId, toUser: currentUserId, relationType: 'Requested' });
  return { status: 200, success: true, message: "Follow request declined successfully" };
};

const blockUserService = async (currentUserId, targetUserId) => {
  await relationModel.findOneAndUpdate({ fromUser: currentUserId, toUser: targetUserId }, { relationType: 'blocked' }, { upsert: true, new: true });
  await relationModel.deleteMany({ fromUser: targetUserId, toUser: currentUserId });

  return { status: 200, success: true, message: "User blocked successfully" };            
};

const unblockUserService = async (currentUserId, targetUserId) => {
  await relationModel.findOneAndDelete({ fromUser: currentUserId, toUser: targetUserId, relationType: 'blocked' });
  return { status: 200, success: true, message: "User unblocked successfully" };
};

const removeFollowerService = async (currentUserId, targetUserId) => {
  await relationModel.findOneAndDelete({ fromUser: targetUserId, toUser: currentUserId, relationType: 'following' });
  return { status: 200, success: true, message: "Follower removed successfully" }; 
};

const followersListService = async (currentUserId) => { 
  const followers = await relationModel.find({ toUser: currentUserId, relationType: 'following' }).populate('fromUser', '_id userName profilePic').lean();
  const formattedFollowers = followers.map(follower => ({ _id: follower.fromUser._id, username: follower.fromUser.userName, profilePicture: follower.fromUser.profilePic }));
  return { status: 200, success: true, message: "Followers list retrieved successfully", data: formattedFollowers };
};

const followingListService = async (currentUserId) => {
  const following = await relationModel.find({ fromUser: currentUserId, relationType: 'following' }).populate('toUser', '_id userName profilePic');
  const formattedFollowing = following.map(follower => ({ _id: follower.toUser._id, username: follower.toUser.userName, profilePicture: follower.toUser.profilePic }));
  return { status: 200, success: true, message: "Following list retrieved successfully", data: formattedFollowing };
};

const blockedUsersListService = async (currentUserId) => {
  const blocked = await relationModel.find({ fromUser: currentUserId, relationType: 'blocked' }).populate('toUser', '_id userName profilePic');
  const formattedBlocked = blocked.map(user => ({ _id: user.toUser._id, username: user.toUser.userName, profilePicture: user.toUser.profilePic })); 
  return { status: 200, success: true, message: "Blocked users list retrieved successfully", data: formattedBlocked };
};

const pendingRequestsListService = async (currentUserId) => {
  const requests = await relationModel.find({ toUser: currentUserId, relationType: 'Requested' }).populate('fromUser', '_id userName profilePic'); 
  const formattedRequests = requests.map(request => ({ _id: request.fromUser._id, username: request.fromUser.userName, profilePicture: request.fromUser.profilePic }));
  return { status: 200, success: true, message: "Pending follow requests list retrieved successfully", data: formattedRequests }; 
};

module.exports = { followService, unfollowService, acceptRequestService, declineRequestService, blockUserService, unblockUserService, removeFollowerService, followersListService, followingListService, blockedUsersListService, pendingRequestsListService };