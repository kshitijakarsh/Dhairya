import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  createProfile,
  getUserDashboard,
} from "../controllers/UserController.js";
import { validateUser } from "../middleware/validationMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", validateUser, registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.post("/profile", authenticateToken, createProfile);
router.get("/verify", authenticateToken, (req, res) => {
  res.json({ valid: true });
});
router.get('/dashboard', authenticateToken, getUserDashboard);

export default router;