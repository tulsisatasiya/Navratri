const mongoose = require("mongoose");
const SubCategory = require("../models/subcategory.model");

// Add new subcategory
const addSubCategory = async (subCategoryData) => {
  try {
    const subCategory = new SubCategory(subCategoryData);
    return await subCategory.save();
  } catch (error) {
    throw new Error(error.message);
  }
};


const getAllSubCategories = async (page, limit, sort) => {
    try {
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        // Sorting logic
        let sortOption = {};
        if (sort) {
            sortOption[sort] = 1; // 1 for ascending order
        }

        // Fetch paginated subcategories
        const subCategories = await SubCategory.find()
            .populate("category", "name description")
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        // Get total count
        const totalSubCategories = await SubCategory.countDocuments();

        return {
            totalSubCategories,
            totalPages: Math.ceil(totalSubCategories / limit),
            currentPage: page,
            nextPage: page < Math.ceil(totalSubCategories / limit) ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            subCategories,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

  
// Get subcategory by ID or name
const getSubCategoryByIdOrName = async (search) => {
  let query = {};

  if (mongoose.Types.ObjectId.isValid(search)) {
    query._id = search;
  } else {
    query.name = new RegExp(search, "i"); 
  }

  return await SubCategory.findOne(query).populate("category");
};

  
//filter
const getAllSubCategoriesfilter = async (price) => {
    let query = {}; 

    
    if (price && !isNaN(price)) {
        query.price = { $lte: Number(price) }; // Filter subcategories with price <= given value
    }

    console.log("Generated Query:", query); 

    const results = await SubCategory.find(query).populate("category", "name description");

    console.log("Query Results:", results); 
    return results;
};


// Update subcategory details
const updateSubCategory = async (id, updateData) => {
  return await SubCategory.findByIdAndUpdate(id, updateData, { new: true }).populate("category");
};

// Delete subcategory
const deleteSubCategory = async (id) => {
  return await SubCategory.findByIdAndDelete(id);
};

module.exports = {
  addSubCategory,
  getAllSubCategories,
  getSubCategoryByIdOrName,
  getAllSubCategoriesfilter,
  updateSubCategory,
  deleteSubCategory,
};
