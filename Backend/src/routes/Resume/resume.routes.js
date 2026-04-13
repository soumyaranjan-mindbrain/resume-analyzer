const express = require("express");
const multer = require("multer");

const {
  uploadResume,
  matchResume,
  getResumeFeedback,
  reanalyzeResume,
  getMyResumes,
  getResumeById,
  deleteResume,
} = require("../../controllers/Resume/resume.controller.v2");

const { analyzeResume } = require("../../controllers/Analysis/analysis.controller.v2");
const { authMiddleware } = require("../../middleware/authmiddleware");

const router = express.Router();

// Use memoryStorage so req.file.buffer is available for text extraction
const upload = multer({ storage: multer.memoryStorage() });

// Routes
router.post("/upload", authMiddleware, upload.single("file"), uploadResume);
router.post("/analyze", authMiddleware, analyzeResume);
router.post("/reanalyze", authMiddleware, reanalyzeResume);
router.post("/match", authMiddleware, matchResume);
router.get("/feedback", authMiddleware, getResumeFeedback);
router.get("/my-resumes", authMiddleware, getMyResumes);
router.get("/:id", authMiddleware, getResumeById);
router.delete("/:id", authMiddleware, deleteResume);

module.exports = router;
