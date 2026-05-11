const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const { profileViewController, updateUserProfileController } = require('../../controllers/adminController/profileController');

const router = express.Router();

// routes
// Profile Details || GET
router.get("/view/:id", authMiddleware, profileViewController);

// UPDATE USER PROFILE DATA || PUT
router.put("/update/:id", authMiddleware, updateUserProfileController);

module.exports = router;