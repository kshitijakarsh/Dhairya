import express from "express"
import { registerGym, getMyGyms, updateGym, getGymById } from '../controllers/GymController.js';
import { protect } from '../middleware/authMiddleware.js';

// Debug log to confirm route registration
console.log('Registering gym routes...');

// Routes
const router = express.Router();
router.post('/register', protect, registerGym);
router.get('/my-gyms', protect, getMyGyms);
router.put('/:id', protect, updateGym);
router.get('/:id', protect, getGymById);

export default router;