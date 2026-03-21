import express from "express";
import { createShortUrl, redirectUrl } from "../controllers/urlController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// create short URL (protected)
router.post("/", authMiddleware, createShortUrl);

// redirect (public)
router.get("/:shortCode", redirectUrl);

export default router;