const verifyService = require("../services/verify.services");

const verifyHash = async (req, res) => {
  try {
    const { bookingId, hashNumber } = req.body;
    console.log("bookingId", bookingId);
    console.log("hashNumber", hashNumber);
    

    if (!bookingId || !hashNumber) {
      return res.status(400).json({ success: false, message: "Booking ID and Hash Number are required" });
    }

    const result = await verifyService.verifyHashNumber(bookingId, hashNumber);

    return res.status(200).json({
      success: true,
      message: result.message,
      qrCode: result.qrCode, // Return QR Code
      booking: result.booking,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getCompletedBookings = async (req, res) => {
  try {
    const completedBookings = await verifyService.getCompletedBookings();
    res.status(200).json({ success: true, bookings: completedBookings });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = { verifyHash,getCompletedBookings };
