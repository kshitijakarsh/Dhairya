import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  10
);

const { Schema } = mongoose;

const OperationHourSchema = new Schema(
  {
    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    open: { type: String, required: true },
    close: { type: String, required: true },
  },
  { _id: false }
);

const GymSchema = new Schema(
  {
    gym_id: {
      type: String,
      required: true,
      unique: true,
      default: () => `GYM${nanoid()}`,
    },
    name: { type: String, required: true, minlength: 3 },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: String,
    address: {
      street: { type: String, required: true, minlength: 3 },
      city: { type: String, required: true, minlength: 2 },
      state: { type: String, required: true, minlength: 2 },
      zip: { type: String, required: true, minlength: 4 },
      country: { type: String, default: "India" },
    },
    phone: {
      type: String,
      required: true,
      match: [
        /^\d{10,}$/,
        "Phone number must be at least 10 digits and numeric",
      ],
    },
    operation_hours: { type: [OperationHourSchema], required: true },
    facilities: { type: [String], required: true },
    membership_charges: {
      monthly: { type: Number, required: true, min: 0 },
      half_yearly: { type: Number, required: true, min: 0 },
      yearly: { type: Number, required: true, min: 0 },
    },
    ratings: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
    images: [{ type: String }],

    memberships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Membership" }],
  },
  { timestamps: true }
);

GymSchema.index({
  name: "text",
  "address.city": "text",
  facilities: "text",
  description: "text",
});

const Gyms = mongoose.model("Gyms", GymSchema);
export default Gyms;
