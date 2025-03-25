import Gyms from "../models/GymSchema.js";
import GymOwner from "../models/OwnerSchema.js";
import dotenv from "dotenv";
dotenv.config();

export const getGymById = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await Gyms.findById(id)
      .populate('owner', 'name email')
      .lean();

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    res.status(200).json({
      success: true,
      data: gym
    });
  } catch (error) {
    console.error('Error in getGymById:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching gym details'
    });
  }
};


export const addRating = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const gym = await Gyms.findById(req.params.id);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: "Gym not found",
      });
    }

    const existingRating = gym.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      return res.status(409).json({
        success: false,
        message: "You have already rated this gym",
      });
    }

    gym.ratings.push({
      user: req.user._id,
      rating,
      comment: comment || "",
    });

    await gym.save();

    res.json({
      success: true,
      message: "Rating added successfully",
      data: gym,
    });
  } catch (error) {
    handleError(res, error, "Error adding rating");
  }
};

export const searchGyms = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === "") {
      const allGyms = await Gyms.find({})
        .select("name address facilities membership_charges")
        .sort({ created_at: -1 })
        .limit(20)
        .lean();
      return res.json(allGyms);
    }

    const searchRegex = new RegExp(query.trim(), "i");

    const gyms = await Gyms.find({
      $or: [
        { name: searchRegex },
        { "address.city": searchRegex },
        { "address.state": searchRegex },
        { "address.street": searchRegex },
        { facilities: { $in: [searchRegex] } },
        { description: searchRegex },
      ],
    })
      .select("name address facilities membership_charges images")
      .sort({ created_at: -1 })
      .limit(50)
      .lean();

    if (gyms.length === 0) {
      const fuzzyResults = await Gyms.find({
        $or: [
          { name: { $regex: query.split("").join(".*"), $options: "i" } },
          {
            "address.city": {
              $regex: query.split("").join(".*"),
              $options: "i",
            },
          },
          { facilities: { $regex: query.split("").join(".*"), $options: "i" } },
        ],
      })
        .select("name address facilities membership_charges")
        .sort({ created_at: -1 })
        .limit(20)
        .lean();

      return res.json(fuzzyResults);
    }

    res.json(gyms);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      message: "Error searching gyms",
      error: error.message,
    });
  }
};


export default {
  getGymById,
  addRating,
  searchGyms
};
