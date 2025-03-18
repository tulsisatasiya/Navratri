const express = require("express");
const BookingController = require("../controllers/booking.controller");
const ExcelController = require("../controllers/Excel.controller");
const verifyUser = require("../middlewares/verifyUser");
const verifyAdmin = require("../middlewares/verifyAdmin");


const router = express.Router();

//booking
router.post("/book", verifyUser, BookingController.createBooking);

//get
router.get("/", verifyAdmin,BookingController.getAllBookings);
// router.get("/", BookingController.getAllBookings);

router.get("/downloadExcel", verifyAdmin,ExcelController.exportBookingsToExcel);


router.get("/:id", verifyAdmin, BookingController.getBookingById);

router.get("/user/:userId/tickets", BookingController.getUserTicketCount);

router.get("/ticket-sales/:ticketId", BookingController.getTicketSalesById);

router.put("/cancel/:bookingId", BookingController.cancelBooking);




module.exports = router;

