const express = require('express');
const { jobCreateController, getAllJobsController, getSingleJobController, updateJobController, deleteJobController, getJobsByUserController, toggleJobLikeController, getJobsByLocationController } = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// routes
// CREATE JOB || POST
router.post('/create', authMiddleware, jobCreateController);

// JOB LIST || GET ALL JOBS
router.get('/lists',  authMiddleware, getAllJobsController);

// JOB LIST || GET JOB BY ID
router.get('/details/:id', authMiddleware, getSingleJobController);

// JOB UPDATE || PUT
router.put('/update/:id', authMiddleware, updateJobController);

// DELETE JOB || DELETE
router.delete('/delete/:id', authMiddleware, deleteJobController);

// GET JOB BY USER ID || GET
router.get('/by-user/:userId', authMiddleware, getJobsByUserController);

// JOB POST LIKE || POST
router.post("/like-unlike/:jobId", authMiddleware, toggleJobLikeController);

// JOB BY LOCATION
router.get('/location', authMiddleware, getJobsByLocationController);

module.exports = router;