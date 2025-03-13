import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["User", "Trainer", "Owner"], { message: "Invalid role" }),
});


const isValidTime = (time) => {
  if (!time || typeof time !== 'string') return false;
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

const gymSchema = z.object({
  name: z.string().min(3, "Gym name must be at least 3 characters"),
  owner: z.string(),
  address: z.object({
    street: z.string().min(3, "Street address must be at least 3 characters"),
    city: z.string().min(2, "City name must be at least 2 characters"),
    state: z.string().min(2, "State name must be at least 2 characters"),
    zip: z.string().min(4, "ZIP code must be at least 4 characters"),
    country: z.string().min(2, "Country name must be at least 2 characters")
  }),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  operation_hours: z.array(
    z.object({
      day: z.string(),
      open: z.string().refine((time) => isValidTime(time), {
        message: "Opening time must be in HH:mm format"
      }),
      close: z.string().refine((time) => isValidTime(time), {
        message: "Closing time must be in HH:mm format"
      })
    })
  ).nonempty("At least one operating hours entry is required"),
  facilities: z.array(z.string()).nonempty("At least one facility must be selected"),
  membership_charges: z.object({
    monthly: z.number().positive("Monthly fee must be positive"),
    yearly: z.number().positive("Yearly fee must be positive"),
    family: z.number().positive("Family package fee must be positive")
  }),
  description: z.string().optional(),
  ratings: z.array(
    z.object({
      user: z.string(),
      rating: z.number().min(1).max(5),
      review: z.string().optional()
    })
  ).optional()
}).strict();



export const validateGym = (req, res, next) => {
  try {
    if (req.body.membership_charges) {
      req.body.membership_charges = {
        monthly: Number(req.body.membership_charges.monthly),
        yearly: Number(req.body.membership_charges.yearly),
        family: Number(req.body.membership_charges.family),
      };
    }

    if (!req.body.ratings) {
      req.body.ratings = [];
    }

    req.body = gymSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


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