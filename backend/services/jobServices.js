const mongoose = require("mongoose");
const jobModel = require('../models/jobModel');
const walletModel = require('../models/walletModel');
const walletTransactionModel = require('../models/walletTransactionModel');
const jobLikeModel = require("../models/jobLikesModel");

const JOB_POST_REWARD = 10;

const jobCreateService = async(data, userId, meta = {}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const job = await jobModel.create([data], { session });

    // Create wallet if not exists or update
    const wallet = await walletModel.findOneAndUpdate( { userId }, { $inc: { balance: JOB_POST_REWARD, totalCredits: JOB_POST_REWARD }, $set: { lastTransactionAt: new Date() } }, { new: true, upsert: true, session, setDefaultsOnInsert: true });

    // Add wallet transaction 
    await walletTransactionModel.create([{ userId, walletId: wallet._id, type: "credit", amount: JOB_POST_REWARD, reason: "Job posted reward", referenceId: job[0]._id, referenceType: "job", ip: meta.ip, userAgent: meta.userAgent }], { session });

    await session.commitTransaction();

    return { status: 201, success: true, message: "Job posted and coins credited", data: job[0] };

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const getAllJobsService = async(query) => {
  let { page = 1, limit = 10, search } = query;

  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;
  let filter = { isDeleted: false };

  if (search) {
    filter.$or = [
      { jobTitle: { $regex: search, $options: "i" } },
      { companyName: { $regex: search, $options: "i" } },
      { requiredSkills: { $regex: search, $options: "i" } }
    ];
  }

  const jobs = await jobModel.find(filter).sort({ likesCount: -1, createdAt: -1 }).skip(skip).limit(limit);

  const today = new Date();

  const formattedJobs = jobs.map(job => {
    let status = job.status;

    if (job.postValidityDate < today) {
      status = "expired";
    }

    return { ...job.toObject(), status };
  });

  const total = await jobModel.countDocuments(filter);

  return { status: 200, success: true, message: "All Job List Retrieved Successfully", data: formattedJobs, page, totalPages: Math.ceil(total / limit), totalJobs: total };
};

const getJobByIdService = async(jobId) => {
   const job = await jobModel.findById(jobId);
   if (!job) return { status: 404, success: false, message: 'Job not found' };

   let status = job.status;
    if (job.postValidityDate < new Date()) status = "expired";
   
  return { status: 200, success: true, message: 'Job Retrived Successfully', data: { ...job.toObject(), status } };
};

const updateJobService = async(jobId, data) => {
  const job = await jobModel.findByIdAndUpdate(jobId, data, { new: true });
  if (!job) {
    return { status: 404, success: false, message: 'Job not found' };       
  } else {
    return { status: 200, success: true, message: 'Job Updated Successfully', data: job };
  }
};   

const deleteJobService = async(jobId) => {
  const jobDel = await jobModel.findByIdAndDelete(jobId);
  return { status: 200, success: true, message: 'Job Deleted Successfully' };
};

const getJobsByUserService = async(userId, query) => {
  let { page = 1, limit = 10, search } = query;

  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;
  let filter = { createdBy: userId, isDeleted: false };

  if(search) {
    filter.$or = [
      { jobTitle: { $regex: search, $options: "i" } },
      { companyName: { $regex: search, $options: "i" } },
      { requiredSkills: { $regex: search, $options: "i" } }
    ];
  }


  const jobs = await jobModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

  const today = new Date();

  const formattedJobs = jobs.map(job => {
    let status = job.status;

    if (job.postValidityDate < today) {
      status = "expired";
    }

    return { ...job.toObject(), status };
  });

  const total = await jobModel.countDocuments(filter);

  return { status: 200, success: true, message: 'Jobs retrieved successfully', data: formattedJobs, page, totalPages: Math.ceil(total / limit), totalJobs: total };
};

const toggleJobLikeService = async(userId, jobId) => {
  const existingLike = await jobLikeModel.findOne({ userId, jobId });

  // UNLIKE
  if (existingLike) {
    await existingLike.deleteOne();

    await jobModel.findByIdAndUpdate(jobId, { $inc: { likesCount: -1 } });

    return { status: 200, success: true, message: "Job unliked", liked: false };
  }

  // LIKE
  await jobLikeModel.create({ jobId, userId });

  await jobModel.findByIdAndUpdate(jobId, { $inc: { likesCount: 1 } });

  return { status: 200, success: true, message: "Job liked", liked: true };
};

const getJobsByLocationService = async(data) => {
   const location = data.location;
   if (!location) return { status: 400, success: false,  message: "Location is required" };
  const jobs = await jobModel.find({ workLocation: { $regex: location, $options: 'i' }, status: "open"}).sort({ likesCount: -1, createdAt: -1 });
   const formattedJobs = jobs.map(job => ({ id: job._id, title: job.jobTitle, company: job.companyName, type: job.jobType, location: job.workLocation, experience: job.experienceLevel, skills: job.requiredSkills, salary: job.salaryRange, likes: job.likesCount, validTill: job.postValidityDate, createdAt: job.createdAt }));

  return { status: 200, success: true, message: "Job Retrived By Location Successfully", location, count: jobs.length, data: formattedJobs };
};

module.exports = { jobCreateService, getAllJobsService, getJobByIdService, updateJobService, deleteJobService, getJobsByUserService, toggleJobLikeService, getJobsByLocationService };