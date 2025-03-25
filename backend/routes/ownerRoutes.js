import express from "express"
import cloudinary from "../utils/cloudinary.js";
import upload from "../middleware/upload.js";
import { registerGym, getGymStats, getMyGyms, updateGym, deleteGym } from "../controllers/OwnerController.js"
import { validateGym, validateGymUpdate } from "../middleware/gymValidationMiddleware.js";
import { authenticateOwner, authenticateToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.use(authenticateToken);

router.post(
  '/register',
  authenticateOwner,
  upload.array('images', 5), 
  validateGym,
  registerGym
);

router.get('/dash', authenticateOwner, getGymStats);
router.get('/my-gyms', authenticateOwner, getMyGyms);
router.put('/:id', authenticateOwner, validateGymUpdate, updateGym);
router.delete('/:id', authenticateOwner, deleteGym);

export default router;