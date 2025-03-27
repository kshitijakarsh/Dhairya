import Membership from "../models/MembershipSchema.js";

export const updateExpiredMemberships = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const result = await Membership.updateMany(
      { endDate: { $lt: today }, ActiveStatus: "Active" },
      { $set: { ActiveStatus: "Inactive" } }
    );
  } catch (error) {
    console.error("❌ Error updating memberships:", error);
  }
};
