const express = require('express');
const router = express.Router();
const { createCategoryController, listCategoryController, updateCategoryController, deleteCategoryController } = require('../controllers/categoryController');
const authMiddleware = require("../middleware/authMiddleware");

// routes
// CREATE CATEGORY || POST
router.post('/create-category', authMiddleware, createCategoryController);

// LIST CATEGORY || GET
router.get('/get-category', authMiddleware, listCategoryController);

// UPDATE CATEGORY || PUT
router.put('/update-category/:id', authMiddleware, updateCategoryController);

// DELETE CATEGORY || DELETE
router.delete('/delete-category/:id', authMiddleware, deleteCategoryController);

module.exports = router;