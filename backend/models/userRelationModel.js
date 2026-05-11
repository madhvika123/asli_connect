const mongoose  = require('mongoose');

const userRelationSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // current user id
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // target user id
  relationType: { type: String, enum: ['following', 'requested', 'blocked'], required: true },  // relation type: following, requested, blocked
}, { timestamps: true });

userRelationSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

module.exports = mongoose.model('UserRelation', userRelationSchema);