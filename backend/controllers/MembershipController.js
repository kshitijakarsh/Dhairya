import Membership from "../models/MembershipSchema.js";
import Users from "../models/UserSchema.js";
import Gym from "../models/GymSchema.js";

export const enrollUserToGym = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gymId, membershipType, endDate } = req.body;

    console.log("🔍 Fetching user with ID:", userId);
    const user = await Users.findById(userId);

    if (!user) {
      console.warn("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "User") {
      console.warn("⛔ Unauthorized: Only users can enroll in a gym");
      return res.status(403).json({ message: "Only users can enroll in a gym" });
    }

    console.log("📌 Checking existing membership...");
    const existingMembership = await Membership.findOne({ user: userId, gym: gymId, status: "Active" });

    if (existingMembership) {
      console.warn("⚠️ User is already enrolled in this gym");
      return res.status(400).json({ message: "User is already enrolled in this gym" });
    }

    console.log("🆕 Creating new membership...");
    const newMembership = new Membership({ user: userId, gym: gymId, membershipType, endDate });
    await newMembership.save();

    console.log("🔄 Updating user and gym references...");
    await Users.findByIdAndUpdate(userId, { $push: { enrolledMemberships: newMembership._id } });
    await Gym.findByIdAndUpdate(gymId, { $push: { memberships: newMembership._id } });

    console.log("✅ Enrollment successful:", newMembership);
    return res.status(201).json({ message: "User enrolled successfully!", membership: newMembership });

  } catch (error) {
    console.error("🔥 Enrollment error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
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
