import express from "express";
import { createShortUrl, getUserUrls, redirectUrl } from "../controllers/urlController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// list user URLs (protected)
router.get("/", authMiddleware, getUserUrls);

// create short URL (protected)
router.post("/", authMiddleware, createShortUrl);

// redirect (public)
router.get("/:shortCode", redirectUrl);

export default router;