const logger = require('../utils/logger');
const { createValidation } = require('../validations/categoryValidation');
const { createCategoryService, listCategoryService, updateCategoryService, deleteCategoryService } = require('../services/categoryService');

const createCategoryController = async (req, res) => {
  const catVal = createValidation(req.body);
  if (catVal.success) {
    try {
      const catgry = await createCategoryService(req.body);
      res.status(catgry.status).json(catgry);
    } catch (err) {
      logger.error('Error in Category Created API');
      return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
    }
  } else return res.status(400).send({ success: false, message: catVal.message });
};

const listCategoryController = async (req, res) => {
  try {
    const catgry = await listCategoryService();
    res.status(catgry.status).json(catgry);
  } catch (err) {
    logger.error('Error in Category List API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

const updateCategoryController = async (req, res) => {
  const catVal = createValidation(req.body);
  if (catVal.success) {
    try {
      const catgry = await updateCategoryService(req.params.id, req.body);
      res.status(catgry.status).json(catgry);
    } catch (err) {
      logger.error('Error in Category Created API');
      return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
    }
  } else return res.status(400).send({ success: false, message: catVal.message });
};

const deleteCategoryController = async (req, res) => {
  try {
    const catgry = await deleteCategoryService(req.params.id);
    res.status(catgry.status).json(catgry);
  } catch (err) {
    logger.error('Error in Category List API');
    return res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
  }
};

module.exports = { createCategoryController, listCategoryController, updateCategoryController, deleteCategoryController };

