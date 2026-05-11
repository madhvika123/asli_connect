const productModel = require('../models/productModel');

const productCreateService = async (data, files) => {
  const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

  // thumbnail
  if(!files.productThumbnail || !files.productThumbnail[0]) return { status: 400, success: false, message: 'Thumbnail is required' };
  const thumbnailUrl = `${BASE_URL}/uploads/products/${files.productThumbnail[0].filename}`;

  // product images
  let images = [];
  if(files.productImages && files.productImages.length > 0) {
    images = files?.productImages.map(
      file => `${BASE_URL}/uploads/products/${file.filename}`
    );
  }

  const product = new productModel({ ...data, productThumbnail: thumbnailUrl, productImages: images });
  await product.save();
  
  return { status: 201, success: true, message: 'Product Created Successfully', product };
};

const getProductCategoryService = async () => {
  const products = await productModel.find().populate("category", "categoryName");
  return { status: 200, success: true, message: 'Product Created Successfully', totalCount: products.length, products };
};

const getProductService = async (prdctId) => {
  const products = await productModel.findById(prdctId).populate("category");
  return { status: 200, success: true, message: 'Product Created Successfully', totalCount: products.length, products };
};

const updateProductService = async (prdctId, data, files) => {
  const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

  const exstPrdct = await productModel.findById(prdctId);
  if(!exstPrdct) return { status: 404, success: false, message: "Product Not Found" };

  // thumbnail
  let finalThumbnail = exstPrdct.productThumbnail;
  if(files.productThumbnail && files.productThumbnail.length > 0) {
    finalThumbnail = `${BASE_URL}/uploads/products/${files.productThumbnail[0].filename}`;
  };

  // multiple images
  let newImageUrls = [];
  if(files.productImages && files.productImages.length > 0) {
    newImageUrls = files?.productImages.map((file) => `${BASE_URL}/uploads/products/${file.filename}`);
  };

  let finalImages = exstPrdct.productImages;

  if(String(data.keepOldImages).toLowerCase().trim() === "true") {
    finalImages = [ ...exstPrdct.productImages, ...newImageUrls];
  } else if(String(data.replaceImages).toLowerCase().trim() === "true") {
    finalImages = newImageUrls;
  } else if(newImageUrls.length === 0) {
    finalImages = exstPrdct.productImages;
  }

  if (data.removeImages) {
    const removeList = JSON.parse(data.removeImages); // array of URLs
    finalImages = finalImages.filter((img) => !removeList.includes(img));
  }

  const updatedData =  { ...data, productThumbnail: finalThumbnail, productImages: finalImages };
  const updatedProduct = await productModel.findByIdAndUpdate(prdctId, updatedData, { new: true });
  return { status: 200, success: true, message: 'Product Updated Successfully', updatedProduct };
};

const deleteProductService = async (prdctId) => {
  const product = await productModel.findById(prdctId);
  if (!product) {
    return { status: 404, success: false, message: "Product not found" };
  };

  await productModel.findByIdAndDelete(prdctId);

  return { status: 200, success: true, message: "Product Deleted Successfully" };
}
 
module.exports = { productCreateService, getProductCategoryService, getProductService, updateProductService, deleteProductService };