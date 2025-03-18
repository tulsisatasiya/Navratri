const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerMiddleware");
const ticketController = require("../controllers/ticket.controller"); // Fix import
const validate = require("../middlewares/validate");
const { ticketValidation } = require("../validation");

router.post("/add", validate(ticketValidation.ticketValidationSchema), upload.single("TicketPicture"), ticketController.addTicket);
// router.post("/add", validate(ticketValidation.ticketValidationSchema), upload, ticketController.addTicket);
router.get("/", ticketController.getAllTickets);
router.get("/:search", ticketController.getTicketByIdOrName);
router.post("/:id", validate(ticketValidation.ticketValidationSchema),ticketController.updateTicket);
router.delete("/:id", ticketController.deleteTicket);

module.exports = router;
