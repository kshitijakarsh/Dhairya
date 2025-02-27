import UserSchema from "../models/UserSchema.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import generateToken from "../utils/jwt.js"

export const createUser = async (req, res) => {
  try {
    const schema = z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
    });

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.format() });
    }

    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserSchema.create({
      name,
      email,
      password: hashedPassword,
    });


    generateToken(newUser.userId)

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.log("Create User Error : ", error);
  }
};