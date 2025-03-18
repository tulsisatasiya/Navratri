const mongoose = require("mongoose");

const verifySchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    hashNumber: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false, 
    },
    qrCode: {
      type: String, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Verify", verifySchema);
