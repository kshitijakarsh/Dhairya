import mongoose from "mongoose";
const { Schema } = mongoose;

const OperationHourSchema = new Schema({
  day: { type: String, required: true },
  open: { type: String, required: true },
  close: { type: String, required: true }
}, { _id: false });

const GymSchema = new Schema({
  gym_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  address: {
    street: { type: String },
    city:   { type: String },
    state:  { type: String },
    zip:    { type: String },
    country:{ type: String }
  },
  
  phone: { type: String },
  
  operation_hours: [OperationHourSchema],

  facilities: [{ type: String }],

  membership_charges: {
    monthly: { type: Number },
    yearly:  { type: Number },
    family:  { type: Number }
  },

  photos: [
    {
      url: { type: String },
      caption: { type: String }
    }
  ],

  testimonials: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      comment: { type: String },
      rating: { type: Number },
      date: { type: Date, default: Date.now }
    }
  ],

  customers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Gyms = mongoose.model("Gyms", GymSchema);
export default Gyms;

