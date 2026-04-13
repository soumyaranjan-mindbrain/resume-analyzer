const prisma = require("../../prisma/client");
const {
  analyzeResumeText,
  extractTextFromPdf,
} = require("../../services/resumeAnalysis.service");

const analyzeResume = async (req, res) => {
  try {
    const { resumeId } = req.body;
    if (!resumeId) return res.status(400).json({ error: "resumeId is required" });

    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: req.userId },
    });
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const extractedText = resume.extractedText || (await extractTextFromPdf(resume.fileUrl));
    if (!resume.extractedText) {
      await prisma.resume.update({ where: { id: resume.id }, data: { extractedText } });
    }

    const analysisData = await analyzeResumeText(extractedText);
    const analysis = await prisma.analysis.upsert({
      where: { resumeId },
      update: {
        atsScore: analysisData.atsScore,
        keywordsMissing: analysisData.keywordsMissing,
        jobsMatched: analysisData.jobsMatched,
        suggestions: analysisData.suggestions,
        trends: analysisData.trends,
      },
      create: {
        resumeId,
        atsScore: analysisData.atsScore,
        keywordsMissing: analysisData.keywordsMissing,
        jobsMatched: analysisData.jobsMatched,
        suggestions: analysisData.suggestions,
        trends: analysisData.trends,
      },
    });

    res.json({
      ...analysis,
      ...analysisData,
      extractedText,
      skillExtraction: analysisData.skillsExtracted,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { analyzeResume };
