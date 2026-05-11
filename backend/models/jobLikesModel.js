const mongoose = require("mongoose");

const jobLikeScheema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
});

// prevent dublicate likes
jobLikeScheema.index({ jobId: 1, userId: 1}, { unique:  true });

module.exports = mongoose.model("JobLike", jobLikeScheema);