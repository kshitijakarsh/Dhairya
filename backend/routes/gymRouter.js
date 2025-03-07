import express from "express"
import { registerGym, getMyGyms, updateGym, getGymById, searchGyms } from '../controllers/GymController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

// Debug log to confirm route registration
console.log('Registering gym routes...');

// Routes
const router = express.Router();

// Public routes
router.get('/search', searchGyms);
router.get('/view/:id', getGymById);

// Protected routes
router.post('/register', authenticateToken, registerGym);
router.get('/my-gyms', authenticateToken, getMyGyms);
router.put('/:id', authenticateToken, updateGym);
router.get('/:id', authenticateToken, getGymById);

export default router;