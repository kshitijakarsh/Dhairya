import Users from "../models/UserSchema.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["Customer", "Trainer", "Owner"], { message: "Invalid role" })
});

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const createUser = async (req, res) => {
  try {
    const validationResult = userSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: validationResult.error.format() });
    }

    const { name, email, password, role } = req.body;

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({ name, email, password: hashedPassword, role });

    const token = generateToken(newUser._id);

    res.status(201).json({ message: "User created successfully", user: newUser, token });
  } catch (error) {
    console.error("Error while creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User doesn't exist!" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    if (!process.env.JWT_SECRET_KEY) {
      console.error("🚨 JWT_SECRET is NOT defined. Check your .env file.");
      return res.status(500).json({ error: "Internal Server Error: JWT_SECRET is missing" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({ msg: "Login successful", token });
  } catch (err) {
    console.error("🔥 Error during login:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
