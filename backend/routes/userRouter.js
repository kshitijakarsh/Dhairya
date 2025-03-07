import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  updateProfile,
  getProfile,
  logoutUser,
  getUserById,
  createProfile,
  getUserDashboard,
  createUserDashboard
} from "../controllers/UserController.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/profile", protect, createProfile);
router.get("/verify", protect, (req, res) => {
  res.json({ valid: true });
});
router.get("/:id", protect, getUserById);
router.get('/dashboard', protect, getUserDashboard);
router.post('/dashboard', protect, createUserDashboard);

export default router;