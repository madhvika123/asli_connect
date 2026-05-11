const mongoose = require('mongoose');

const reelsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },  //Reference to the user who posted the reel
    media:[{ url: { type: String, required: true }, type: { type: String, enum: ["image", "video"], required: true } }], // medial url
    // mediaType: { type: String, enum: ["image", "video"], required: true }, // media type - image or video
    description: { type: String },  // Description or caption for the reel
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Users who liked the reel
    likesCount: { type: Number, default: 0 },  // likes count
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Users who saved the reel,
    savesCount: { type: Number, default: 0 }, // saved count
    comments: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }],  // Comments on the reel
    commentsCount: { type: Number, default: 0 }, // comments count
    isCommentsEnabled: { type: Boolean, default: true },  // comments enabled
    location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], default: [0, 0] } }, // [longitude, latitude] 
    viewCount: { type: Number, default: 0 }, // view count 
}, { timestamps: true }); 

reelsSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Reel', reelsSchema);