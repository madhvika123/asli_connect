const mongoose = require('mongoose');

// schema
const jobSchema = new mongoose.Schema({
   jobTitle: { type: String, required: true, trim: true, index: true }, //job title indexed for search optimization
   companyName: { type: String, required: true, trim: true }, // company name
   jobType: { type: String,  enum: ["full-time", "part-time", "contract", "internship", "freelance"], required: true }, // job type
   jobSummary: { type: String, required: true }, // job summary
   workEmail: { type: String, required: true, lowercase: true, trim: true }, // contact email
   requiredSkills: [{ type: String, required: true }], // required skills as an array of strings
   experienceLevel: { type: String,  enum: ["fresher", "junior", "mid", "senior", "lead"], required: true}, // experience level
   workLocation: { type: String, required: true, index: true }, // work location indexed for search optimization
   salaryRange: { min: Number, max: Number, currency: { type: String, default: "INR" } }, // salary range with currency
   postValidityDate: { type: Date, required: true }, // post validity date format: YYYY-MM-DD
   applicationLink: { type: String }, // application link (optional)
   status: { type: String, enum: ["open", "closed", "expired"], default: "open" }, // job status
   isDeleted: { type: Boolean, default: false }, // soft delete flag
   likesCount: { type: Number, default: 0, index: true }, // user likes count
   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // reference to the user who created the job
}, { timestamps: true });

// soft delete middleware
jobSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

// exports
module.exports = mongoose.model('Job', jobSchema);