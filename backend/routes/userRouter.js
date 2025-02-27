import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { createUser, loginUser } from '../controllers/UserController.js';

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);


export default router;