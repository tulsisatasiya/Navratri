const jwt = require("jsonwebtoken");
const UserRefreshToken = require("../../models/UserRefreshToken");
require("dotenv").config(); // Load environment variables

const generateTokens = async (user) => {
  try {
    const payload = { _id: user._id, role: user.role };

    // Debug: Check if env variables are loaded
    // console.log("Access Token Secret:", process.env.JWT_ACCESS_TOKEN_SECRET_KEY);
    // console.log("Refresh Token Secret:", process.env.JWT_REFRESH_TOKEN_SECRET_KEY);

    // Ensure that secret keys are available
    if (!process.env.JWT_ACCESS_TOKEN_SECRET_KEY || !process.env.JWT_REFRESH_TOKEN_SECRET_KEY) {
      throw new Error("JWT secret keys are missing.");
    }

    // Generate access and refresh tokens
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET_KEY, { expiresIn: "30m" });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, { expiresIn: "7d" });

    // Remove old refresh tokens from the database
    await UserRefreshToken.findOneAndDelete({ userId: user._id });
    await new UserRefreshToken({ userId: user._id, token: refreshToken }).save();

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token Generation Error:", error);
    return Promise.reject(error);
  }
};

module.exports = { generateTokens };
