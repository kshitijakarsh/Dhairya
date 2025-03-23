import Membership from "../models/MembershipSchema.js";
import Users from "../models/UserSchema.js";
import Gym from "../models/GymSchema.js";
import GymGoer from "../models/GoerSchema.js";
import UserDashboard from "../models/GoerDashboardSchema.js";
import Gyms from "../models/GymSchema.js";

export const enrollUserToGym = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    const user = req.user;
    const { gymId, membershipType, endDate } = req.body;

    const gymGoer = await GymGoer.findOne({ user: user._id });
    if (!gymGoer) {
      return res.status(403).json({
        success: false,
        message: "Only gym goers can enroll"
      });
    }

    if (!gymId || !membershipType || !endDate) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields" 
      });
    }

    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }

    const existingMembership = await Membership.findOne({ 
      gymGoer: gymGoer._id, 
      gym: gymId,
      status: "Active"
    });

    if (existingMembership) {
      return res.status(400).json({ 
        message: `You already have an active ${existingMembership.membershipType} membership`
      });
    }

    const newMembership = new Membership({
      gymGoer: gymGoer._id,
      gym: gymId,
      membershipType: membershipType.toLowerCase(),
      endDate: new Date(endDate)
    });

    await newMembership.save();

    await GymGoer.findByIdAndUpdate(gymGoer._id, {
      $push: { enrolledMemberships: newMembership._id }
    });

    await UserDashboard.findOneAndUpdate(
      { userId: user._id },
      { 
        $set: { 
          "userDetails.gymEnrolled": true,
          "userDetails.gymName": gym.name
        } 
      }
    );

    await Gyms.findByIdAndUpdate(gymId, {
      $push: {
        memberships: gymGoer._id
      }
    });

    res.status(201).json({
      success: true,
      message: "Enrollment successful!",
      membership: newMembership
    });

  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Enrollment failed"
    });
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
