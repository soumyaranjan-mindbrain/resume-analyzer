const Resume = require("../../models/Resume");
const Analysis = require("../../models/Analysis");
const { emitEvent } = require("../../utils/socket");

//  Upload Resume
const uploadResume = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }

    const resume = await Resume.create({
      userId: req.userId,
      fileUrl: file.path,
      fileName: file.originalname,
    });

    const resumeObj = resume.toObject();
    resumeObj.id = resumeObj._id.toString();

    //   Create default analysis
    const analysis = await Analysis.create({
      resumeId: resumeObj.id,
      atsScore: 0,
      keywordsMissing: [],
      jobsMatched: 0,
      suggestions: [],
      trends: [],
    });

    const analysisObj = analysis.toObject();
    analysisObj.id = analysisObj._id.toString();

    emitEvent("analysis_completed", { resumeId: resumeObj.id, userId: req.userId, atsScore: 0 });

    res.json({ success: true, resume: resumeObj });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//   Match Resume
const matchResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        error: "resumeId and jobDescription are required",
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.userId,
    }).lean();

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    resume.id = resume._id.toString();
    resume.analysis = await Analysis.findOne({ resumeId: resume._id }).lean();

    const text = jobDescription.toLowerCase();

    const knownSkills = [
      "node.js",
      "react",
      "mongodb",
      "prisma",
      "express",
      "aws",
      "docker",
      "typescript",
      "python",
    ];

    const matchedSkills = knownSkills.filter(
      (skill) =>
        text.includes(skill) || text.includes(skill.replace(".", ""))
    );

    const jobMatchScore = Math.min(
      100,
      (resume.analysis?.jobsMatched || 0) * 1.2 +
      matchedSkills.length * 10
    );

    res.json({
      success: true,
      resumeId,
      jobMatch: Math.round(jobMatchScore),
      matchedSkills,
      recommendedRoles: [
        "Full Stack Developer",
        "Backend Engineer",
        "Software Engineer",
      ],
      aiFeedback: resume.analysis?.suggestions || [],
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//   Get Resume Feedback
const getResumeFeedback = async (req, res) => {
  try {
    const { resumeId } = req.query;

    if (!resumeId) {
      return res.status(400).json({
        error: "resumeId query parameter is required",
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.userId,
    }).lean();

    if (!resume) {
      return res.status(404).json({
        error: "Analysis not available",
      });
    }
    resume.id = resume._id.toString();
    resume.analysis = await Analysis.findOne({ resumeId: resume._id }).lean();

    if (!resume.analysis) {
      return res.status(404).json({
        error: "Analysis not available",
      });
    }

    const analysis = resume.analysis;

    res.json({
      success: true,
      resumeId,
      atsScore: analysis.atsScore,
      keywordsMissing: analysis.keywordsMissing,
      jobsMatched: analysis.jobsMatched,
      aiFeedback: analysis.suggestions,
      skillExtraction: analysis.trends,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Reanalyze Resume
const reanalyzeResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        error: "resumeId and jobDescription are required",
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.userId,
    }).lean();

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    resume.id = resume._id.toString();
    resume.analysis = await Analysis.findOne({ resumeId: resume._id }).lean();

    const text = jobDescription.toLowerCase();

    const knownSkills = [
      "node.js",
      "react",
      "mongodb",
      "prisma",
      "express",
      "aws",
      "docker",
      "typescript",
      "python",
    ];

    const matchedSkills = knownSkills.filter(
      (skill) =>
        text.includes(skill) || text.includes(skill.replace(".", ""))
    );

    const missingSkills = knownSkills.filter(
      (skill) => !matchedSkills.includes(skill)
    );

    const atsScore = Math.min(100, matchedSkills.length * 12);

    const feedback = missingSkills.length
      ? [`Add skills: ${missingSkills.slice(0, 3).join(", ")}`]
      : ["Great match!"];

    let updatedAnalysis;

    if (resume.analysis) {
      updatedAnalysis = await Analysis.findByIdAndUpdate(
        resume.analysis._id,
        {
          atsScore,
          keywordsMissing: missingSkills,
          jobsMatched: matchedSkills.length,
          suggestions: feedback,
          trends: matchedSkills,
        },
        { new: true }
      );
    } else {
      updatedAnalysis = await Analysis.create({
        resumeId,
        atsScore,
        keywordsMissing: missingSkills,
        jobsMatched: matchedSkills.length,
        suggestions: feedback,
        trends: matchedSkills,
      });
    }

    emitEvent("analysis_completed", { resumeId, userId: req.user.id, atsScore });

    res.json({
      success: true,
      resumeId,
      atsScore,
      matchedSkills,
      missingSkills,
      feedback,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📄 Get All Resumes
const getMyResumes = async (req, res) => {
  try {
    const resumesDoc = await Resume.find({ userId: req.userId }).sort({ createdAt: -1 });
    const resumes = await Promise.all(resumesDoc.map(async (r) => {
      const analysis = await Analysis.findOne({ resumeId: r._id }).lean();
      return {
        ...r.toObject(),
        id: r._id.toString(),
        analysis: analysis ? { ...analysis, id: analysis._id.toString() } : null
      };
    }));

    res.json({
      success: true,
      count: resumes.length,
      resumes,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📄 Get Resume by ID
const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await Resume.findOne({
      _id: id,
      userId: req.userId,
    }).lean();

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    resume.id = resume._id.toString();

    const analysis = await Analysis.findOne({ resumeId: resume._id }).lean();
    resume.analysis = analysis ? { ...analysis, id: analysis._id.toString() } : null;

    res.json({ success: true, resume });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑 Delete Resume
const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await Resume.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    await Analysis.deleteMany({
      resumeId: id,
    });

    await Resume.findByIdAndDelete(id);

    emitEvent("resume_deleted", { id, userId: req.userId });

    res.json({
      success: true,
      message: "Resume deleted successfully",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  uploadResume,
  matchResume,
  getResumeFeedback,
  reanalyzeResume,
  getMyResumes,
  getResumeById,
  deleteResume,
};