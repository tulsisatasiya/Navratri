const express = require("express");
const router = express.Router();
const verifyController = require("../controllers/verify.controller");

// POST request to verify hash number
router.post("/verify-hash", verifyController.verifyHash);

router.get("/completed-bookings", verifyController.getCompletedBookings);

module.exports = router;
