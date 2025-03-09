import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserDashboard from '../models/UserDashboard.js';
import mongoose from 'mongoose';

dotenv.config();

export const registerUser = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password, name, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );
    

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

export const logoutUser = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

export const getProfile = async (req, res) => {
  console.log("request received");
  
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized - No user ID found" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User Profile Fetched:", user);
    res.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, email } },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: "Invalid user ID format" 
      });
    }

    const user = await User.findById(id)
      .select("-password") // Exclude password
      .populate("profile"); // Include profile if needed

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ 
      message: "Error fetching user data",
      error: error.message 
    });
  }
};

export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      age,
      gender,
      height,
      weight,
      fitnessGoals,
      programs,
      medicalConditions,
      dietaryRestrictions
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's profile
    user.profile = {
      age,
      gender,
      height,
      weight,
      fitnessGoals,
      programs,
      medicalConditions,
      dietaryRestrictions
    };

    await user.save();

    res.status(201).json({
      message: "Profile created successfully",
      profile: user.profile
    });
  } catch (error) {
    console.error("Profile creation error:", error);
    res.status(500).json({ 
      message: "Error creating profile",
      error: error.message 
    });
  }
};

export const getUserDashboard = async (req, res) => {
  try {
    const dashboard = await UserDashboard.findOne({ userId: req.user.id });
    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard not found" });
    }
    res.json(dashboard);
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({ message: "Error fetching dashboard" });
  }
};

export const createUserDashboard = async (req, res) => {
  try {
    const { currentWeight, targetWeight, height, calorieTarget } = req.body;

    // Check if dashboard already exists
    let dashboard = await UserDashboard.findOne({ userId: req.user.id });
    if (dashboard) {
      return res.status(400).json({ message: "Dashboard already exists" });
    }

    // Create new dashboard
    dashboard = new UserDashboard({
      userId: req.user.id,
      currentWeight,
      targetWeight,
      height,
      calorieTarget,
      monthlyData: [{
        date: new Date().toISOString(),
        weight: currentWeight
      }]
    });

    await dashboard.save();
    res.status(201).json(dashboard);
  } catch (error) {
    console.error("Create dashboard error:", error);
    res.status(500).json({ message: "Error creating dashboard" });
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  getUserById,
  createProfile,
  getUserDashboard,
  createUserDashboard,
};
