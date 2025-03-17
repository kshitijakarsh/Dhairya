import Membership from "../models/MembershipSchema.js";
import Users from "../models/UserSchema.js";
import Gym from "../models/GymSchema.js";

export const enrollUserToGym = async (req, res) => {
  try {
    const user = req.user;
    const { gymId, membershipType, endDate } = req.body;

    // Add role validation check
    if (user.role !== 'User') {
      console.log(`⛔ Role violation attempt by ${user._id} (${user.role})`);
      return res.status(403).json({
        success: false,
        message: "Only regular users can enroll in gym memberships"
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
