const express = require('express');
const jobApplicationController = require('../controllers/jobApllicationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// routes
// CREATE JOB || POST
router.post('/apply', authMiddleware, jobApplicationController);

module.exports = router;