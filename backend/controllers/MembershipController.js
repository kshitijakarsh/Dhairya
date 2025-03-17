import Membership from "../models/MembershipSchema.js";
import Users from "../models/UserSchema.js";
import Gym from "../models/GymSchema.js";

export const enrollUserToGym = async (req, res) => {
  try {
    // Add null checks for req.user first
    if (!req.user) {
      console.error("🚫 No user found in request");
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    const user = req.user;
    const { gymId, membershipType, endDate } = req.body;

    // Then check role
    if (user.role !== 'User') {
      console.log(`⛔ Role violation: ${user._id} (${user.role || 'no-role'})`);
      return res.status(403).json({
        success: false,
        message: "Only regular users can enroll"
      });
    }

    // Validate request body
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

    // Check existing membership using correct field names
    const existingMembership = await Membership.findOne({ 
      user: user._id, 
      gym: gymId,
      status: "Active"
    });

    if (existingMembership) {
      return res.status(400).json({ 
        message: `You already have an active ${existingMembership.membershipType} membership`
      });
    }

    const newMembership = new Membership({
      user: user._id,
      gym: gymId,
      membershipType: membershipType.toLowerCase(),
      endDate: new Date(endDate)
    });

    await newMembership.save();

    // Update references using correct field names
    await Users.findByIdAndUpdate(user._id, { 
      $push: { enrolledMemberships: newMembership._id },
      $set: { selectedGym: gymId } 
    });
    
    await Gym.findByIdAndUpdate(gymId, { 
      $push: { members: user._id, memberships: newMembership._id } 
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
