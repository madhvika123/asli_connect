const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');

const SALT_ROUNDS = 10;

const getAllUsersService = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const filter = { isDeleted: false, role: "user" };

  const [users, total] = await Promise.all([
    userModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select("-password").lean(),
    userModel.countDocuments(filter),
  ]);

  return { status: 200, success: true, message: "Users list fetched successfully", data: users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};



const updateUserService = async (usrId, data) => {
  const allowedFields = ["name", "userName", "email", "phoneNo", "profileVisibility"];

  const user = await userModel.findById(usrId);

  if (!user) return { status: 404, success: false, message: "User not found" };

  if (user.role !== "user") return { status: 403, success: false, message: "Only users can be updated" };

  if (user.isDeleted) return { status: 400, success: false, message: "Deleted user cannot be updated" };

  const updateData = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  const updatedUser = await userModel.findByIdAndUpdate( usrId, { $set: updateData }, { new: true } );

  return { status: 200, success: true, message: "User updated successfully", data: updatedUser };
};



const deleteUsrService = async (usrId) => {
    const user = await userModel.findById(usrId);
    if (!user) {
        return { status: 404, success: false, message: "User not found" };
    }

    if (user.role !== "user") {
      return { status: 403, success: false, message: "Status update allowed only for users" };
    }

     if (user.isDeleted) {
      return { status: 400, success: false, message: "User is already deactivated" };
    }

    user.isDeleted = true;
    user.status = "INACTIVE";
    await user.save();

    return { status: 200, success: true, message: "User deactivated successfully" };
};


const userStatusService = async (usrId, status) => {
    const user = await userModel.findById(usrId);
    if (!user) {
        return { status: 404, success: false, message: "User not found" };
    }

    if (user.isDeleted) {
        return { status: 400, success: false, message: "Deleted user cannot be updated" };
    }

    if (user.role !== "user") {
      return { status: 403, success: false, message: "Status update allowed only for users" };
    }

    user.status = status;
    await user.save();

    return { status: 200, success: true, message: `User status updated to ${status}` };
};

const updatePasswordService = async (userId, newPassword) => {
  const user = await userModel.findById(userId);

  if (!user) return { status: 404, success: false, message: "User not found" };

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);

  user.password = hashed;
  await user.save();

  return { status: 200, success: true, message: "Password updated successfully" };
};


module.exports = { getAllUsersService, updateUserService, deleteUsrService, userStatusService, updatePasswordService };