import Gym from "../models/GymSchema.js";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const gymSchema = z.object({
  name: z.string().min(3, "Gym name must be at least 3 characters"),
  location: z.string().min(3, "Location must be valid"),
  owner: z.string(),
  facilities: z.array(z.string()).optional(),
  ratings: z.array(
    z.object({
      user: z.string(),
      rating: z.number().min(1).max(5),
      review: z.string().optional()
    })
  ).optional()
});

export const registerGym = async (req, res) => {
  try {
    if (req.user.role !== "Owner") {
      return res.status(403).json({ message: "Only gym owners can register gyms" });
    }

    const validatedData = gymSchema.parse({ ...req.body, owner: req.user._id });
    const gym = await Gym.create(validatedData);
    
    res.status(201).json(gym);
  } catch (error) {
    res.status(400).json({ message: error.errors || error.message });
  }
};

export const getGymById = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);
    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }
    res.json(gym);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyGyms = async (req, res) => {
  try {
    const gyms = await Gym.find({ owner: req.user._id });
    res.json(gyms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateGym = async (req, res) => {
  try {
    const gym = await Gym.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }
    res.json(gym);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const gym = await Gym.findById(req.params.id);

    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }

    const existingRating = gym.ratings.find(r => r.user.toString() === req.user._id.toString());
    if (existingRating) {
      return res.status(400).json({ message: "You have already rated this gym" });
    }

    gym.ratings.push({ user: req.user._id, rating, review });
    await gym.save();

    res.json({ message: "Rating added successfully", data: gym });
  } catch (error) {
    res.status(500).json({ message: "Error adding rating", error: error.message });
  }
};

export default {
  registerGym,
  getGymById,
  getMyGyms,
  updateGym,
  addRating
};
