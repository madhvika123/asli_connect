const createValidation = (body) => {
   const { categoryName } = body;
   if (!categoryName) {
    return { status: 400, success: false, message: 'Please provide required fields' };
   } else {
    return { success: true };
   }
};

module.exports = { createValidation };