const userModel = require('../../models/userModel');

const viewUsrPrflService = async (admnId) => {
    const admin = await userModel.findOne({ _id: admnId, role: "admin" }).select("-password");

    if (!admin) return { status: 404, success: false, message: "Admin not found" };

    return { status: 200, success: true, message: "Admin fetched successfully", admin };
};

const updtUsrPrflService = async (adminId, data) => {
  const updatedUser = await userModel.findByIdAndUpdate(adminId, { $set: { email: data.email, phoneNo: data.phoneNo }}, { new: true, runValidators: true }).select("-password");

  if (!updatedUser) {
    return { status: 404, success: false, message: "User not found" };
  }

  return { status: 200, success: true, message: "Profile updated successfully", admin: updatedUser };
};

module.exports = { viewUsrPrflService, updtUsrPrflService };