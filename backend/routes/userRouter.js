import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  updateProfile,
  getProfile,
  logoutUser,
  getUserById,
  createProfile
} from "../controllers/UserController.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Profile routes (protected)
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.post("/profile", authenticateToken, createProfile);
router.get("/:id", authenticateToken, getUserById);

export default router;