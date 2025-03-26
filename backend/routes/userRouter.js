import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/UserController.js";
import upload from "../middleware/upload.js";
import { validateUser } from "../middleware/goerValidationMiddleware.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { generateInvoice } from "../controllers/InvoiceController.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("profileImage"),
  validateUser,
  registerUser
);
router.get("/verify", authenticateToken, (req, res) => {
  res.json({ valid: true });
});


router.get("/invoice/:membershipId", generateInvoice);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
