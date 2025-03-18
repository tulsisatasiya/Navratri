const Joi = require("joi");

const ticketValidationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(), 
  TicketPicture: Joi.string().allow(""), 
  subCategory: Joi.string().required(), 
  price: Joi.number().min(0).required(), 
});

module.exports = { ticketValidationSchema };
