const createValidation = (body) => {
  const { productTitle, description, price } = body;
  if (!productTitle || !description || !price) {
    return { status: 400, success: false, message: 'Please provide required fields' };
   } else {
    return { success: true };
   }
};

module.exports = { createValidation };