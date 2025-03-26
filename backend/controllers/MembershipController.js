import Membership from "../models/MembershipSchema.js";
import Users from "../models/UserSchema.js";
import Gym from "../models/GymSchema.js";
import GymGoer from "../models/GoerSchema.js";
import UserDashboard from "../models/GoerDashboardSchema.js";
import Gyms from "../models/GymSchema.js";

export const enrollUserToGym = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const { gymId, membershipType, endDate } = req.body;
    const user = req.user;

    if (!gymId || !membershipType || !endDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check if user is a GymGoer
    const gymGoer = await GymGoer.findOne({ user: user._id });
    if (!gymGoer) {
      return res.status(403).json({ success: false, message: "Only gym goers can enroll" });
    }

    // Check if gym exists
    const gym = await Gyms.findById(gymId);
    if (!gym) {
      return res.status(404).json({ success: false, message: "Gym not found" });
    }

    // Check for active membership
    const existingMembership = await Membership.findOne({ gymGoer: gymGoer._id, gym: gymId, activeStatus: "Active" });
    if (existingMembership) {
      return res.status(400).json({ success: false, message: `You already have an active ${existingMembership.membershipType} membership` });
    }

    // Create and Save New Membership
    const newMembership = await Membership.create({
      gymGoer: gymGoer._id,
      gym: gymId,
      membershipType: membershipType.toLowerCase(),
      endDate: new Date(endDate),
      activeStatus: "Active", // Ensuring active status
      userName: user.name,
      userProfileImage: user.profileImage || "default-profile.png",
    });

    // Update GymGoer's enrolled memberships
    await GymGoer.findByIdAndUpdate(gymGoer._id, { $push: { enrolledMemberships: newMembership._id } });

    // Update User Dashboard (if applicable)
    await UserDashboard.findOneAndUpdate(
      { userId: user._id },
      { $set: { "userDetails.gymEnrolled": true, "userDetails.gymName": gym.name } },
      { upsert: true } // Ensures dashboard entry exists
    );

    // Update Gym with new membership
    await Gyms.findByIdAndUpdate(gymId, { $push: { memberships: newMembership._id } });

    res.status(201).json({ success: true, message: "Enrollment successful!", membership: newMembership });

  } catch (error) {
    console.error("❌ Enrollment error:", error);
    res.status(500).json({ success: false, message: "Enrollment failed", error: error.message });
  }
};

export const getGymMembers = async (req, res) => {
  try {
    const { gymId } = req.params;
    const memberships = await Membership.find({ gym: gymId }).populate("user");

    res.status(200).json({ members: memberships });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
