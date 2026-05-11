const userUpdateValidation = (body) => {
  const { name, userName, email, phoneNo, profileVisibility } = body;
  if (!name || !userName || !email || !phoneNo || !profileVisibility ) {
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


module.exports = { userUpdateValidation, updatePasswordValidation };