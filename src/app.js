import express from "express";
import cors from "cors";
import morgan from "morgan";
import pool from "./config/db.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/create-user-test", async (req, res) => {
  try {

    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *",
      ["test@gmail.com", "hashedpassword"]
    );

    res.json(result.rows[0]);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
});

export default app;