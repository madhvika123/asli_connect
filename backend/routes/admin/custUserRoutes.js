const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const { userListController, userUpdateController, userDeleteController, userStatusUpdateController, updatePasswordController } = require('../../controllers/adminController/custUserController');

const router = express.Router();

// routes
// User List || GET
router.get("/lists", authMiddleware, userListController);

// // Block User || PATCH
// router.patch('/block-user/:id', authMiddleware, )
// User Update || PUT
router.put('/update/:id', authMiddleware, userUpdateController);

// User Delete || DELETE
router.delete('/delete/:id', authMiddleware, userDeleteController);

// User Status Update || PATCH
router.patch('/status-update/:id', authMiddleware, userStatusUpdateController);

// User Password Change || PATCH
router.patch("/update-password", authMiddleware, updatePasswordController);

module.exports = router;