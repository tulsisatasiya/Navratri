const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user.modal"); 

// Get user by email or phone
const getUserByEmailOrPhone = async (email, phone) => {
  return await User.findOne({ $or: [{ email }, { phone }] });
};

// Get user by email
const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Add new user
const addUser = async (userData) => {
  try {
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all users
const getAllUsers = async () => {
  return await User.find();
};

// Find user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};



const getUserByIdOrName = async (search) => {
  let query = {};

  if (mongoose.Types.ObjectId.isValid(search)) {
    query._id = search;
  } else {
    query.name = new RegExp(search, "i"); 
  }

  return await User.findOne(query);
};



/* Update user details */
const updateUser = async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  };
  
  /* Delete user */
  const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
  };

module.exports = {
  getUserByEmailOrPhone,
  getUserByEmail,
  addUser,
  getAllUsers,
  findUserByEmail,
  getUserByIdOrName,
  updateUser,
  deleteUser,
};
