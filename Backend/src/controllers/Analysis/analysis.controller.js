const Analysis = require("../../models/Analysis");

const analyzeResume = async (req, res) => {
  try {
    const { resumeId } = req.body;

    const atsScore = Math.floor(Math.random() * 100);
    const keywordsMissing = Math.floor(Math.random() * 50);
    const jobsMatched = Math.floor(Math.random() * 50);
    const aiFeedback = [
      "Use more action verbs in the experience section.",
      "Include measurable achievements for each project.",
      "Match keywords exactly from the job description."
    ];
    const skillsExtracted = [
      "Node.js",
      "Express",
      "MongoDB",
      "Prisma"
    ];

    const analysis = await Analysis.create({
      resumeId,
      atsScore,
      keywordsMissing,
      jobsMatched,
      suggestions: aiFeedback,
      trends: skillsExtracted
    });

    const analysisObj = analysis.toObject();
    analysisObj.id = analysisObj._id.toString();

    res.json({
      ...analysisObj,
      aiFeedback,
      skillExtraction: skillsExtracted,
      jobMatch: jobsMatched
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { analyzeResume };