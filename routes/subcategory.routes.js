const express = require("express");
const { subCategoryController } = require("../controllers");
const verifyAdmin = require("../middlewares/verifyAdmin");
const validate = require("../middlewares/validate");
const { subcategoryValidation } = require("../validation");

const router = express.Router();

router.get("/get", subCategoryController.getAllSubCategories);
router.get("/get/:search", subCategoryController.getSubCategoryByIdOrName);

/* Admin Only: Add SubCategory */
router.post("/add", verifyAdmin, validate(subcategoryValidation.subCategoryValidationSchema), subCategoryController.addSubCategory);

/* Admin Only: Update SubCategory */
router.put("/update/:id", verifyAdmin, validate(subcategoryValidation.subCategoryValidationSchema),subCategoryController.updateSubCategory);

/* Admin Only: Delete SubCategory */
router.delete("/delete/:id", verifyAdmin, subCategoryController.deleteSubCategory);

module.exports = router;
