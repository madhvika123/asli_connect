const logger = require('../utils/logger');
const { createValidation } = require('../validations/productValidation');
const { productCreateService, getProductCategoryService, getProductService, updateProductService, deleteProductService } = require('../services/productService');

const productCreateController = async (req, res) => {
  const prdctVal = createValidation(req.body);
  if (prdctVal.success) {
    try {
      const catgry = await productCreateService(req.body, req.files);
      res.status(catgry.status).json(catgry);
    } catch (err) {
      logger.error('Error in Product Created API');
      return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
    }
  } else return res.status(400).send({ success: false, message: prdctVal.message });
};

const getProductCategoryController = async (req, res) => {
    try {
      const catgry = await getProductCategoryService(req.body, req.files);
      res.status(catgry.status).json(catgry);
    } catch (err) {
      logger.error('Error in Product Category List API');
      return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

const getProductController = async (req, res) => {
    try {
      const catgry = await getProductService(req.params.id);
      res.status(catgry.status).json(catgry);
    } catch (err) {
      logger.error('Error in Product List API');
      return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

const updateProductController = async (req, res) => {
  try {
    const catgry = await updateProductService(req.params.id, req.body, req.files);
    res.status(catgry.status).json(catgry);
  } catch (err) {
    logger.error('Error in Product Updated API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const catgry = await deleteProductService(req.params.id);
    res.status(catgry.status).json(catgry);
  } catch (err) {
    logger.error('Error in Product Deleted API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

module.exports = { productCreateController, getProductCategoryController, getProductController, updateProductController, deleteProductController };