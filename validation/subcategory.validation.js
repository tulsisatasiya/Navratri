const Joi = require("joi");

const subCategoryValidationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  category: Joi.string().required(), // ObjectId reference to Category
  // price: Joi.number().min(0).required(),
});

module.exports = { subCategoryValidationSchema };
