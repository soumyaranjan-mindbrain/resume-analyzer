const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../../middleware/auth-middleware");

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs
} = require("../../controllers/Jobs/job.controller");

// Public
router.get("/", getJobs);
router.get("/user/my-jobs", authMiddleware, getMyJobs);
router.get("/:id", getJobById);

// Protected
router.post("/", authMiddleware, createJob);
router.put("/:id", authMiddleware, updateJob);
router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;
