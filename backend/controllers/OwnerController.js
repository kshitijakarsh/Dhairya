import GymOwner from "../models/OwnerSchema.js";
import Gyms from "../models/GymSchema.js";
import Memberships from "../models/MembershipSchema.js";

export const getGymStats = async (req, res) => {
  console.log("request recieved", req.user.id);
  
  try {
    const owner  = req.user.id;
    console.log(owner);
    

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
    let gymDetails = [];

    for (const gym of gyms) {
      const membershipCharges = gym.membership_charges || {};
      let gymRevenue = 0;

      const members = await Memberships.find({ 
        gym: gym._id, 
        activeStatus: "Active" 
      });

      totalMembers += members.length;

      for (const member of members) {
        const chargeKey = member.membershipType
          .replace(" ", "_") 
          .toLowerCase();
        const planCost = membershipCharges[chargeKey] || 0;
        gymRevenue += planCost;
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

export default {
  getGymStats,
};