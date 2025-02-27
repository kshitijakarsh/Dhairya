import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  12
);

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true, default: () => nanoid() },
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["customer", "trainer", "owner"],
    required: true,
  },

  ownerDetails: {
    contact: String,
    gyms: [],
    // ownerDashboard : { type: mongoose.Schema.Types.ObjectId, ref: "ownerDashboard" },
  },

  trainerDetails: {
    contact: String,
    charges: String,
    programmes: {
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
    },
    timeSlots: [],
    approved: { type: Boolean, default: false },
    // trainerDashboard : { type: mongoose.Schema.Types.ObjectId, ref: "trainerDashboard" },
  },

  userDetails: {
    programmes: {
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
    },
    budget: String,
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
    location: String,
    // profilePicture : String,
    // userDashboard : { type: mongoose.Schema.Types.ObjectId, ref: "userDashboard" },
  },
});

const Users = mongoose.model("Users", UserSchema);
export default Users;
