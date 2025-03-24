import express from "express"
import { authenticateOwner } from '../middleware/authMiddleware.js';
import { getAllMembers, getTotalRevenue} from "../controllers/OwnerController.js"
const router = express.Router();

router.get('/members', authenticateOwner, getAllMembers);
router.get('/revenue', authenticateOwner, getTotalRevenue);


export default router;