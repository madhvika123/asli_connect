const reelsModel = require('../models/reelsModel');
const mongoose = require("mongoose");
const userModel = require('../models/userModel');
const walletModel = require('../models/walletTransactionModel');

// reels create
const reelsCreateService = async (userId, data = {}, file) => {
  const session = await mongoose.startSession();
  session.startTransaction();

   if (!file) {
      await session.abortTransaction();
      session.endSession();
      return { status: 400, success: false, message: "Reel file is required" };
    }

  const filePath = file ? `/uploads/reels/${file.filename}` : null;
  const mediaType = file ? (file.mimetype.startsWith("video/") ? "video" : "image") : null;

  const reelArr = await reelsModel.create([{ user: userId, description: data.description || "", mediaUrl: filePath, mediaType }], { session });

  const reelDoc = reelArr[0];

   const wallet = await walletModel.findOneAndUpdate(
      { user: userId }, {
        $inc: { balance: 1 },
        $push: {
          transactions: {
            type: "credit",
            amount: 1,
            reason: "Reel Uploaded"
          }
        } },
      { new: true, upsert: true, session }
    );

    await session.commitTransaction();
    session.endSession();

  // Populate user details
  let reel = await reelsModel.findById(reelDoc._id).populate("user", "name email profilePic").lean(); // Convert to plain JS object

  const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

  if (reel.user?.profilePic) {
    reel.user.profilePic = `${BASE_URL}${reel.user.profilePic}`;
  }

  if (reel.mediaUrl) {
    reel.mediaUrl = `${BASE_URL}${reel.mediaUrl}`;
  }

  return { status: 201, success: true, message: "Reel created successfully", reel, wallet };
};

// get all reels
const getAllReelsService = async(req, res) => {
  const reels = await reelsModel.find().populate("user", "name email peofilePic").populate("comments.user", "name email profilePic").sort({ createdAt: -1 });

  return { status: 201, success: true, message: "Reels Retrived Successfully", totalReels: reels.length, reels }
};

// get all reels
const getReelsByIdService = async(userId) => {
  const reels = await reelsModel.find({user: userId}).populate("user", "name email peofilePic").populate("comments.user", "name email profilePic").sort({ createdAt: -1 });
  return { status: 201, success: true, message: "Reels Retrived Successfully", totalReels: reels.length, reels }
};

// like or unlike reels
const likeReelsService = async (rlId, userId) => {
  let reel = await reelsModel.findById(rlId);
  if(!reel)  return res.status(404).json({ message: "Reel or Post not found" });

  const isLiked = reel.likes.includes(userId);
  if(isLiked) {
    reel.likes = reel.likes.filter((id) => id.toString() !== userId.toString()); // unlikes
  } else {
    reel.likes.push(userId);  // likes
  }

  // Populate liked user info
  reel = await reelsModel.findById(rlId).populate("likes", "name profilePic");

  await reel.save();
  return { status: 201, success: true, message: "Toggle Likes Successfull", likesCount: reel.likes.length, isLiked: !isLiked, likedUsers: reel.likes };
};

// add comment
const commentService = async (userId, reelId, text) => {
  const reel = await reelsModel.findById(reelId);
  if (!reel) return { status: 404, success: false, message: "Reel not found" };

  if (!reel.isCommentsEnabled)
    return { status: 403, success: false, message: "Comments are disabled" };

  reel.comments.push({ user: userId, text });
  await reel.save();

  return { status: 201, success: true, message: "Comment Added", comments: reel.comments };
};

// edit comment
const editCmntService = async (userId, reelId, { text, commentId }) => {
  const reel = await reelsModel.findById(reelId);
  if (!reel) return { status: 404, success: false, message: "Reel not found" };

  // Convert string to legit ObjectId
  const formattedId = new mongoose.Types.ObjectId(commentId);

  // Now search with converted ID
  const comment = reel.comments.id(formattedId);

  if (!comment) return { status: 404, success: false, message: "Comment not found" };

  if (comment.user.toString() !== userId.toString()) {
    return { status: 403, success: false, message: "Not allowed" };
  }

  comment.text = text;
  comment.updatedAt = new Date();

  await reel.save();

  return { status: 200, success: true, message: "Comment Updated", comments: reel.comments };
};

const deleteCmntService = async(userId, reelId, { commentId }) => {
  const reel = await reelsModel.findById(reelId);
  if (!reel) return { status: 404, success: false, message: "Reel not found" };

  const comment = reel.comments.id(commentId);

  if (!comment) return { status: 404, success: false, message: "Comment not found" };

  if (comment.user.toString() !== userId.toString() && reel.user.toString() !== userId.toString())
    return { status: 403, success: false, message: "Not allowed to delete" };

  comment.deleteOne();
  await reel.save();

  return { status: 200, success: true, message: "Comment Deleted", comments: reel.comments };
};

const toggleCmntService = async (userId, reelId) => {
 const reel = await reelsModel.findById(reelId);
  if (!reel) return { status: 404, success: false, message: "Reel not found" };

  if (reel.user.toString() !== userId.toString())
    return { status: 403, success: false, message: "Not allowed" };

  reel.isCommentsEnabled = !reel.isCommentsEnabled;
  await reel.save();

  return { status: 200, success: true, message: reel.isCommentsEnabled ? "Comments Enabled" : "Comments Disabled", isCommentsEnabled: reel.isCommentsEnabled };
};

const reelsSaveService = async (userId, reelId) => {
  const reel = await reelsModel.findById(reelId);
  if (!reel) return { status: 404, success: false, message: "Reel not found" };

  if(reel.savedBy.includes(userId)) {
    reel.savedBy.pull(userId);
    await reel.save();
    return { status: 200, success: true, saved: false, message: "Reel removed from saved list" };
  }
  reel.savedBy.push(userId);
  await reel.save();

  return { status: 200, success: true, saved: true, message: "Reel saved successfully" };
};

const reelsGetService = async (userId) => {
 const reels = await reelsModel.find({ savedBy: userId }).populate("user", "name profilePic").sort({ createdAt: -1 });
 return { status: 200, success: true, count: reels.length, reels };
};

// add reels viewed by specific user service
const addReelsViewService = async (userId, reelId) => {
  const updtReel = await reelsModel.findByIdAndUpdate({  _id: reelId, views: { $ne: userId }  }, { $addToSet: { views: userId }, $inc: { viewCount: 1 } },  { new: true });  // $ne - dublicate removes, $addToSet - add if only exists, $inc - auto increment
  return { status: 200, success: true, message: updtReel ? 'Viewed Count' : 'User already Viewed', viewCount: updtReel ? updtReel.viewCount : undefined };
};

// get reels viewed by specific user service
const getReelsViewService = async (reelId) => {
  if (!reelId) {
    return res.status(404).json({ success: false, message: "Reel not found" });
  }

  const vwReel = await reelsModel.findById(reelId).select("viewCount");
  return { status: 200, success: true, message: "Retrived Reels", views: vwReel.viewCount };
};

const walletCoinsService = async (userId, amount, itemName) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const wallet = await walletModel.findOne({ user: userId }).session(session);
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  if (wallet.balance < amount) {
    throw new Error("Not enough coins to purchase");
  }

  wallet.balance -= amount;

  wallet.transactions.push({ type: "debit", amount, reason: `Purchased: ${itemName}` });

  await wallet.save({ session });

  await session.commitTransaction();
  session.endSession();

  return { status: 200, success: true,  message: "Purchase successful", balance: wallet.balance };
};

module.exports = { reelsCreateService, getAllReelsService, likeReelsService, commentService, editCmntService, deleteCmntService, toggleCmntService, reelsSaveService, reelsGetService, getReelsByIdService, addReelsViewService, getReelsViewService, walletCoinsService };
