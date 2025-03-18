const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    TicketPicture: {
      type: String, 
    //   required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
