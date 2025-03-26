import mongoose from "mongoose";

const MembershipSchema = new mongoose.Schema(
  {
    gymGoer: { type: mongoose.Schema.Types.ObjectId, ref: "GymGoer", required: true },
    gym: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", required: true },
    membershipType: { type: String, enum: ["monthly", "half_yearly", "yearly"], required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    paymentStatus: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
    activeStatus: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    // Cached User Data for Faster Lookups
    userName: { type: String, required: true },
    userProfileImage: { type: String, default: "default-profile.png" },
  },
  { timestamps: true }
);

// Auto-Fill userName & userProfileImage Before Saving
// MembershipSchema.pre("save", async function (next) {
//   if (!this.isModified("gymGoer")) return next();

//   try {
//     const user = await mongoose.model("GymGoer").findById(this.gymGoer).select("name profileImage").lean();
//     if (user) {
//       this.userName = user.name;
//       this.userProfileImage = user.profileImage || "default-profile.png";
//     }
//   } catch (error) {
//     console.error("Error updating Membership with user data:", error);
//   }
//   next();
// });

// // Update user data in Membership when User updates profile
// MembershipSchema.statics.updateUserInfo = async function (gymGoerId, newName, newProfileImage) {
//   return this.updateMany(
//     { gymGoer: gymGoerId },
//     { $set: { userName: newName, userProfileImage: newProfileImage } }
//   );
// };

const Membership = mongoose.model("Membership", MembershipSchema);
export default Membership;
