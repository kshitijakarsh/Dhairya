import express from "express";
import { enrollUserToGym, getGymMembers } from "../controllers/MembershipController.js";
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/enroll", authenticateToken, enrollUserToGym);  
router.get("/gym-members/:gymId", getGymMembers); 

export default router;
