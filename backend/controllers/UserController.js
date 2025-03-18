import User from "../models/UserSchema.js";
import cloudinary from '../utils/cloudinary.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserDashboard from "../models/UserDashboard.js";
import Membership from "../models/MembershipSchema.js";

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // File handling
    let profileImage = null;
    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_pics',
      });
      profileImage = uploadedImage.secure_url;
    }

    // Create user with all fields
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage
    });

    // Generate token
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
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      },
      message: "Registration successful"
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message || "Registration failed" });
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
        dashboard : user.dashboardId
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
  try {
    const userId = req.user.id;
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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.dashboardId) {
      return res.status(400).json({ message: "Dashboard already exists" });
    }

    const weightEntry = {
      weight: parseFloat(currentWeight),
      date: new Date().toISOString(),
    };

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

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    console.log("📝 Received updates:", updates);

    const user = await User.findById(userId);
    if (!user?.dashboardId) {
      return res.status(404).json({ message: "Dashboard not found" });
    }

    const updateOperations = {};
    const arrayFilters = [];

    if (updates.attendance) {
      const { month, day } = updates.attendance;
      updateOperations.$addToSet = { "attendance.$[elem].daysPresent": day };
      arrayFilters.push({ "elem.month": month });
    }

    if (updates.currentWeight) {
      updateOperations.$push = {
        monthlyData: {
          weight: updates.currentWeight,
          date: new Date().toISOString(),
        },
      };
    }

    if (updates.userDetails) {
      updateOperations.$set = {
        ...updateOperations.$set,
        ...Object.entries(updates.userDetails).reduce((acc, [key, value]) => {
          acc[`userDetails.${key}`] = value;
          return acc;
        }, {})
      };
    }

    updateOperations.$set = { ...updateOperations.$set, lastUpdated: Date.now() };

    if (Object.keys(updateOperations).length > 0) {
      const updateQuery = {
        _id: user.dashboardId
      };

      const updateOptions = {
        new: true,
        runValidators: true,
      };

      if (arrayFilters.length > 0) {
        updateOptions.arrayFilters = arrayFilters;
      }

      const updatedDashboard = await UserDashboard.findByIdAndUpdate(
        updateQuery,
        updateOperations,
        updateOptions
      );

      console.log("✅ Dashboard update successful:", updatedDashboard);
      return res.json({ message: "Dashboard updated", dashboard: updatedDashboard });
    }

    console.warn("⚠️ No valid updates provided");
    return res.status(400).json({ message: "No valid updates provided" });

  } catch (error) {
    console.error("🔥 Update error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
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

export const getUserEnrollments = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: "memberships",
      populate: {
        path: "gym",
        model: "Gym",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ enrolledGyms: user.enrolledMemberships });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export default {
  registerUser,
  loginUser,
  logoutUser,
  createProfile,
  getUserDashboard,
  updateProfile
};
