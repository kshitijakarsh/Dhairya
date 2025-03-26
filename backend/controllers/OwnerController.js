import GymOwner from "../models/OwnerSchema.js";
import Gyms from "../models/GymSchema.js";
import Memberships from "../models/MembershipSchema.js";
import Users from "../models/UserSchema.js";
import mongoose from "mongoose";

export const registerGym = async (req, res) => {
  try {
    const validatedData = req.validatedGym;
    const { owner, name } = validatedData;

    const existingOwner = await GymOwner.findOne({ user: owner });

    if (!existingOwner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    const existingGym = await Gyms.findOne({ name, owner });
    if (existingGym) {
      return res.status(409).json({
        success: false,
        message: "You already have a gym registered with this name",
      });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedImage = await cloudinary.uploader.upload(file.path, {
          folder: "gym_images",
        });
        imageUrls.push(uploadedImage.secure_url);
      }
    }

    const gym = new Gyms({
      ...validatedData,
      images: imageUrls,
    });

    await gym.save();

    existingOwner.gyms.push(gym._id);
    await existingOwner.save();

    res.status(201).json({
      success: true,
      message: "Gym registered successfully",
      data: gym,
    });
  } catch (error) {
    console.error("🔥 Error registering gym:", error);
    res.status(500).json({
      success: false,
      message: "Error registering gym",
      error: error.message,
    });
  }
};

export const getGymStats = async (req, res) => {
  try {
    const owner = req.user.id;

    const existingOwner = await GymOwner.findOne({ user: owner });
    if (!existingOwner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    const gyms = await Gyms.find({ owner });

    if (!gyms.length) {
      return res.status(404).json({
        success: false,
        message: "No gyms found under this owner",
      });
    }

    let totalMembers = 0;
    let totalRevenue = 0;
    let membershipCount = { monthly: 0, half_yearly: 0, yearly: 0 };
    let monthlyMemberships = {};
    let gymDetails = [];

    for (const gym of gyms) {
      const membershipCharges = gym.membership_charges || {};
      let gymRevenue = 0;

      const members = await Memberships.find({
        gym: gym._id,
        activeStatus: "Active",
      });

      totalMembers += members.length;

      for (const member of members) {
        const chargeKey = member.membershipType.replace(" ", "_").toLowerCase();
        const planCost = membershipCharges[chargeKey] || 0;
        gymRevenue += planCost;

        if (membershipCount[chargeKey] !== undefined) {
          membershipCount[chargeKey]++;
        }

        const startMonth = new Date(member.startDate).toLocaleString(
          "default",
          { month: "long", year: "numeric" }
        );

        if (!monthlyMemberships[startMonth]) {
          monthlyMemberships[startMonth] = [];
        }
        monthlyMemberships[startMonth].push({
          memberId: member._id,
          gymId: gym._id,
          membershipType: member.membershipType,
          startDate: member.startDate,
        });
      }

      totalRevenue += gymRevenue;

      gymDetails.push({
        gymName: gym.name,
        memberCount: members.length,
        gymRevenue,
      });
    }

    return res.status(200).json({
      success: true,
      totalGyms: gyms.length,
      totalMembers,
      totalRevenue,
      membershipBreakdown: membershipCount,
      monthlyMemberships,
      gyms: gymDetails,
    });
  } catch (error) {
    console.error("❌ Error fetching gym stats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getMyGyms = async (req, res) => {
  try {
    const gyms = await Gyms.find({ owner: req.user._id })
      .select("-ratings")
      .sort({ createdAt: -1 });
    console.log(gyms);

    res.json({
      success: true,
      data: gyms,
    });
  } catch (error) {
    handleError(res, error, "Error fetching your gyms");
  }
};

export const updateGym = async (req, res) => {
  try {
    const validatedData = req.validatedGym;

    const gym = await Gyms.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      validatedData,
      { new: true, runValidators: true }
    );

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: "Gym not found or you don't have permission to update it",
      });
    }

    res.json({
      success: true,
      message: "Gym updated successfully",
      data: gym,
    });
  } catch (error) {
    handleError(res, error, "Error updating gym");
  }
};

export const deleteGym = async (req, res) => {
  try {
    const gym = await Gyms.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: "Gym not found or you don't have permission to delete it",
      });
    }

    res.json({
      success: true,
      message: "Gym deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "Error deleting gym");
  }
};

export const getMembersByGym = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const gyms = await Gyms.find({ owner: ownerId }).select("name _id").lean();

    if (!gyms.length) {
      return res.status(404).json({ success: false, message: "No gyms found under this owner" });
    }

    const gymIds = gyms.map((gym) => gym._id.toString());

    const memberships = await Memberships.find({ gym: { $in: gymIds } })
      .select("gym membershipType endDate paymentStatus gymGoer userName userProfileImage")
      .lean();

    if (!memberships.length) {
      return res.status(200).json({ success: true, gymMembers: {} });
    }

    const gymMembers = {};
    gyms.forEach((gym) => {
      gymMembers[gym.name] = memberships
        .filter((membership) => membership.gym.toString() === gym._id.toString())
        .map((membership) => ({
          membershipId: membership._id.toString(),
          membershipType: membership.membershipType,
          endDate: membership.endDate,
          paymentStatus: membership.paymentStatus,
          name: membership.userName || "Unknown",
          profilePicture: membership.userProfileImage || "default-profile.png",
        }));
    });

    return res.status(200).json({ success: true, gymMembers });
  } catch (error) {
    console.error("❌ Error fetching gym members:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export default {
  registerGym,
  getGymStats,
  getMyGyms,
  updateGym,
  deleteGym,
  getMembersByGym,
};
