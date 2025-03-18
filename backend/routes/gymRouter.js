import express from "express"
import { registerGym, getMyGyms, updateGym, getGymById, searchGyms, addRating, deleteGym } from '../controllers/GymController.js';
import { authenticateOwner, authenticateToken } from '../middleware/authMiddleware.js';
import { validateGym, validateGymUpdate } from "../middleware/validationMiddleware.js";
const router = express.Router();

router.get('/search', searchGyms);
router.get('/view/:id', getGymById);

router.use(authenticateToken);

router.post('/register', 
    authenticateOwner, 
    upload.array('images', 5),
    validateGym, 
    registerGym
  );  
router.get('/my-gyms', authenticateOwner, getMyGyms);
router.put('/:id', authenticateOwner, validateGymUpdate, updateGym);
router.delete('/:id', authenticateOwner, deleteGym);

router.post('/:id/rate', addRating);

export default router;