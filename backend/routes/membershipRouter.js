import express from "express";
import { enrollUserToGym, getGymMembers } from "../controllers/MembershipController.js";

const router = express.Router();

router.post("/enroll", enrollUserToGym);  
router.get("/gym-members/:gymId", getGymMembers); 

export default router;
