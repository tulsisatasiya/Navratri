const Joi = require("joi");

const eventValidationSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    price: Joi.number().required(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    description: Joi.string().required().trim(),
    images: Joi.array().items(Joi.string().uri()).optional()
});

module.exports = { eventValidationSchema };
