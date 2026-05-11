const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },  // jobId from Job model
  jobOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // jobOwner userId from User model
  appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Applied userId from User model
  jobTitle: { type: String, required: true, trim: true }, //job name
  companyName: { type: String, required: true, trim: true }, //applying company name 
  fullName: { type: String, required: true, trim: true }, // applicant full name
  email: { type: String, required: true, lowercase: true, trim: true}, // applicant email
  phoneNumber: { type: String, required: true }, // applicant phone number
  totalExperience: { type: String, required: true }, // "2 years", "3+ years" etc.
  currentSalary: { type: Number, required: true }, // in number format
  expectedSalary: { type: Number, required: true }, // in number format
  skills: [{ type: String, required: true }], // skills as an  array of strings
  location: { type: String, required: true }, // current location
  coverLetter: { type: String }, // cover letter text
  resumeLink: { type: String, default: null }, // optional resume upload
  applicationStatus: { type: String, enum: ["Applied", "Shortlisted", "Rejected", "Hired"], default: "Applied" }, // application status
}, { timestamps: true }); 

// prevent duplicate apply for the same job by the same user
jobApplicationSchema.index({ jobId: 1, appliedBy: 1 }, { unique: true });

// exports
module.exports = mongoose.model("JobApplication", jobApplicationSchema);
