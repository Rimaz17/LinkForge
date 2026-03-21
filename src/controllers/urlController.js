import pool from "../config/db.js";
import { nanoid } from "nanoid";

// CREATE SHORT URL
export const createShortUrl = async (req, res) => {
  try {
    const { original_url, expires_at } = req.body;

    const shortCode = nanoid(6);

    const result = await pool.query(
      `INSERT INTO urls (original_url, short_code, user_id, expires_at)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        original_url,
        shortCode,
        req.user ? req.user.id : null,
        expires_at || null
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// REDIRECT
export const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const result = await pool.query(
      "SELECT * FROM urls WHERE short_code = $1",
      [shortCode]
    );

    const url = result.rows[0];

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // check expiration
    if (url.expires_at && new Date(url.expires_at) < new Date()) {
      return res.status(410).json({ error: "Link expired" });
    }

    // increment click count
    await pool.query(
      "UPDATE urls SET click_count = click_count + 1 WHERE id = $1",
      [url.id]
    );

    res.redirect(url.original_url);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};