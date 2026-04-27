const prisma = require("../../prisma/client");
const {
  analyzeResumeText,
  extractTextFromPdf,
} = require("../../services/resumeAnalysis.service");

const analyzeResume = async (req, res) => {
  try {
    const { resumeId } = req.body;
    if (!resumeId) return res.status(400).json({ error: "resumeId is required" });

    const userId = req.userId || req.user?.id;
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: userId },
    });

    if (!resume) {
      console.warn(`[Analysis] Resume not found or unauthorized: ${resumeId}`);
      return res.status(404).json({ error: "Resume not found" });
    }

    console.log(`[Analysis] Starting fresh analysis for resume: ${resumeId}`);

    const extractedText = resume.extractedText || (await extractTextFromPdf(resume.fileUrl));
    if (!resume.extractedText && extractedText) {
      await prisma.resume.update({ where: { id: resume.id }, data: { extractedText } });
    }

    if (!extractedText) {
      return res.status(400).json({ error: "Could not extract text from resume for analysis." });
    }

    // Force fresh AI analysis
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { userType: true, targetRole: true, yearsOfExperience: true }
    });

    const analysisData = await analyzeResumeText(extractedText, null, {
      userType: user?.userType,
      targetRole: user?.targetRole,
      yearsOfExperience: user?.yearsOfExperience
    });



    console.log(`[Analysis] AI returned score: ${analysisData.atsScore}`);

    const analysis = await prisma.analysis.upsert({
      where: { resumeId },
      update: {
        atsScore: analysisData.atsScore,
        keywordsMissing: analysisData.keywordsMissing,
        jobsMatched: analysisData.jobsMatched,
        suggestions: analysisData.suggestions,
        trends: analysisData.trends,
        summary: analysisData.summary,
        experienceLevel: analysisData.experienceLevel,
        topStrengths: analysisData.topStrengths,
        weaknesses: analysisData.weaknesses,
      },
      create: {
        resumeId,
        atsScore: analysisData.atsScore,
        keywordsMissing: analysisData.keywordsMissing,
        jobsMatched: analysisData.jobsMatched,
        suggestions: analysisData.suggestions,
        trends: analysisData.trends,
        summary: analysisData.summary,
        experienceLevel: analysisData.experienceLevel,
        topStrengths: analysisData.topStrengths,
        weaknesses: analysisData.weaknesses,
      },
    });

    res.json({
      success: true,
      ...analysis,
      ...analysisData,
      extractedText,
      skillExtraction: analysisData.skillsExtracted,
    });
  } catch (err) {
    console.error("[Analysis Error]", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { analyzeResume };
