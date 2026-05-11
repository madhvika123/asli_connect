const express = require('express');
const router = express.Router();
const { productCreateController, getProductCategoryController, getProductController, updateProductController, deleteProductController } = require('../controllers/productController');
const authMiddleware = require("../middleware/authMiddleware");
const upload = require('../middleware/ProductUpload');

// routes
// CREATE CATEGORY || POST - Upload up to 5 images
router.post('/create-category',  upload.fields([ { name: "productThumbnail", maxCount: 1 }, { name: "productImages", maxCount: 10 } ]), authMiddleware, productCreateController);

// GET ALL PRODUCTS WITH CATEGORY NAME || GET
router.get('/get-category-product', authMiddleware, getProductCategoryController);

// GET PRODUCT BY ID || GET
router.get('/get-product/:id', authMiddleware, getProductController);

// UPDATE PRODUCT || PUT
router.put('/update-product/:id', upload.fields([ { name: "productThumbnail", maxCount: 1 }, { name: "productImages", maxCount: 10 } ]), authMiddleware, updateProductController);

// DELETE PRODUCT || DELETE
router.delete('/delete-product/:id', authMiddleware, deleteProductController);

module.exports = router;