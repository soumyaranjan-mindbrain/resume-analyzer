const express = require("express");
const router = express.Router();
const { applyToJob, getMyApplications } = require("../../controllers/Application/application.controller");
const { authMiddleware } = require("../../middleware/authmiddleware");

// Re-using the same auth logic pattern seen in resume.routes or others
// If req.userId is expected, usually there is an auth middleware
router.post("/apply", authMiddleware, applyToJob);
router.get("/my-applications", authMiddleware, getMyApplications);

module.exports = router;
