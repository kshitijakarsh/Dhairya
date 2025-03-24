import express from "express"
import { authenticateOwner } from '../middleware/authMiddleware.js';
import { getGymStats } from "../controllers/OwnerController.js"
const router = express.Router();

router.get('/dash', authenticateOwner, getGymStats);

export default router;