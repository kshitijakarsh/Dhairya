import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserDashboard from "../models/UserDashboard.js";
import mongoose from "mongoose";

dotenv.config();

export const registerUser = async (req, res) => {
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
      role,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    await user.save();
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: "User registered successfully",
    });
    
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
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

export const logoutUser = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

export const createProfile = async (req, res) => {
  console.log(req.body); // Log incoming request data for debugging

  try {
    const userId = req.user.id; // Extract userId from auth middleware
    const {
      age,
      gender,
      height,
      currentWeight,
      targetWeight,
      calorieTarget,
      fitnessGoals,
      programmes,
      gymEnrolled,
      gymName,
      budget,
    } = req.body;

    // ✅ Ensure user exists before proceeding
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Prevent duplicate dashboard creation
    if (user.dashboardId) {
      return res.status(400).json({ message: "Dashboard already exists" });
    }

    // ✅ Initialize weight history with the current weight
    const weightEntry = {
      weight: parseFloat(currentWeight),
      date: new Date().toISOString(),
    };

    // ✅ Create a new UserDashboard
    const dashboard = new UserDashboard({
      userId,
      profile: {
        age,
        gender,
        height,
        fitnessGoals,
        programs: programmes,
      },
      userDetails: {
        gymEnrolled,
        gymName: gymEnrolled ? gymName : null,
        budget,
      },
      monthlyData: [weightEntry],
      targetWeight,
      calorieTarget,
    });

    await dashboard.save();

    // ✅ Link dashboard to user
    user.dashboardId = dashboard._id;
    await user.save();

    res.status(201).json({
      message: "Profile created successfully",
      dashboard,
    });
  } catch (error) {
    console.error("Profile creation error:", error);
    res.status(500).json({
      message: "Error creating profile",
      error: error.message,
    });
  }
};


export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const dashboard = await UserDashboard.findOne({ userId: user._id });
    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard not found. Please complete your profile setup." });
    }
    res.status(200).json({
      success: true,
      message: "Dashboard retrieved successfully",
      dashboard,
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    res.status(500).json({ message: "Error fetching dashboard", error: error.message });
  }
};


export default {
  registerUser,
  loginUser,
  logoutUser,
  createProfile,
  getUserDashboard,
};
