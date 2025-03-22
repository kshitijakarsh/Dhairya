import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  createProfile,
  getUserDashboard,
  updateProfile
} from "../controllers/GoerController.js";

const router = express.Router();

router.post("/profile", authenticateToken, createProfile);
router.get("/dashboard", authenticateToken, getUserDashboard);
router.patch('/update', authenticateToken, updateProfile);

export default router;
