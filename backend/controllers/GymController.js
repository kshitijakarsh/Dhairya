import Gyms from "../models/GymSchema.js";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

export const registerGym = async (req, res) => {
  try {
    console.log('Received gym registration data:', req.body);

    try {
      const formattedData = {
        ...req.body,
        owner: req.user._id.toString(),
        operation_hours: Array.isArray(req.body.operation_hours) ? req.body.operation_hours : [],
        membership_charges: {
          monthly: Number(req.body.membership_charges?.monthly),
          yearly: Number(req.body.membership_charges?.yearly),
          family: Number(req.body.membership_charges?.family)
        }
      };

      const validatedData = gymSchema.parse(formattedData);
      console.log('Validated data:', validatedData);
      
      const gym = await Gyms.create(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Gym registered successfully",
        data: gym
      });
    } catch (validationError) {
      console.error('Validation error:', validationError);
    }
  } catch (error) {
    console.error('Gym registration error:', error)
    if (error.type === 'ValidationError') {
      return res.status(400).json(error);
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        path: err.path,
        message: err.message,
        code: err.kind
      }));
      return res.status(400).json({
        type: 'ValidationError',
        message: errors
      });
    }

    // Handle other types of errors
    res.status(400).json({
      type: 'Error',
      message: error.message || "Failed to register gym"
    });
  }
};

export const getGymById = async (req, res) => {
  try {
    const gym = await Gyms.findById(req.params.id);
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
    const gyms = await Gyms.find({ owner: req.user._id });
    res.json(gyms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateGym = async (req, res) => {
  try {
    const gym = await Gyms.findOneAndUpdate(
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
    const gym = await Gyms.findById(req.params.id);

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

export const searchGyms = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === '') {
      const allGyms = await Gyms.find({})
        .select('name address facilities membership_charges')
        .sort({ created_at: -1 })  // Show newest first
        .limit(20)
        .lean();
      return res.json(allGyms);
    }

    const searchRegex = new RegExp(query.trim(), 'i');
    
    const gyms = await Gyms.find({
      $or: [
        { name: searchRegex },
        { 'address.city': searchRegex },
        { 'address.state': searchRegex },
        { 'address.street': searchRegex },
        { facilities: { $in: [searchRegex] } },
        { description: searchRegex }
      ]
    })
    .select('name address facilities membership_charges')
    .sort({ created_at: -1 })  // Show newest first
    .limit(50)
    .lean();

    // If no exact matches found, try fuzzy search
    if (gyms.length === 0) {
      const fuzzyResults = await Gyms.find({
        $or: [
          { name: { $regex: query.split('').join('.*'), $options: 'i' } },
          { 'address.city': { $regex: query.split('').join('.*'), $options: 'i' } },
          { facilities: { $regex: query.split('').join('.*'), $options: 'i' } }
        ]
      })
      .select('name address facilities membership_charges')
      .sort({ created_at: -1 })  // Show newest first
      .limit(20)
      .lean();
      
      return res.json(fuzzyResults);
    }

    res.json(gyms);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: "Error searching gyms",
      error: error.message 
    });
  }
};

export default {
  registerGym,
  getGymById,
  getMyGyms,
  updateGym,
  addRating,
  searchGyms
};
