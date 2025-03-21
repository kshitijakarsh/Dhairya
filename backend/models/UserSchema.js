import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Owner", "Goer"], required: true },
  profileImage: { type: String }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;
