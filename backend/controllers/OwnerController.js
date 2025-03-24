import GymOwner from "../models/OwnerSchema.js";
import Gyms from "../models/GymSchema.js";
import Memberships from "../models/MembershipSchema.js";
import Users from "../models/UserSchema.js";


export const getAllMembers = async (req, res) => {
  try {
    const { owner } = req.body;

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

    const totalMembers = gyms.reduce((count, gym) => count + gym.memberships.length, 0);

    const gymDetails = gyms.map(gym => ({
      gymName: gym.name,
      memberCount: gym.memberships.length
    }));

    return res.status(200).json({
      success: true,
      totalGyms: gyms.length,
      totalMembers,
      gyms: gymDetails,
    });

  } catch (error) {
    console.error("❌ Error fetching members:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getTotalRevenue = async (req, res) => {
  try {
    const { owner } = req.body;

    // Step 1: Validate if the owner exists
    const existingOwner = await GymOwner.findOne({ user: owner });
    if (!existingOwner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    // Step 2: Find all gyms under this owner
    const gyms = await Gyms.find({ owner });

    if (!gyms.length) {
      return res.status(404).json({
        success: false,
        message: "No gyms found under this owner",
      });
    }

    let totalRevenue = 0;
    let gymRevenueDetails = [];

    // Step 3: Iterate through each gym to get revenue details
    for (const gym of gyms) {
      const membershipCharges = gym.membership_charges || {}; // Ensure it's an object
      let gymRevenue = 0;

      // Step 4: Fetch all active members of this gym from the Memberships schema
      const members = await Memberships.find({ 
        _id: { $in: gym.memberships },
        activeStatus: "Active",
      });

      for (const member of members) {
        let chargeKey;
        switch(member.membershipType) {
          case "Monthly":
            chargeKey = "monthly";
            break;
          case "Half Yearly":
            chargeKey = "half_yearly";
            break;
          case "Yearly":
            chargeKey = "yearly";
            break;
          default:
            console.warn(`Unknown membership type: ${member.membershipType}`);
            continue;
        }

        const planCost = membershipCharges[chargeKey] || 0;
        gymRevenue += planCost;
      }

      totalRevenue += gymRevenue;

      gymRevenueDetails.push({
        gymName: gym.name,
        gymRevenue,
        totalMembers: members.length,
        activeMembers: members.filter(m => m.activeStatus === "Active").length
      });
    }

    // Step 6: Send the response
    return res.status(200).json({
      success: true,
      totalGyms: gyms.length,
      totalRevenue,
      gyms: gymRevenueDetails,
    });

  } catch (error) {
    console.error("❌ Error calculating revenue:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




export default {
  getAllMembers,
  getTotalRevenue
};
