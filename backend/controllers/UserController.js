import Users from "../models/UserSchema.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import generateToken from "../utils/jwt.js";

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

    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    generateToken(newUser.userId);

    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
      role,
    });


    

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.log("Create User Error : ", error);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const User = await Users.findOne({ email });

    if(!User){
      res.status(404).json({ error : "User doesn't exist!"})
    }

    const ispasswordMatched = await bcrypt.compare(
      password,
      User?.password || ""
    );
    if (!User || !ispasswordMatched) {
      return res.status(400).json({ error: "Invalid username or password" });
    }else{
      return res.status(200).json({msg : "login successful"})
      
    }
  } catch (err) {
    console.log("error at login : ", err);
  }
};
