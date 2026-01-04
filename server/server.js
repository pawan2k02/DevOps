import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

// 1. Middlewares
app.use(express.json()); 
app.use(cookieParser()); 

// 2. Database Connection
connectDB();

// 3. API Routes
app.use("/api/v1/auth", userRoutes);  
app.use("/api/v1/tasks", taskRoutes); 

// 4. Default Route
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "PostgreSQL CRUD API is running... Abhishek"
  })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});