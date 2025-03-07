import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
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
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.post("/profile", authenticateToken, createProfile);
router.get("/verify", authenticateToken, (req, res) => {
  res.json({ valid: true });
});
router.get("/:id", authenticateToken, getUserById);
router.get('/dashboard', authenticateToken, getUserDashboard);
router.post('/dashboard', authenticateToken, createUserDashboard);

export default router;