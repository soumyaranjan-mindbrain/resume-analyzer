// routes/profile.routes.js
const express = require("express");
const router = express.Router();
const { createProfile, updateProfile } = require("../../controllers/Profile/profile.controller");
const { authMiddleware } = require("../../middleware/authmiddleware");

// Create profile
router.post("/", createProfile);

// Update profile (requires login)
router.put("/:id", authMiddleware, updateProfile);

module.exports = router;