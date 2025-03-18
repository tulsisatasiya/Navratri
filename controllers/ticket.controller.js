const ticketService = require("../services/ticket.services");

/* Add Ticket */
const addTicket = async (req, res) => {
  try {
    console.log("Add Ticket Request Body:", req.body);
    const { name, ticketPicture, subCategory, price } = req.body;

    // Check if ticket already exists
    const existingTicket = await ticketService.findTicketByName(name);
    if (existingTicket) {
      return res.status(400).json({ success: false, message: "Ticket already exists" });
    }

    // Create new ticket
    const newTicket = { name, ticketPicture, subCategory, price };
    console.log(newTicket);
    
    const ticket = await ticketService.addTicket(newTicket);

    console.log(ticket);

    return res.status(201).json({ success: true, message: "Ticket added successfully", ticket });
  
    
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

/* Get All Tickets with Pagination & Sorting */
const getAllTickets = async (req, res) => {
  try {
    let { page, limit, sort } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    sort = sort || "name";

    const result = await ticketService.getAllTickets(page, limit, sort);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* Get Ticket by ID or Name */
const getTicketByIdOrName = async (req, res) => {
  try {
    const { search } = req.params;

    const ticket = await ticketService.getTicketByIdOrName(search);
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    return res.status(200).json({ success: true, ticket });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* Update Ticket */
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTicket = await ticketService.updateTicket(id, updateData);

    if (!updatedTicket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    console.log("Updated Ticket:", updatedTicket); 

    return res.status(200).json({ 
      success: true, 
      message: "Ticket updated successfully", 
      ticket: updatedTicket 
    });

  } catch (error) {
    console.error("Update Ticket Error:", error.message); 
    return res.status(500).json({ success: false, message: error.message });
  }
};


/* Delete Ticket */
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTicket = await ticketService.deleteTicket(id);
    if (!deletedTicket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    return res.status(200).json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addTicket,
  getAllTickets,
  getTicketByIdOrName,
  updateTicket,
  deleteTicket,
};
