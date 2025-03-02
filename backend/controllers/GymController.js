const Gym = require('../models/Gym');
const { z } = require('zod');

// Validation schema for gym registration
const gymSchema = z.object({
  name: z.string().min(1, "Gym name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Valid pincode is required"),
  contactNumber: z.string().min(10, "Valid contact number is required"),
  facilities: z.array(z.string()),
  openingHours: z.string(),
  closingHours: z.string(),
  monthlyFee: z.number().positive("Monthly fee must be positive")
});

const GymController = {
  // Register a new gym
  registerGym: async (req, res) => {
    try {
      console.log('Registering gym with data:', req.body); // Debug log

      // Check if user is a gym owner
      if (req.user.role !== 'owner') {
        return res.status(403).json({ message: 'Only gym owners can register gyms' });
      }

      const gymData = {
        ...req.body,
        owner: req.user._id
      };

      const gym = await Gym.create(gymData);
      res.status(201).json(gym);
    } catch (error) {
      console.error('Gym registration error:', error); // Debug log
      res.status(400).json({ message: error.message });
    }
  },

  // Get gym by ID
  getGym: async (req, res) => {
    try {
      const gym = await Gym.findById(req.params.id);
      
      if (!gym) {
        return res.status(404).json({
          success: false,
          message: "Gym not found"
        });
      }

      res.json({
        success: true,
        data: gym
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get gyms owned by the authenticated user
  getMyGyms: async (req, res) => {
    try {
      const gyms = await Gym.find({ owner: req.user._id });
      res.json(gyms);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update gym details
  updateGym: async (req, res) => {
    try {
      const gym = await Gym.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        req.body,
        { new: true }
      );
      if (!gym) {
        return res.status(404).json({ message: 'Gym not found' });
      }
      res.json(gym);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Add a rating and review
  addRating: async (req, res) => {
    try {
      const { rating, review } = req.body;
      const gym = await Gym.findById(req.params.id);

      if (!gym) {
        return res.status(404).json({
          success: false,
          message: "Gym not found"
        });
      }

      // Check if user has already rated
      const existingRating = gym.ratings.find(r => r.user.toString() === req.user._id.toString());
      if (existingRating) {
        return res.status(400).json({
          success: false,
          message: "You have already rated this gym"
        });
      }

      gym.ratings.push({
        user: req.user._id,
        rating,
        review
      });

      await gym.save();

      res.json({
        success: true,
        message: "Rating added successfully",
        data: gym
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error adding rating",
        error: error.message
      });
    }
  }
};

module.exports = GymController; 