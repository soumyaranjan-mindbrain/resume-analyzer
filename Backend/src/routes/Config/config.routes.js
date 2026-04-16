const express = require("express");
const router = express.Router();
const configController = require("../../controllers/Config/config.controller");
const { protect, admin } = require("../../middleware/authMiddleware");

// Public route to check maintenance status
router.get("/", configController.getConfig);

// Admin only route to update maintenance status
router.put("/", protect, admin, configController.updateConfig);

module.exports = router;
