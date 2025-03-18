const mongoose = require("mongoose");
const Booking = require("../models/booking.model");
const bookingService = require("../services/booking.services");

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { userId, ticketId, quantity } = req.body;
    const booking = await bookingService.createBooking(userId, ticketId, quantity);
    
    res.status(201).json({ success: true, message: "Booking created successfully", booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get booking by ID
// const getBookingById = async (req, res) => {
//   try {
//     console.log("Request params:", req.params); // Debugging
//     const { id } = req.params;

//     if (!id) throw new Error("Booking ID is required");

//     const booking = await bookingService.getBookingById(id);
//     res.status(200).json({ success: true, booking });
//   } catch (error) {
//     res.status(404).json({ success: false, message: error.message });
//   }
// };
const getBookingById = async (req, res) => {
  try {
    console.log("Request params:", req.params); // Debugging
    const { id } = req.params;

    // Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Booking ID format" });
    }

    // Fetch the booking
    const booking = await bookingService.getBookingById(id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Update booking status
// const updateBookingStatus = async (req, res) => {
//   try {
//     const { bookingId } = req.params;
//     const { status } = req.body;
//     const updatedBooking = await bookingService.updateBookingStatus(bookingId, status);
//     res.status(200).json({ success: true, message: "Booking status updated", updatedBooking });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// Delete booking
// const deleteBooking = async (req, res) => {
//   try {
//     const { bookingId } = req.params;
//     await bookingService.deleteBooking(bookingId);
//     res.status(200).json({ success: true, message: "Booking deleted successfully" });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// Get all tickets
const getAllTickets = async (req, res) => {
  try {
    
    
    const tickets = await bookingService.getAllBookings();

    res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get user ticket count
// const getUserTicketCount = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ success: false, message: "Invalid User ID format" });
//     }

//     console.log("User ID:", userId);

//     const userTickets = await Booking.aggregate([
//       { $match: { user: new mongoose.Types.ObjectId(userId) } }, // Filter by user ID
//       {
//         $lookup: {
//           from: "tickets", // Ticket collection name
//           localField: "ticket",
//           foreignField: "_id",
//           as: "ticketDetails",
//         },
//       },
//       { $unwind: "$ticketDetails" }, // Convert array to object
//       {
//         $group: {
//           _id: "$ticketDetails._id",
//           ticketName: { $first: "$ticketDetails.name" },
//           totalTickets: { $sum: "$quantity" },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           ticketId: "$_id",
//           ticketName: 1,
//           totalTickets: 1,
//         },
//       },
//     ]);

//     res.status(200).json({
//       success: true,
//       userId,
//       tickets: userTickets,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const getUserTicketCount = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }

    console.log("User ID:", userId);

    const userTickets = await Booking.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } }, 
      {
        $lookup: {
          from: "tickets",
          localField: "ticket",
          foreignField: "_id",
          as: "ticketDetails",
        },
      },
      { $unwind: "$ticketDetails" }, 
      {
        $group: {
          _id: "$ticketDetails._id",
          ticketName: { $first: "$ticketDetails.name" },
          totalTickets: { $sum: "$quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          ticketId: "$_id",
          ticketName: 1,
          totalTickets: 1,
        },
      },
    ]);

   
    const totalTicketCount = userTickets.reduce((sum, ticket) => sum + ticket.totalTickets, 0);

    res.status(200).json({
      success: true,
      userId,
      totalTicketCount, 
      tickets: userTickets, 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTicketSalesById = async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ success: false, message: "Invalid Ticket ID format" });
    }

    const ticketSales = await Booking.aggregate([
      { $match: { ticket: new mongoose.Types.ObjectId(ticketId) } },
      
      // Lookup Ticket Details
      {
        $lookup: {
          from: "tickets",
          localField: "ticket",
          foreignField: "_id",
          as: "ticketDetails",
        },
      },
      { $unwind: "$ticketDetails" },

      // Lookup User Details
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },

      // Group by User
      {
        $group: {
          _id: "$userDetails._id",
          userName: { $first: "$userDetails.name" },
          userEmail: { $first: "$userDetails.email" },
          totalTicketsBought: { $sum: "$quantity" },
          ticketName: { $first: "$ticketDetails.name" },
          ticketPrice: { $first: "$ticketDetails.price" },
        },
      },

      // Final Projection
      {
        $project: {
          _id: 0,
          userId: "$_id",
          userName: 1,
          userEmail: 1,
          totalTicketsBought: 1,
          ticketName: 1,
          ticketPrice: 1,
        },
      },
    ]);

    // Calculate Total Tickets Sold
    const totalTicketsSold = ticketSales.reduce((sum, ticket) => sum + ticket.totalTicketsBought, 0);

    // Get Ticket Name & Price 
    const ticketName = ticketSales.length > 0 ? ticketSales[0].ticketName : "N/A";
    const ticketPrice = ticketSales.length > 0 ? ticketSales[0].ticketPrice : 0;

    res.status(200).json({
      success: true,
      message: totalTicketsSold > 0 
    ? `A total of ${totalTicketsSold} tickets have been purchased for ${ticketName}.`
    : "No tickets have been purchased yet.",
      ticketId,
      ticketName,
      ticketPrice,
      totalTicketsSold,
      users: ticketSales,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ success: false, message: "Invalid Booking ID format" });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Check if the booking is already cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Booking is already cancelled" });
    }

    // Update status to "cancelled"
    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ success: true, message: "Booking cancelled successfully", booking });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  // updateBookingStatus,
  // deleteBooking,
  getAllTickets,
  getUserTicketCount,
  getTicketSalesById,
  cancelBooking,

  
};
