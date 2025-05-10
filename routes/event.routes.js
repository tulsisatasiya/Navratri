const express = require("express");
const EventController = require("../controllers/event.controller");
// const verifyUser = require("../middlewares/verifyUser");
const upload = require("../middlewares/multerMiddleware");
const verifyAdmin = require("../middlewares/verifyAdmin");
const validate = require("../middlewares/validate");
const { eventValidation } = require("../validation");

const router = express.Router();

// add event
router.post("/add",validate(eventValidation.eventValidationSchema),upload.array("event_images", 5),EventController.createEvent);

// get all events
router.get("/", EventController.getAllEvents);

// get event by id
router.get("/:id", EventController.getEventById);

// update event
router.put("/:id", verifyAdmin, upload.array("images", 5), EventController.updateEvent);
// delete event
router.delete("/:id", verifyAdmin,EventController.deleteEvent);

module.exports = router;
