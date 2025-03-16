const mongoose = require("mongoose");

const MembershipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  gymId: { type: mongoose.Schema.Types.ObjectId, ref: "Gyms", required: true },
  membershipType: { type: String, enum: ["Monthly", "Quarterly", "Annual"], required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["Active", "Expired", "Cancelled"], default: "Active" }
});

const Membership = mongoose.model("Membership", MembershipSchema);
export default Membership;
