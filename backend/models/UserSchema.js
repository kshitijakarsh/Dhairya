import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  12
);

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true, default: () => nanoid() },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["User", "Trainer", "Owner"],
    required: true,
  },

  ownerDetails: {
    contact: { type: String },
    gyms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Gym" }],
    // ownerDashboard : { type: mongoose.Schema.Types.ObjectId, ref: "ownerDashboard" },
  },

  trainerDetails: {
    contact: { type: String },
    charges: { type: Number },
    programmes: [{
      type: String,
      enum: [
        "Cardio",
        "Weightlifting",
        "Zumba",
        "CrossFit",
        "Yoga",
        "Boxing",
        "HIIT",
        "Pilates",
        "Calisthenics",
        "Powerlifting",
        "Bodybuilding",
        "Olympic Weightlifting",
        "Kickboxing",
        "Spinning",
        "Athletic Conditioning",
        "Circuit Training",
        "Martial Arts",
        "Swimming",
        "Functional Training",
      ],
    }],
    timeSlots: [{ type: String }], // Define more explicitly if needed
    approved: { type: Boolean, default: false },
    // trainerDashboard : { type: mongoose.Schema.Types.ObjectId, ref: "trainerDashboard" },
  },

  userDetails: {
    programmes: [{
      type: String,
      enum: [
        "Cardio",
        "Weightlifting",
        "Zumba",
        "CrossFit",
        "Yoga",
        "Boxing",
        "HIIT",
        "Pilates",
        "Calisthenics",
        "Powerlifting",
        "Bodybuilding",
        "Olympic Weightlifting",
        "Kickboxing",
        "Spinning",
        "Athletic Conditioning",
        "Circuit Training",
        "Martial Arts",
        "Swimming",
        "Functional Training",
      ],
    }],
    budget: { type: String },
    gymEnrolled: { type: Boolean, default: false },
    gymName: {
      type: String,
      validate: {
        validator: function (value) {
          return this.gymEnrolled ? !!value : true;
        },
        message: "Gym name is required when gymEnrolled is true",
      },
    },
    location: { type: String },
    // profilePicture : { type: String },
    // userDashboard : { type: mongoose.Schema.Types.ObjectId, ref: "userDashboard" },
  },
}, { timestamps: true });

const Users = mongoose.model("Users", UserSchema);
export default Users;
