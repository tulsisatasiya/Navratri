const mongoose = require("mongoose");
const Category = require("../models/category.model");

// Add new category
const addCategory = async (categoryData) => {
  try {
    const category = new Category(categoryData);
    return await category.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all categories
const getAllCategories = async () => {
  return await Category.find();
};

// Get category by ID or name
const getCategoryByIdOrName = async (search) => {
  let query = {};

  if (mongoose.Types.ObjectId.isValid(search)) {
    query._id = search;
  } else {
    query.name = new RegExp(search, "i"); // Case-insensitive search
  }

  return await Category.findOne(query);
};

// Update category details
const updateCategory = async (id, updateData) => {
  return await Category.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete category
const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

module.exports = {
  addCategory,
  getAllCategories,
  getCategoryByIdOrName,
  updateCategory,
  deleteCategory,
};
