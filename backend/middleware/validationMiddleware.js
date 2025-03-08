import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["User", "Trainer", "Owner"], { message: "Invalid role" }),
});


export const validateUser = (req, res, next) => {
    try {
      req.body = userSchema.parse(req.body); 
      next();
    } catch (error) {
      res.status(400).json({ errors: error.errors });
    }
  };
  

const profileSchema = z.object({
  age: z.number().min(13).max(100),
  gender: z.enum(["male", "female", "other"]),
  height: z.number().positive(),
  weight: z.number().positive(),
  fitnessGoals: z.array(z.string()),
  programs: z.array(z.string()),
  medicalConditions: z.string().optional(),
  dietaryRestrictions: z.string().optional()
});