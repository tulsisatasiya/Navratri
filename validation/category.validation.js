const Joi = require("joi");

const categoryValidationSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().optional(),
    price: Joi.number().required(),
  });



module.exports = { categoryValidationSchema };
