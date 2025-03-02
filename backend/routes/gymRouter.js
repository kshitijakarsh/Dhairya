const express = require('express');
const router = express.Router();
const { registerGym, getMyGyms, updateGym, getGymById } = require('../controllers/GymController');
const { protect } = require('../middleware/authMiddleware');

// Debug log to confirm route registration
console.log('Registering gym routes...');

// Routes
router.post('/register', protect, registerGym);
router.get('/my-gyms', protect, getMyGyms);
router.put('/:id', protect, updateGym);
router.get('/:id', protect, getGymById);

module.exports = router; 