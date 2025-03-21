import mongoose from "mongoose";

const OwnerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    gyms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Gym" }],
    dashboard: { type: mongoose.Schema.Types.ObjectId, ref: "OwnerDashboard" },
  },
  { timestamps: true }
);

const GymOwner = mongoose.model("GymOwner", OwnerSchema);
export default GymOwner;
