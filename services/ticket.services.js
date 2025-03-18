const mongoose = require("mongoose");
const Ticket = require("../models/ticket.model");

// Add new ticket
const addTicket = async (ticketData) => {
    try {
      const ticket = new Ticket(ticketData);
      return await ticket.save();
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  // Find ticket by name
  const findTicketByName = async (name) => {
    return await Ticket.findOne({ name });
  };
  
  
// Get all tickets
// const getAllTickets = async () => {
//   return await Ticket.find().populate({
//     path: "subCategory",
//     populate: {
//       path: "category",
//     },
//   });
// };
const getAllTickets = async () => {
  return await Ticket.find().populate({
    path: "subCategory",
    select: "name", // Only fetch the name field from subCategory
    populate: {
      path: "category",
      select: "name", // Only fetch the name field from category
    },
  });
};


// Get ticket by ID or name
const getTicketByIdOrName = async (search) => {
  let query = {};

  if (mongoose.Types.ObjectId.isValid(search)) {
    query._id = search;
  } else {
    query.name = new RegExp(search, "i");
  }

  return await Ticket.findOne(query).populate({
    path: "subCategory",
    populate: {
      path: "category",
    },
  });
};

// Update ticket details
const updateTicket = async (id, updateData) => {
  const updatedTicket = await Ticket.findByIdAndUpdate(id, updateData, { new: true }).populate("subCategory");
  console.log(updatedTicket); 
  return updatedTicket;
};




// Delete ticket
const deleteTicket = async (id) => {
  return await Ticket.findByIdAndDelete(id);
};

module.exports = {
  addTicket,
  getAllTickets,
  findTicketByName,
  updateTicket,
  getTicketByIdOrName,
  deleteTicket,
};
