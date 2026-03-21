import express from "express";
import cors from "cors";
import morgan from "morgan";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// DB test
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "DB working",
      time: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/urls", urlRoutes);

export default app;