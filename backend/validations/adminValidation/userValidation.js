const userCreateValidation = (body) => {
  const { name, email, password, phoneNo, role } = body;
  if (!name || !email || !password || !phoneNo || !role ) {
    return { status: 400, success: false, message: 'Please provide required fields' };
  } else {
    return { success: true };
  }
};

const userUpdateValidation = (body) => {
  const { name, email, phoneNo, role } = body;
  if (!name || !email || !phoneNo || !role ) {
    return { status: 400, success: false, message: 'Please provide required fields' };
  } else {
    return { success: true };
  }
};

const updatePasswordValidation = (body) => {
  const { newPassword } = body;
  
  if (!newPassword) return { status: 400, success: false, message: "Old password and new password are required" };
  if (newPassword.length < 8) return { status: 400, success: false, message: "Password must be at least 8 characters" };

  return { success: true };
};


module.exports = { userCreateValidation, userUpdateValidation, updatePasswordValidation };