import mongoose from "mongoose";

const OwnerDashboardSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "GymOwner", required: true },
    totalMembers: { type: Number, default: 0 },
    newMemberships: { type: Number, default: 0 },
    monthlyRevenue: { type: Number, default: 0 },
    outstandingPayments: { type: Number, default: 0 },
    expenses: [{ category: String, amount: Number, date: Date }]
  }, { timestamps: true });
  
  const OwnerDashboard = mongoose.model("OwnerDashboard", OwnerDashboardSchema);
  export default OwnerDashboard;
  