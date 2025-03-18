import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  createProfile,
  getUserDashboard,
  updateProfile
} from "../controllers/UserController.js";
import upload from "../middleware/upload.js";
import { validateUser } from "../middleware/validationMiddleware.js";

const router = express.Router();


router.post("/register", upload.single('profileImage'), validateUser, registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.post("/profile", authenticateToken, createProfile);
router.get("/verify", authenticateToken, (req, res) => {
  res.json({ valid: true });
});
router.get('/dashboard', authenticateToken, getUserDashboard);
router.patch('/update', authenticateToken, updateProfile);

export default router;