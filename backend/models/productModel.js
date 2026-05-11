const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productThumbnail: { type: String, required: true },   // Single thumbnail image
    productImages: [{ type: String, required: true }],   // multiple product images
    productTitle: { type: String, required: true },   // title
    description: { type: String, required: true },   // description
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },   // category id from categoryschema
    price: { type: Number, required: true }   // price
  }, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
