import Membership from "../models/MembershipSchema.js";
import Users from "../models/UserSchema.js";
import Gym from "../models/GymSchema.js";

export const enrollUserToGym = async (req, res) => {
  try {
    const { userId, gymId, membershipType, endDate } = req.body;

    const user = await Users.findById(userId);
    if (!user || user.role !== "User") {
      return res.status(403).json({ message: "Only users can enroll in a gym" });
    }

    const existingMembership = await Membership.findOne({ user: userId, gym: gymId, status: "Active" });
    if (existingMembership) {
      return res.status(400).json({ message: "User is already enrolled in this gym" });
    }

    const newMembership = new Membership({ user: userId, gym: gymId, membershipType, endDate });
    await newMembership.save();

    await Users.findByIdAndUpdate(userId, { $push: { enrolledMemberships: newMembership._id } });
    await Gym.findByIdAndUpdate(gymId, { $push: { memberships: newMembership._id } });

    res.status(201).json({ message: "User enrolled successfully!", membership: newMembership });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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
