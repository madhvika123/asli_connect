const categoryModel = require('../models/categoryModel');

const createCategoryService = async (data) => {
    const ctgryExt = await categoryModel.findOne({ categoryName: data.categoryName });
    if(ctgryExt)  return { status: 409, success: false, message: 'Category Already Exists' };

    const category = await categoryModel.create({ categoryName: data.categoryName });
    return { status: 200, success: true, message: 'Category Created Successfully', category };
};

const listCategoryService = async (data) => {
    const category = await categoryModel.find();
    return { status: 200, success: true, message: 'Category List Retrived Successfully', totalCount: category.length, category };
};

const updateCategoryService = async (catId,data) => {
    const ctgryExt = await categoryModel.findOne({ categoryName: data.categoryName });
    if(ctgryExt)  return { status: 409, success: false, message: 'Category Already Exists' };

    const category = await categoryModel.findByIdAndUpdate(catId, data, { new: true });
    if (!category) {
    return { status: 404, success: false, message: 'Category not found' };       
    } else {
    return { status: 200, success: true, message: 'Category Updated Successfully', data: category };
    }
};

const deleteCategoryService = async (catId) => {
    const ctgryExt = await categoryModel.findById(catId);
    if(!ctgryExt)  return { status: 409, success: false, message: 'Category not found' };

    const catDel = await categoryModel.findByIdAndDelete(catId);
    return { status: 200, success: true, message: 'Category Deleted Successfully' };
};

module.exports = { createCategoryService, listCategoryService, updateCategoryService, deleteCategoryService };