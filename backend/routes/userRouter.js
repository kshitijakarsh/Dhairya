import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { createUser } from '../controllers/UserController.js';

const router = express.Router();

router.post("/", authMiddleware, createUser);

export default router;