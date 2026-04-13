const express = require('express');
const { getDashboard, getAnalytics, getReports, getSkillInsights } = require("../../controllers/Dashboard/dashboard.controller");
const { authMiddleware } = require("../../middleware/authmiddleware");

const router = express.Router();

router.get("/", authMiddleware, getDashboard);
router.get("/analytics", authMiddleware, getAnalytics);
router.get("/reports", authMiddleware, getReports);
router.get("/insights", authMiddleware, getSkillInsights);

module.exports = router;