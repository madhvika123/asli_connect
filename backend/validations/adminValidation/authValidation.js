const adminRegisterValidation = (body) => {
  const { name, email, password, phoneNo } = body;
  if (!name || !email || !password || !phoneNo ) {
    return { status: 400, success: false, message: 'Please provide required fields' };
  } else {
    return { success: true };
  }
};

const adminLoginValidation = (body) => {
    const { email, password } = body;
    if(!email || !password) { 
        return { status: 400, success: false, message: 'PLease provide required fields' };
    } else {
       return { success: true }; 
    }
};

module.exports = { adminRegisterValidation, adminLoginValidation };