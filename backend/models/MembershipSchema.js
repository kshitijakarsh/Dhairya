import mongoose from "mongoose";

const MembershipSchema = new mongoose.Schema({
  gymGoer: { type: mongoose.Schema.Types.ObjectId, ref: "GymGoer", required: true },
  gym: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", required: true },
  membershipType: { type: String, enum: ["monthly", "half-yearly", "yearly"], required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  paymentStatus: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
  activeStatus: {type: String, enum: ["Active", "Inactive"], default: "Active"}
}, { timestamps: true });

const Membership = mongoose.model("Membership", MembershipSchema);
export default Membership;
