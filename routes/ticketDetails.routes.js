const express = require("express");
const Ticket = require("../models/ticket.model");
const SubCategory = require("../models/subcategory.model");
const Category = require("../models/category.model");

const router = express.Router();

// ✅ Get detailed ticket information
router.get("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate({
        path: "subCategory",
        populate: { path: "category" }, // Populate Category inside SubCategory
      });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Creating detailed response
    const ticketDetails = {
      _id: ticket._id,
      name: ticket.name,
      ticketPicture: ticket.ticketPicture,
      price: ticket.price,
      eventDate: ticket.eventDate,
      location: ticket.location,
      availableSeats: ticket.availableSeats,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      subCategory: {
        _id: ticket.subCategory._id,
        name: ticket.subCategory.name,
        category: {
          _id: ticket.subCategory.category._id,
          name: ticket.subCategory.category.name,
          description: ticket.subCategory.category.description,
        },
      },
    };

    res.status(200).json(ticketDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
