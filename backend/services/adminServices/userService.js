const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');

const SALT_ROUNDS = 10;

const createUserService = async (data) => {
    const exists = await userModel.findOne({ $or: [{ email: data.email }, { phoneNo: data.phoneNo }] });
    if (exists) {
        return { status: 409, success: false, message: 'User Already Registered' };
    };

    if (!data.password) {
    return { status: 400, success: false, message: "Password is required" };
  }

    const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);
    const admin = await userModel.create({ name: data.name, email: data.email, password: hashed, phoneNo: data.phoneNo, role: data.role, isEmailVerified: true });

    return { status: 201, success: true, message: 'User Created Successfully', data: { id: admin._id, name: admin.name, email: admin.email, phoneNo: admin.phoneNo, role: admin.role } };
};

const getAllUsersService = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    userModel.find({ isDeleted: false }).sort({ createdAt: -1 }).skip(skip).limit(limit).select("-password") .lean(),
    userModel.countDocuments({ isDeleted: false }),
  ]);

  return { status: 200, success: true, message: "Users list fetched successfully", data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};


const updateUserService = async (usrId, data) => {
  const allowedFields = ["name", "email", "phoneNo", "role"];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  const usr = await userModel.findByIdAndUpdate( usrId, { $set: updateData }, { new: true } );

  if (!usr) {
    return { status: 404, success: false, message: "User not found" };
  }

  return { status: 200, success: true, message: "User Updated Successfully", data: usr };
};


const deleteUsrService = async (usrId) => {
    const user = await userModel.findById(usrId);
    if (!user) {
        return { status: 404, success: false, message: "User not found" };
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


module.exports = { createUserService, getAllUsersService, updateUserService, deleteUsrService, userStatusService, updatePasswordService };