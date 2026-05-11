const logger = require('../utils/logger');
const { jobApplicationService } = require('../services/jobApplicationService');
const { jbAplctnValidation } = require('../validations/jobApplicationValidation');

const jobApplicationController = async (req, res) => {
  console.log("=======req===", req);
  const aplctnData = { ...req.body, appliedBy: req.user.id };
  try {
    const jbAplctnVal = jbAplctnValidation(aplctnData);
    if (!jbAplctnVal.success) {
      return res.status(400).send({ success: false, message: jbAplctnVal.message });
    }
    
    const aplctnRes = await jobApplicationService(aplctnData);
    res.status(aplctnRes.status).json(aplctnRes);
  } catch (err) {
    logger.error('Error in Job Application API', err);
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

module.exports = jobApplicationController;
