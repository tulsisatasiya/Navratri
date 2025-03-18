const { categoryService } = require("../services");

/* Add Category */
const addCategory = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Check if category already exists
    const categoryExist = await categoryService.getCategoryByIdOrName(name);
    if (categoryExist) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    // Create new category
    const newCategory = { name, description, price };
    const category = await categoryService.addCategory(newCategory);

    return res.status(201).json({ success: true, message: "Category added successfully", category });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

/* Get All Categories */
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json({ success: true, categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* Get Category by ID or Name */
const getCategoryByIdOrName = async (req, res) => {
  try {
    const { search } = req.params;

    const category = await categoryService.getCategoryByIdOrName(search);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({ success: true, category });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* Update Category */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCategory = await categoryService.updateCategory(id, updateData);

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({ success: true, message: "Category updated successfully", category: updatedCategory });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* Delete Category */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await categoryService.deleteCategory(id);
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addCategory, getAllCategories, getCategoryByIdOrName, updateCategory, deleteCategory };
