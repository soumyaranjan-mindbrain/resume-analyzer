const prisma = require("../../prisma/client");
const { uploadBufferToCloudinary } = require("../../config/cloudinary.config");
const {
  extractTextFromPdf,
  extractTextFromDocx,
  analyzeResumeText,
  generateCareerRoadmap,
} = require("../../services/resumeAnalysis.service");

const BASE_SKILLS = [
  "node.js",
  "react",
  "mongodb",
  "prisma",
  "express",
  "aws",
  "docker",
  "typescript",
  "python",
  "javascript",
  "sql",
  "html",
  "css",
  "tailwind",
];

async function saveAnalysis(resumeId, analysisData) {
  const data = {
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
    roadmap: analysisData.roadmap,
  };

  return prisma.analysis.upsert({
    where: { resumeId },
    update: data,
    create: {
      resumeId,
      ...data,
    },
  });
}

function fallbackJobMatch(jobDescription, resumeAnalysis) {
  const text = jobDescription.toLowerCase();
  const matchedSkills = BASE_SKILLS.filter((skill) =>
    text.includes(skill) || text.includes(skill.replace(".", ""))
  );
  const jobMatch = Math.min(
    100,
    (resumeAnalysis?.jobsMatched || 0) * 1.2 + matchedSkills.length * 10
  );
  return {
    jobMatch: Math.round(jobMatch),
    matchedSkills,
    recommendedRoles: [
      "Full Stack Developer",
      "Backend Engineer",
      "Software Engineer",
    ],
    aiFeedback: resumeAnalysis?.suggestions || [],
  };
}

const uploadResume = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "File is required" });

    const userId = req.userId || req.user?.id || req.user?._id;
    console.log("[Upload] userId:", userId, "| file:", file.originalname);

    if (!userId) {
      return res.status(401).json({ error: "User ID not found in token" });
    }

    // Step 1: Extract text from buffer BEFORE uploading to Cloudinary
    const isDocx = file.originalname.toLowerCase().endsWith(".docx");
    let extractedText = "";
    console.log(`[Upload] Starting extraction for ${file.originalname} (${file.size} bytes). Type: ${isDocx ? 'DOCX' : 'PDF'}`);
    
    try {
      extractedText = isDocx
        ? await extractTextFromDocx(file.buffer)
        : await extractTextFromPdf(file.buffer);
      
      console.log(`[Upload] Extraction complete. Text length: ${extractedText?.length || 0}`);
      if (extractedText) {
        console.log(`[Upload] Sample text: "${extractedText.substring(0, 50)}..."`);
      }
    } catch (extractErr) {
      console.error("[Upload] Text extraction failed:", extractErr.message);
    }

    // Step 2: Upload buffer to Cloudinary
    let fileUrl = "";
    try {
      const cloudResult = await uploadBufferToCloudinary(file.buffer, file.originalname);
      fileUrl = cloudResult.secure_url;
    } catch (cloudErr) {
      console.error("[Upload] Cloudinary upload failed:", cloudErr.message);
      return res.status(500).json({ error: "File upload to cloud failed: " + cloudErr.message });
    }

    // Step 3: Save resume to database
    const resume = await prisma.resume.create({
      data: {
        userId: userId,
        fileUrl: fileUrl,
        fileName: file.originalname,
        extractedText: extractedText,
      },
    });

    // Step 4: AI Analysis
    let analysisData;
    try {
      if (extractedText) {
        analysisData = await analyzeResumeText(extractedText);
        
        // Step 4.5: Generate Career Roadmap
        console.log("[Upload] Generating Career Roadmap...");
        try {
          const roadmap = await generateCareerRoadmap(analysisData);
          analysisData.roadmap = roadmap;
        } catch (roadmapErr) {
          console.error("[Upload] Roadmap generation failed:", roadmapErr.message);
          analysisData.roadmap = null;
        }
      } else {
        throw new Error("No text extracted from resume");
      }
    } catch (analysisError) {
      console.error("[Upload] Analysis failed:", analysisError.message);
      // Transparent error reporting
      analysisData = {
        atsScore: 0,
        keywordsMissing: [],
        jobsMatched: 0,
        suggestions: [
          `⚠️ Analysis Error: ${analysisError.message}`,
          "Please ensure your PDF is not a scanned image and contains readable text.",
          "Check your internet connection and try again."
        ],
        trends: [],
        summary: "Analysis failed due to technical issues.",
        skillsExtracted: [],
        experienceLevel: "N/A",
        topStrengths: [],
        weaknesses: [],
      };
    }

    await saveAnalysis(resume.id, analysisData);

    console.log("[Upload SUCCESS] Resume saved:", resume.id);
    res.json({ success: true, resume: { ...resume, extractedText }, analysis: analysisData });
  } catch (err) {
    console.error("[Upload ERROR]", err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
};

const matchResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    if (!resumeId || !jobDescription) {
      return res.status(400).json({ error: "resumeId and jobDescription are required" });
    }

    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: req.userId },
      include: { analysis: true },
    });
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    res.json({ success: true, resumeId, ...fallbackJobMatch(jobDescription, resume.analysis) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getResumeFeedback = async (req, res) => {
  try {
    const { resumeId } = req.query;
    if (!resumeId) return res.status(400).json({ error: "resumeId query parameter is required" });

    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: req.userId },
      include: { analysis: true },
    });
    if (!resume || !resume.analysis) return res.status(404).json({ error: "Analysis not available" });

    res.json({
      success: true,
      resumeId,
      atsScore: resume.analysis.atsScore,
      keywordsMissing: resume.analysis.keywordsMissing,
      jobsMatched: resume.analysis.jobsMatched,
      aiFeedback: resume.analysis.suggestions,
      skillExtraction: resume.analysis.trends,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const reanalyzeResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    if (!resumeId || !jobDescription) {
      return res.status(400).json({ error: "resumeId and jobDescription are required" });
    }

    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: req.userId },
      include: { analysis: true },
    });
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    let extractedText = resume.extractedText;
    if (!extractedText) {
      const isDocx = resume.fileUrl.toLowerCase().endsWith(".docx");
      extractedText = isDocx
        ? await extractTextFromDocx(resume.fileUrl) // Note: Docx extraction might need a buffer, but re-analyzing might need a download if buffer is gone
        : await extractTextFromPdf(resume.fileUrl);

      await prisma.resume.update({ where: { id: resume.id }, data: { extractedText } });
    }

    let analysisData;
    try {
      analysisData = await analyzeResumeText(`${extractedText}\n\nJob Description:\n${jobDescription}`);
      
      // Generate Roadmap for the combined context if needed, or just standard roadmap
      console.log("[Reanalyze] Generating Career Roadmap...");
      try {
        const roadmap = await generateCareerRoadmap(analysisData);
        analysisData.roadmap = roadmap;
      } catch (roadmapErr) {
        console.error("[Reanalyze] Roadmap generation failed:", roadmapErr.message);
      }
    } catch (analysisError) {
      analysisData = {
        atsScore: 0,
        keywordsMissing: [],
        jobsMatched: 0,
        suggestions: [analysisError.message],
        trends: [],
        summary: "",
        skillsExtracted: [],
        experienceLevel: "Unknown",
        topStrengths: [],
        weaknesses: [],
      };
    }

    await saveAnalysis(resume.id, analysisData);
    res.json({ success: true, resumeId, analysis: analysisData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMyResumes = async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.userId },
      include: { analysis: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, count: resumes.length, resumes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await prisma.resume.findFirst({
      where: { id, userId: req.userId },
      include: { analysis: true },
    });
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId || req.user?.id || req.user?._id;
    
    console.log(`[Delete Operation] Initiated for Resume ID: ${id} by User ID: ${userId}`);
    
    if (!id) {
      return res.status(400).json({ error: "Missing resume ID" });
    }

    // 1. Find the resume first to verify ownership
    const resume = await prisma.resume.findFirst({ 
      where: { 
        id: id, 
        userId: userId 
      } 
    });

    if (!resume) {
      console.warn(`[Delete FAIL] Resume ${id} not found or unauthorized for user ${userId}`);
      return res.status(404).json({ error: "Resume not found or you don't have permission to delete it" });
    }

    // 2. Delete associated analysis records first
    const deletedAnalysis = await prisma.analysis.deleteMany({ 
      where: { resumeId: id } 
    });
    console.log(`[Delete Info] Cleaned up ${deletedAnalysis.count} associated analysis records.`);

    // 3. Delete the resume
    await prisma.resume.delete({ 
      where: { id: id } 
    });
    
    console.log(`[Delete SUCCESS] Successfully removed resume ${id} and all related data.`);
    res.json({ success: true, message: "Resume and analysis deleted successfully" });

  } catch (err) {
    console.error(`[Delete CRITICAL ERROR] Failed to delete resume ${req.params.id}:`, err);
    res.status(500).json({ 
      error: "Failed to delete resume", 
      details: err.message,
      code: "DELETE_FAILED"
    });
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
