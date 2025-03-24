import Membership from "../models/MembershipSchema.js";

export const updateExpiredMemberships = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight

    console.log("🔄 Checking for expired memberships...");

    const result = await Membership.updateMany(
      { endDate: { $lt: today }, ActiveStatus: "Active" }, // Find expired active memberships
      { $set: { ActiveStatus: "Inactive" } } // Mark them as inactive
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Updated ${result.modifiedCount} expired memberships.`);
    } else {
      console.log("✅ No expired memberships found.");
    }
  } catch (error) {
    console.error("❌ Error updating memberships:", error);
  }
};
