const express = require("express");
const router = express.Router();
const configController = require("../../controllers/Config/config.controller");
const { protect, admin } = require("../../middleware/auth-middleware");

// Public route to check maintenance status
router.get("/", configController.getConfig);

// Real-time config stream via SSE
router.get("/stream", configController.streamConfig);

// Admin only route to update maintenance status
router.put("/", protect, admin, configController.updateConfig);

module.exports = router;
