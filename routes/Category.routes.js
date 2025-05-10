const express = require("express");
const { categoryController } = require("../controllers");
const verifyAdmin = require("../middlewares/verifyAdmin");
const validate = require("../middlewares/validate");
const { categoryValidation } = require("../validation");

const router = express.Router();

/* User & Admin: Get All Categories */
router.get("/get", categoryController.getAllCategories);
router.get("/get/:search", categoryController.getCategoryByIdOrName);

/* Admin Only: Add Category */
router.post("/add", verifyAdmin,validate(categoryValidation.categoryValidationSchema), categoryController.addCategory);

/*  Admin Only: Update Category */
router.put("/update/:id", verifyAdmin, validate(categoryValidation.categoryValidationSchema),categoryController.updateCategory);

/* Admin Only: Delete Category */
router.delete("/delete/:id", verifyAdmin, categoryController.deleteCategory);

module.exports = router;
