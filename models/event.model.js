const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  event_images: {
    type: [String], 
  
  },
  price: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    
  },
  endDate: {
    type: Date,
   
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
