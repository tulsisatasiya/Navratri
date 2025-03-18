const bcrypt = require("bcrypt");
const { userService } = require("../services");
const { generateTokens } = require("../utils/token/generateTokens");

/* Add User */

/* Add User */
const addUser = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);
    
    const { name, email, phone, city, password, role } = req.body;
    
    // Store only the filename
    const profilePic = req.file ? req.file.filename : null;

    // Check if user already exists (by email or phone)
    const userExist = await userService.getUserByEmailOrPhone(email, phone);
    if (userExist) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = { profilePic, name, email, phone, city, password: hashedPassword, role };
    const user = await userService.addUser(newUser);
    console.log(user);
    

    if (!user) {
      throw new Error("Something went wrong while creating the user");
    }

    // Generate JWT tokens
    const tokens = await generateTokens(user);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
        profilePic: user.profilePic,
        password: user.password, 
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};


/* User Login */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await userService.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // Generate JWT tokens
    const tokens = await generateTokens(user);

    // Set token as HTTP-only cookie
    res.cookie("access_token", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.status(200).json({
      email: user.email,
      message: "Login successful",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getAllUsers = async (req, res) => {
  try {
    // Ensure only admins can access
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }

    const users = await userService.getAllUsers();
    return res.status(200).json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


/* Get User by ID or Name */
const getUserByIdOrName = async (req, res) => {
  try {
    const { search } = req.params; // Get search parameter from URL

    // Ensure only admins can search for users
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }

    const user = await userService.getUserByIdOrName(search);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    console.log(user);

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Error in getUserByIdOrName:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};



/* Update User */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If password is being updated, hash it before saving
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await userService.updateUser(id, updateData);

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* Delete User */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await userService.deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = { addUser, loginUser,getAllUsers, getUserByIdOrName,updateUser,deleteUser  };
