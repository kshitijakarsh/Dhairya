import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/UserController.js";
import upload from "../middleware/upload.js";
import { validateUser } from "../middleware/goerValidationMiddleware.js";
const router = express.Router();


router.post(
  "/register",
  upload.single('profileImage'),
  validateUser,
  registerUser
);

router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;