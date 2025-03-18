const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    profilePic: { 
      type: String, 
      default: "" 
    },
    name: { 
      type: String, 
      required: true
     },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    phone: {
       type: String, 
       required: true, 
       unique: true 
    },
    role: {
       type: String, 
       enum: ["admin", "user","garbaClass"], 
       default: "user" 
      },
    city: { 
      type: String,
       required: true 
      },
    password: { 
      type: String, 
      required: true
     },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
