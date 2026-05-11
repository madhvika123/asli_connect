const userModel = require('../models/userModel');
// const { sendNotification } = require('../utils/socket')

// follow & unfollow servcie
const followUnfollowService = async (loginUserId, targetUserId) => {
  if (loginUserId === targetUserId)
  return { status: 400, success: false, message: "You cannot follow yourself" };

  const me = await userModel.findById(loginUserId);
  const target = await userModel.findById(targetUserId);

  if (!target) return { status: 404, success: false, message: "User not found" };
 
  // user blocked
  if(target.blockedUsers.includes(loginUserId)) return { status: 403, success: false, message: "You are blocked by the user"};

  const isFollowing = me.following.includes(targetUserId);
  const targetFollowMe = target.following.includes(loginUserId); 

  // unfollow or remove friends
  if(isFollowing) {
   me.following.pull(targetUserId); 
   target.followers.pull(loginUserId);

   if(me.friends.includes(targetUserId)) {
     me.following.pull(targetUserId);
    target.followers.pull(loginUserId);
   }

   await me.save();
   await target.save();

   return { status: 200, success: true, following: false, message: "Unfollowed successfully" };
  }

  //  follow logic based on visibility
  switch(target.profileVisibility) {

    // public -> instant follow
    case "public":
      me.following.push(targetUserId);
      target.followers.push(loginUserId);

      await me.save();
      await target.save();

      // sendNotification(targetUserId, { sender: { _id: me._id, name: me.name }, type: "follow", message: `${me.name} started following you` });
      return { status: 200, success: true, following: true, message: "Followed successfully" };

    // private -> send follow request
    case "private": 
      if(target.followRequests.includes(loginUserId)) {
        target.followRequests.pull(loginUserId);

        await target.save();
        return { status: 200, success: true, request: false, message: 'Request Cancelled' };
      }

      target.followRequests.push(loginUserId);

      target.notifications.push({ sender: loginUserId, type: 'follow-request', message: `${me.name} requested to follow you`});

      await target.save();
      // sendNotification(targetUserId, { sender: { _id: me._id, name: me.name }, type: "follow-request", message: `${me.name} requested to follow you` });

    // friends -> mutual follow
    case "friends":
      if(target.followRequests.includes(loginUserId)) {
        target.followRequests.pull(loginUserId);

        await target.save();
        return { status: 200, success: true, request: false, message: 'Friend Request Cancelled' };
      }

      // auto friend traget follows me
      if(targetFollowMe) {
        me.following.push(targetUserId);
        target.followers.push(loginUserId);

        await me.save();
        await target.save();
        return { status: 200, success: true, friend: true, message: "You are now friends!" };
      }

      target.followRequests.push(loginUserId);

      target.notifications.push({ sender: loginUserId, type: "friend-request", message: `${me.name} sent you a friend request` });

    await target.save();

    // sendNotification(targetUserId, { sender: { _id: me._id, name: me.name }, type: "friend-request", message: `${me.name} sent you a friend request` });

    return { status: 200, success: true, request: true, message: "Friend request sent" };
  }
};

// request accept service
const acceptRequestService = async (userId, requesterId) => {
 const user  = await userModel.findById(userId);
 const requester = await userModel.findById(requesterId);

 if(!user.followRequests.includes(requesterId)) return { status: 400, success: false, message: "No follow request" };

 user.followRequests.pull(requesterId);

 user.followers.push(requesterId);
 requester.following.push(userId);

 if(user.profileVisibility === 'friends') {
  user.friends.push(requesterId);
  requester.friends.push(userId);
 }

 await user.save();
 await requester.save();

//  sendNotification(requesterId, { sender: { _id: user._id, name: user.name }, type: "request-accepted", message: `${user.name} accepted your request` });

 return { status: 200, success: true, message: "Request accepted" };
};

// decline accept service
const declineRequestService = async (userId, requesterId) => {
 const user  = await userModel.findById(userId);
 if(!user.followRequests.includes(requesterId)) return { status: 400, success: false, message: "No follow request" };

 user.followRequests.pull(requesterId);
 await user.save();


 return { status: 200, success: true, message: "Follow request declined" };
};


const getNotificationsService = async (userId) => {
    const user = await userModel.findById(userId).populate("notifications.sender", "name profilePic");

    return { status: 200, success: true, count: user.notifications.length, notifications: user.notifications.reverse() };
};

module.exports = { followUnfollowService, acceptRequestService, declineRequestService, getNotificationsService };