const { subCategoryService } = require("../services");

/* Add SubCategory */
const addSubCategory = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    // Check if subcategory already exists
    const subCategoryExist = await subCategoryService.getSubCategoryByIdOrName(name);
    if (subCategoryExist) {
      return res.status(400).json({ success: false, message: "SubCategory already exists" });
    }

    // Create new subcategory
    const newSubCategory = { name, category, price };
    const subCategory = await subCategoryService.addSubCategory(newSubCategory);
    // console.log(subCategory);
    

    return res.status(201).json({ success: true, message: "SubCategory added successfully", subCategory });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};



/* Get All SubCategories with Pagination & Sorting */
const getAllSubCategories = async (req, res) => {
    try {
        let { page, limit, sort } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        sort = sort || "name"; // Default sorting by name

        const result = await subCategoryService.getAllSubCategories(page, limit, sort);
        return res.status(200).json({ success: true, ...result });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};


  
/* Get SubCategory by ID or Name price*/
const getSubCategoryByIdOrName = async (req, res) => {
  try {
    const { search } = req.params;

    const subCategory = await subCategoryService.getSubCategoryByIdOrName(search);
    if (!subCategory) {
      return res.status(404).json({ success: false, message: "SubCategory not found" });
    }

    return res.status(200).json({ success: true, subCategory });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


//filter
const getAllSubCategoriesfilter = async (req, res) => {
    try {
        const { price } = req.query;
        const priceFilter = price && !isNaN(price) ? Number(price) : undefined;

        // Fetch subcategories with the price filter
        const subCategories = await subCategoryService.getAllSubCategoriesfilter(priceFilter);

        return res.status(200).json({ success: true, subCategories });
    } catch (err) {
        console.error("Error:", err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
};


/* Update SubCategory */
const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedSubCategory = await subCategoryService.updateSubCategory(id, updateData);

    if (!updatedSubCategory) {
      return res.status(404).json({ success: false, message: "SubCategory not found" });
    }

    return res.status(200).json({ success: true, message: "SubCategory updated successfully", subCategory: updatedSubCategory });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* Delete SubCategory */
const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSubCategory = await subCategoryService.deleteSubCategory(id);
    if (!deletedSubCategory) {
      return res.status(404).json({ success: false, message: "SubCategory not found" });
    }

    return res.status(200).json({ success: true, message: "SubCategory deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addSubCategory, getAllSubCategories, getSubCategoryByIdOrName,getAllSubCategoriesfilter, updateSubCategory, deleteSubCategory };
