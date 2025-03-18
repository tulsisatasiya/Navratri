const mongoose = require("mongoose");

const userRefreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("UserRefreshToken", userRefreshTokenSchema);
