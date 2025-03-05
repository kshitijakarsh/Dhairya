import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  10
);

const { Schema } = mongoose;

const OperationHourSchema = new Schema({
  day: { type: String, required: true },
  open: { type: String, required: true },
  close: { type: String, required: true }
}, { _id: false });

const GymSchema = new Schema({
  gym_id: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => `GYM${nanoid()}`
  },
  name: { 
    type: String, 
    required: true,
    minlength: [3, "Gym name must be at least 3 characters"]
  },
  
  owner: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  address: {
    street: { type: String, required: true, minlength: 3 },
    city: { type: String, required: true, minlength: 2 },
    state: { type: String, required: true, minlength: 2 },
    zip: { type: String, required: true, minlength: 4 },
    country: { type: String, required: true, minlength: 2, default: 'India' }
  },
  
  phone: { 
    type: String, 
    required: true,
    minlength: [10, "Phone number must be at least 10 digits"]
  },
  
  description: { type: String },
  
  operation_hours: {
    type: [OperationHourSchema],
    required: true,
    validate: {
      validator: function(hours) {
        return hours && hours.length > 0;
      },
      message: "At least one operating hours entry is required"
    }
  },

  facilities: {
    type: [String],
    required: true,
    validate: {
      validator: function(facilities) {
        return facilities && facilities.length > 0;
      },
      message: "At least one facility must be specified"
    }
  },

  membership_charges: {
    monthly: { type: Number, required: true, min: 0 },
    yearly: { type: Number, required: true, min: 0 },
    family: { type: Number, required: true, min: 0 }
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
      rating: { type: Number, min: 1, max: 5 },
      date: { type: Date, default: Date.now }
    }
  ],

  customers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Add indexes for search fields
GymSchema.index({ name: 'text', 'address.city': 'text', 'address.state': 'text', 'address.street': 'text', facilities: 'text', description: 'text' });

// Add regular indexes for commonly searched fields
GymSchema.index({ name: 1 });
GymSchema.index({ 'address.city': 1 });
GymSchema.index({ facilities: 1 });

const Gyms = mongoose.model("Gyms", GymSchema);
export default Gyms;

