const mongoose = require("mongoose");
const Event = require("../models/event.model");

// Create a new event
const createEvent = async (eventData) => {
  try {
    const newEvent = new Event(eventData);
    return await newEvent.save();
    
  } catch (error) {
    throw new Error("Error creating event: " + error.message);
  }
};

// Get all events
// Get all events with count
const getAllEvents = async () => {
    try {
      const events = await Event.find();
      const totalEvents = await Event.countDocuments(); // Get the total count of events
      return { events, totalEvents };
    } catch (error) {
      throw new Error("Error fetching events: " + error.message);
    }
  };
  

// Get an event by ID
const getEventById = async (eventId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new Error("Invalid Event ID");
    }

    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    return event;
  } catch (error) {
    throw new Error("Error fetching event: " + error.message);
  }
};

// Update an event by ID
const updateEvent = async (eventId, updateData) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new Error("Invalid Event ID");
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) throw new Error("Event not found");

    return updatedEvent;
  } catch (error) {
    throw new Error("Error updating event: " + error.message);
  }
};

// Delete an event by ID
const deleteEvent = async (eventId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new Error("Invalid Event ID");
    }

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (!deletedEvent) throw new Error("Event not found");

    return deletedEvent;
  } catch (error) {
    throw new Error("Error deleting event: " + error.message);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
