const eventService = require("../services/event.service");

// Create a new event
const createEvent = async (req, res) => {
    try {
      console.log("Request Body:", req.body); 
      console.log("Uploaded Files:", req.files); 
  
      
      if (!req.body.name || !req.body.price || !req.body.description) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: name, price, or description.",
        });
      }
  
      const eventData = {
        name: req.body.name,
        price: Number(req.body.price), 
        startDate: req.body.startDate ? new Date(req.body.startDate) : null,
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
        description: req.body.description,
        event_images: req.files?.map((file) => `/images/events/${file.filename}`) || [],
      };
  
      const newEvent = await eventService.createEvent(eventData);
  
      res.status(201).json({
        success: true,
        message: "Event created successfully",
        event: newEvent,
      });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(400).json({
        success: false,
        message: `Error creating event: ${error.message}`,
      });
    }
  };
  
  

// Update event by ID
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If new images are uploaded, replace existing images
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => `/images/events/${file.filename}`);
    }

    const updatedEvent = await eventService.updateEvent(id, updateData);
    res.status(200).json({ success: true, message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// Get all events
const getAllEvents = async (req, res) => {
  try {
      const { events, totalEvents } = await eventService.getAllEvents();
      res.status(200).json({ success: true, totalEvents, events });
  } catch (error) {
      res.status(500).json({ success: false, message: `Error fetching events: ${error.message}` });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
      const { id } = req.params;
      const event = await eventService.getEventById(id);
      if (!event) {
          return res.status(404).json({ success: false, message: "Event not found" });
      }
      res.status(200).json({ success: true, event });
  } catch (error) {
      res.status(500).json({ success: false, message: `Error fetching event: ${error.message}` });
  }
};

// Delete event by ID
const deleteEvent = async (req, res) => {
  try {
      const { id } = req.params;
      await eventService.deleteEvent(id);
      res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
      res.status(500).json({ success: false, message: `Error deleting event: ${error.message}` });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  getAllEvents,

  getEventById,

  deleteEvent,
};
