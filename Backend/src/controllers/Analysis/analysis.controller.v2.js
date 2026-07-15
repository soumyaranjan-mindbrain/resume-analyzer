const Resume = require("../../models/Resume");
const User = require("../../models/User");
const Analysis = require("../../models/Analysis");
const {
  analyzeResumeText,
  extractTextFromPdf,
  generateCareerRoadmap,
} = require("../../services/resumeAnalysis.service");

const analyzeResume = async (req, res) => {
  try {
    const { resumeId } = req.body;
    if (!resumeId) return res.status(400).json({ error: "resumeId is required" });

    const userId = req.userId || req.user?.id;
    const resume = await Resume.findOne({ _id: resumeId, userId: userId });

    if (!resume) {
      console.warn(`[Analysis] Resume not found or unauthorized: ${resumeId}`);
      return res.status(404).json({ error: "Resume not found" });
    }

    console.log(`[Analysis] Starting fresh analysis for resume: ${resumeId}`);

    let extractedText = resume.extractedText;
    if (!extractedText) {
      extractedText = await extractTextFromPdf(resume.fileUrl);
      if (extractedText) {
        await Resume.findByIdAndUpdate(resume._id, { extractedText });
      }
    }

    if (!extractedText) {
      return res.status(400).json({ error: "Could not extract text from resume for analysis." });
    }

    // Allow dynamic overrides from the request body (set by the frontend modal)
    const { targetRole: dynamicRole, userType: dynamicUserType, yearsOfExperience: dynamicExp } = req.body;

    const user = await User.findById(userId, 'userType targetRole yearsOfExperience').lean();

    const analysisData = await analyzeResumeText(extractedText, null, {
      userType: dynamicUserType || user?.userType,
      targetRole: dynamicRole || user?.targetRole,
      yearsOfExperience: dynamicExp || user?.yearsOfExperience
    });

    // Generate career roadmap
    let roadmap = null;
    try {
      roadmap = await generateCareerRoadmap(analysisData);
      analysisData.roadmap = roadmap;
    } catch (roadmapErr) {
      console.warn("[Analysis] Roadmap generation failed:", roadmapErr.message);
    }

    console.log(`[Analysis] AI returned score: ${analysisData.atsScore}`);

    const updateFields = {
      atsScore: analysisData.atsScore,
      scoreBreakdown: analysisData.scoreBreakdown || {},
      keywordsMissing: analysisData.keywordsMissing,
      jobsMatched: analysisData.jobsMatched,
      suggestions: analysisData.suggestions,
      trends: analysisData.trends,
      summary: analysisData.summary,
      experienceLevel: analysisData.experienceLevel,
      topStrengths: analysisData.topStrengths,
      weaknesses: analysisData.weaknesses,
      roadmap: roadmap,
    };

    const analysis = await Analysis.findOneAndUpdate(
      { resumeId },
      updateFields,
      { new: true, upsert: true }
    );

    const analysisObj = analysis.toObject();
    analysisObj.id = analysisObj._id.toString();

    res.json({
      success: true,
      ...analysisObj,
      ...analysisData,
      extractedText,
      skillExtraction: analysisData.skillsExtracted,
    });
  } catch (err) {
    console.error("[Analysis Error]", err.message);
    if (err.message?.includes("Validation Error:")) {
      return res.status(400).json({ error: err.message.replace("Validation Error:", "").trim() });
    }
    res.status(500).json({ error: err.message });
  }
};

module.exports = { analyzeResume };
