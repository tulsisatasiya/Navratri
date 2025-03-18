const crypto = require("crypto");
const Verify = require("../models/verify.model");
const Booking = require("../models/booking.model");
const QRCode = require("qrcode");

const generateHashNumber = (bookingId) => {
  // Create a hash using the 'sha256' algorithm
  const hash = crypto.createHash("sha256");
  hash.update(bookingId.toString());
  return hash.digest("hex");
};

const verifyHashNumber = async (bookingId, hashNumber) => {
  try {
    if (!bookingId || !hashNumber) {
      throw new Error("Booking ID and Hash Number are required");
    }

    // Find the verify entry by booking ID
    const verifyEntry = await Verify.findOne({ booking: bookingId });
    console.log("verifyEntry:", verifyEntry); // Log verifyEntry for debugging

    if (!verifyEntry) {
      throw new Error("Invalid booking ID or hash number");
    }

    // Ensure that hashNumber exists in the verify entry
    if (!verifyEntry.hashNumber) {
      throw new Error("Hash number not found for the given booking ID");
    }

    console.log("verifyEntry.hashNumber:", verifyEntry.hashNumber);

    // Compare provided hash with stored hash (using crypto)
    const providedHash = generateHashNumber(bookingId);  // Generate hash for the bookingId
    if (providedHash !== verifyEntry.hashNumber) {
      throw new Error("Invalid hash number");
    }

    if (verifyEntry.verified) {
      throw new Error("This hash number is already verified");
    }

    // Update booking status to "confirmed"
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "confirmed" },
      { new: true }
    );

    if (!updatedBooking) {
      throw new Error("Booking not found");
    }

    const formattedTotalAmount = updatedBooking.totalAmount
    ? parseFloat(updatedBooking.totalAmount).toFixed(2)
    : 'N/A'; // Format to 2 decimal places
  
  const qrCodeData = JSON.stringify({
    bookingId: updatedBooking._id ? updatedBooking._id.toString() : 'N/A',
    userId: updatedBooking.user ? updatedBooking.user.toString() : 'N/A',
    ticketId: updatedBooking.ticket ? updatedBooking.ticket.toString() : 'N/A',
    quantity: updatedBooking.quantity || 0,
    status: updatedBooking.status || 'Unknown',
    hashNumber: verifyEntry.hashNumber || 'No hash',
  });
  

    // Generate QR Code as Base64
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    // Save QR Code in Verify Schema
    verifyEntry.verified = true;
    verifyEntry.qrCode = qrCodeImage;
    await verifyEntry.save();

    return { message: "Booking confirmed successfully", qrCode: qrCodeImage, booking: updatedBooking };
  } catch (error) {
    throw new Error(error.message);
  }
};
const getCompletedBookings = async () => {
  try {
    // Fetch all confirmed bookings with user & ticket details
    const completedBookings = await Booking.find({ status: "confirmed" })
      .populate("user", "name email")
      .populate("ticket", "name price");

    if (!completedBookings || completedBookings.length === 0) {
      throw new Error("No completed bookings found");
    }

    return completedBookings;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { verifyHashNumber ,getCompletedBookings};
