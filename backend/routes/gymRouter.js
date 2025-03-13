import express from "express"
import { registerGym, getMyGyms, updateGym, getGymById, searchGyms } from '../controllers/GymController.js';
import { authenticateOwner, authenticateToken } from '../middleware/authMiddleware.js';
import { validateGym } from "../middleware/validationMiddleware.js";

// Debug log to confirm route registration
console.log('Registering gym routes...');

// Routes
const router = express.Router();

// Public routes
router.get('/search', searchGyms);
router.get('/view/:id', getGymById);

// Protected routes
router.post('/register', authenticateOwner, validateGym, registerGym);
router.get('/my-gyms', authenticateOwner, getMyGyms);
router.put('/:id', authenticateOwner, updateGym);
router.get('/:id', authenticateOwner, getGymById);

export default router;