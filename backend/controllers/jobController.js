const logger = require('../utils/logger');
const { jobCreateValidation, jobUpdateValidation } = require('../validations/jobValidation');
const { jobCreateService, getAllJobsService, getJobByIdService, updateJobService, deleteJobService, getJobsByUserService, toggleJobLikeService, getJobsByLocationService } = require('../services/jobServices');

const jobCreateController = async (req, res) => {
  const  jobData = { ...req.body, createdBy: req.user.id };
  const jobCrtVal = jobCreateValidation(jobData);
    if (jobCrtVal.success) {
      try {
        const jbCrt = await jobCreateService(jobData, req.user.id, { ip: req.ip, userAgent: req.headers["user-agent"] });
        res.status(jbCrt.status).json(jbCrt);
      }
      catch (err) {
        logger.error('Error in Job Create API');
        return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
      }
    } else return res.status(400).send({ success: false, message: jobCrtVal.message });
};

const getAllJobsController = async (req, res) => {
 try {
    const jobLists = await getAllJobsService(req.query);
    res.status(jobLists.status).json(jobLists);
  }
  catch (err) {
    logger.error('Error in All Jobs List', err);
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const getSingleJobController = async (req, res) => {
 try {
    const jbLst = await getJobByIdService(req.params.id);
    res.status(jbLst.status).json(jbLst);
  }
  catch (err) {
    logger.error('Error in Single Job List', err);
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const updateJobController = async (req, res) => {
   const jobUpdtVal = jobUpdateValidation(req.body);
  if (jobUpdtVal.success) {
    try {
      const jbUpdt = await updateJobService(req.params.id, req.body);
      res.status(jbUpdt.status).json(jbUpdt);
    }
    catch (err) {
      logger.error('Error in Job Update API');
      return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
    }
  } else return res.status(400).send({ success: false, message: jobUpdtVal.message });
};

const deleteJobController = async (req, res) => {
  try {
     const jbDel = await deleteJobService(req.params.id);   
     res.status(jbDel.status).json(jbDel);
    } 
  catch (err) {
    logger.error('Error in Delete API', err);
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const getJobsByUserController = async (req, res) => {
  try {
    const jbByUsrId = await getJobsByUserService(req.params.userId, req.query);
    res.status(jbByUsrId.status).json(jbByUsrId);
  } catch (error) {
    logger.error('Error in Jobs By User API', error);
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

const toggleJobLikeController = async(req, res) => {
  try {
    const jobLk = await toggleJobLikeService(req.user.id, req.params.jobId);
    res.status(jobLk.status).json(jobLk);
  } catch (error) {
     logger.error('Error in Job Likes API', error);
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

const getJobsByLocationController = async(req, res) => {
  try {
    const jobLoc = await getJobsByLocationService(req.body);
    res.status(jobLoc.status).json(jobLoc);
  } catch (error) {
     logger.error('Error in Job By Location API', error);
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

module.exports = { jobCreateController, getAllJobsController, getSingleJobController, updateJobController, deleteJobController, getJobsByUserController, toggleJobLikeController, getJobsByLocationController };