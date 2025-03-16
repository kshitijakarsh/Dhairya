import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  12
);

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, default: () => nanoid() },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Owner", "Trainer", "User"],
      required: true,
    },

    memberships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Membership" }],

    ownerDashboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OwnerDashboard",
      default: null,
    },
    trainerDashboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrainerDashboard",
      default: null,
    },
    userDashboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserDashboard",
      default: null,
    }

  },
  { timestamps: true }
);

const Users = mongoose.model("Users", UserSchema);
export default Users;
