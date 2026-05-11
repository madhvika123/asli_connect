const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const { userCreateController, userListController, userUpdateController, userDeleteController, userStatusUpdateController, updatePasswordController } = require('../../controllers/adminController/userController');

const router = express.Router();

// routes
// User Create || POST
router.post("/create", authMiddleware, userCreateController);

// User List || GET
router.get("/lists", authMiddleware, userListController);

// User Update || PUT
router.put('/update/:id', authMiddleware, userUpdateController);

// User Delete || DELETE
router.delete('/delete/:id', authMiddleware, userDeleteController);

// User Status Update || PATCH
router.patch('/status-update/:id', authMiddleware, userStatusUpdateController);

// User Password Change || PATCH
router.patch("/update-password", authMiddleware, updatePasswordController);

module.exports = router;