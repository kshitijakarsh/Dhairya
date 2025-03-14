import express from "express"
import { registerGym, getMyGyms, updateGym, getGymById, searchGyms, addRating, deleteGym } from '../controllers/GymController.js';
import { authenticateOwner, authenticateToken } from '../middleware/authMiddleware.js';
import { validateGym, validateGymUpdate } from "../middleware/validationMiddleware.js";

// Debug log to confirm route registration
console.log('Registering gym routes...');

// Routes
const router = express.Router();

// Public routes
router.get('/search', searchGyms);
router.get('/view/:id', getGymById);

// Protected routes - require authentication
router.use(authenticateToken);

// Owner-specific routes
router.post('/register', authenticateOwner, validateGym, registerGym);
router.get('/my-gyms', authenticateOwner, getMyGyms);
router.put('/:id', authenticateOwner, validateGymUpdate, updateGym);
router.delete('/:id', authenticateOwner, deleteGym);

// User routes
router.post('/:id/rate', addRating);

export default router;