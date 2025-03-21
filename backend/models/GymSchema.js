const GymSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "GymOwner", required: true },
  address: { street: String, city: String, state: String, zip: String, country: { type: String, default: "India" }},
  facilities: [{ type: String }],
  membership_charges: { monthly: Number, half_yearly: Number, yearly: Number },
  memberships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Membership" }]
}, { timestamps: true });

const Gym = mongoose.model("Gym", GymSchema);
export default Gym;
