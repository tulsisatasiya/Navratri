const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
const Booking = require("../models/booking.model");  
const Ticket = require("../models/ticket.model");
const User = require("../models/user.modal");
const Verify = require("../models/verify.model");
const crypto = require("crypto");


const generateHashNumber = async (bookingId) => {
  try {
    
    const hash = crypto.createHash("sha256");
    hash.update(bookingId.toString());
    
   
    const hashNumber = hash.digest("hex");
    return hashNumber;
  } catch (error) {
    throw new Error("Error generating hash number: " + error.message);
  }
};

// Create a new booking
const createBooking = async (userId, ticketId, quantity) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("Invalid User ID");
    if (!mongoose.Types.ObjectId.isValid(ticketId)) throw new Error("Invalid Ticket ID");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const ticket = await Ticket.findById(ticketId).select("price name");
    if (!ticket) throw new Error("Ticket not found");

    if (!quantity || quantity <= 0) throw new Error("Invalid quantity");

    const totalPrice = ticket.price * quantity;

    // Use Booking instead of bookingSchema
    const newBooking = new Booking({
      user: userId,
      ticket: ticketId,
      quantity,
      totalPrice,
    });

    const savedBooking = await newBooking.save();

    const hashedNumber = await generateHashNumber(savedBooking._id);
    savedBooking.hashNumber = hashedNumber;
    await savedBooking.save();

    const newVerify = new Verify({
      booking: savedBooking._id,
      hashNumber: hashedNumber,
      qrCode: `QR-${hashedNumber.substring(0, 10)}`,
    });

    await newVerify.save();

    return savedBooking;
  } catch (error) {
    console.error("Booking error:", error.message);
    throw new Error(error.message);
  }
};

const getAllBookings = async () => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("ticket", "name price");
    return bookings;
  } catch (error) {
    throw new Error("Error fetching bookings: " + error.message);
  }
};


const getBookingById = async (bookingId) => {
  try {
    if (!bookingId) throw new Error("Booking ID is required");
    console.log(bookingId);
    
    if (!mongoose.Types.ObjectId.isValid(bookingId)) throw new Error("Invalid Booking ID format");
    if (mongoose.connection.readyState !== 1) throw new Error("Database not connected");

    const booking = await Booking.findById(bookingId)
      .populate("user", "name email")
      .populate("ticket", "name price");

    if (!booking) throw new Error("Booking not found");

    return booking;
  } catch (error) {
    throw new Error("Error fetching booking: " + error.message);
  }
};

const getUserTicketCountService = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid User ID format");
  }

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

  return { userId, totalTicketCount, tickets: userTickets };
};


module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  getUserTicketCountService,

};
