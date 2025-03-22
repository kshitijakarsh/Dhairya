import mongoose from "mongoose";

const GoerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    enrolledMemberships: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Membership" },
    ],
    userDashboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoerDashboard",
    },
  },
  { timestamps: true }
);

const GymGoer = mongoose.model("GymGoer", GoerSchema);
export default GymGoer;
