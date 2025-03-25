import express from "express"
import { getGymById, searchGyms, addRating } from '../controllers/GymController.js';
const router = express.Router();

router.get('/search', searchGyms);
router.get('/view/:id', getGymById);
router.post('/:id/rate', addRating);

export default router;