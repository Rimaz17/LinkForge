import app from "./app.js";
import dotenv from "dotenv";
import pool from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const DB_MAX_RETRIES = Number(process.env.DB_MAX_RETRIES || 15);
const DB_RETRY_DELAY_MS = Number(process.env.DB_RETRY_DELAY_MS || 2000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectWithRetry() {
  for (let attempt = 1; attempt <= DB_MAX_RETRIES; attempt += 1) {
    try {
      await pool.query("SELECT 1");
      console.log("Connected to PostgreSQL");
      return;
    } catch (err) {
      const isLastAttempt = attempt === DB_MAX_RETRIES;

      console.error(
        `DB connection attempt ${attempt}/${DB_MAX_RETRIES} failed: ${err.message}`
      );

      if (isLastAttempt) {
        throw err;
      }

      await sleep(DB_RETRY_DELAY_MS);
    }
  }
}

connectWithRetry()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error after retries:", err);
    process.exit(1);
  });