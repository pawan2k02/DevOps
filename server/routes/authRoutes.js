import express from "express";
import {
  getUser, 
  loginUser,
  registerUser,
  logoutUser,
  deleteUser,
} from "../controllers/userController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// --- Public Routes ---
router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/logout", verifyToken, logoutUser);

// --- Admin Only Routes ---
router.get("/all-users", verifyToken, isAdmin, getUser);

// User delete karne ke liye (Admin access)
router.delete("/delete/:id", verifyToken, isAdmin, deleteUser);

export default router;
