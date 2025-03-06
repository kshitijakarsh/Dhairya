import express from "express"
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  updateProfile,
  getProfile,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  logoutUser,
  refreshToken,
  changePassword
} from "../controllers/UserController.js";

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh-token', refreshToken);

// Profile routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);

// User management routes
router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

export default router;