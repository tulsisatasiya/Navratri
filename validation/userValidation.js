const Joi = require("joi");

// Define Joi validation schema for user registration
const userValidationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    "string.pattern.base": "Phone number must be 10 digits."
  }),
  role: Joi.string().valid("admin", "user").default("user"),
  city: Joi.string().min(2).max(100),
  password: Joi.string().min(6).required(),
  profilePic: Joi.string().optional(),
});



module.exports = { userValidationSchema };
