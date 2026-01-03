import express from "express";
import {
  createTask,
  readAllTasks,
  readSingleTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, createTask);
router.get("/", verifyToken, readAllTasks);
router.get("/:id", verifyToken, readSingleTask);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);

export default router;
