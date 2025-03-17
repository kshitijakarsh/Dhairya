import mongoose from "mongoose";

const MembershipSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  gym: { type: mongoose.Schema.Types.ObjectId, ref: "Gyms", required: true },
  membershipType: { type: String, enum: ["monthly", "half-yearly", "yearly"], required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["Active", "Expired", "Cancelled"], default: "Active" }
});

const Membership = mongoose.model("Membership", MembershipSchema);
export default Membership;
