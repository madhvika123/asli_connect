const job = require('../models/jobModel');
const { sendEmail } = require('../services/emailService');
const jobApplicatioinModel = require('../models/jobApplicationModel');

const jobApplicationService = async (data) => {
  console.log("====data=====", data);
  const existingApplication = await jobApplicatioinModel.findOne({ jobId: data.jobId, appliedBy: data.appliedBy });
  if (existingApplication) return { status: 400, success: false, message: "You have already applied for this job." };
  
  // fetch job details to get jobOwner
  const jobDetails = await job.findById(data.jobId).populate('createdBy');
  console.log("Fetched job details for application:", jobDetails);
  if (!jobDetails) return { status: 404, success: false, message: "Job not found." };

  data.jobOwner = jobDetails.createdBy.id; // set jobOwner from job details
  data.jobTitle = jobDetails.jobTitle; // set jobTitle from job details
  data.companyName = jobDetails.companyName; // set companyName from job details

  // send email notification to job owner about new application
  const emailSubject = `New Application for ${jobDetails.jobTitle}`;
  const emailBody = `You have received a new application for your job posting "${jobDetails.jobTitle}" from ${data.fullName} (${data.email}). Please review the application and update its status.`;
  await sendEmail({ to: jobDetails.createdBy.email, subject: emailSubject, text: emailBody });

  const newApplication = new jobApplicatioinModel(data);
  await newApplication.save();

  return { status: 200, success: true, message: "Job application submitted successfully.", data: { jobId: newApplication.jobId, jobOwner: newApplication.jobOwner, appliedBy: newApplication.appliedBy, jobTitle: newApplication.jobTitle, companyName: newApplication.companyName, fullName: newApplication.fullName, email: newApplication.email, phoneNumber: newApplication.phoneNumber, totalExperience: newApplication.totalExperience, currentSalary: newApplication.currentSalary, expectedSalary: newApplication.expectedSalary, skills: newApplication.skills, location: newApplication.location, resumeLink: newApplication.resumeLink, applicationStatus: newApplication.applicationStatus, _id: newApplication._id} };
};

module.exports = { jobApplicationService };
