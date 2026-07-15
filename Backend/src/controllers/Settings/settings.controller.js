const User = require("../../models/User");
const Resume = require("../../models/Resume");
const Analysis = require("../../models/Analysis");
const Application = require("../../models/Application");
const HelpTicket = require("../../models/HelpTicket");

//   EXPORT DATA
const exportData = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resumes = await Resume.find({ userId }).lean();
    for (let resume of resumes) {
      resume.analysis = await Analysis.findOne({ resumeId: resume._id }).lean();
      resume.id = resume._id.toString();
      if (resume.analysis) {
        resume.analysis.id = resume.analysis._id.toString();
      }
    }
    user.resumes = resumes;
    user.id = user._id.toString();

    res.json({ success: true, data: user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//   IMPORT DATA
const importData = async (req, res) => {
  try {
    const userId = req.userId;
    const data = req.body;

    if (!data || !Array.isArray(data.resumes)) {
      return res.status(400).json({ error: "Invalid import data" });
    }

    for (const resume of data.resumes) {

      //   Prevent duplicates
      const existing = await Resume.findOne({
        userId,
        fileName: resume.fileName,
      });

      if (existing) continue;

      //  Create Resume
      const savedResume = await Resume.create({
        userId,
        fileUrl: resume.fileUrl,
        fileName: resume.fileName,
      });

      //  Create Analysis 
      if (resume.analysis) {
        await Analysis.create({
          resumeId: savedResume._id,
          atsScore: resume.analysis.atsScore || 0,
          scoreBreakdown: resume.analysis.scoreBreakdown || {},
          keywordsMissing: resume.analysis.keywordsMissing || [],
          jobsMatched: resume.analysis.jobsMatched || 0,
          suggestions: resume.analysis.suggestions || [],
          trends: resume.analysis.trends || [],
        });
      }
    }

    res.json({
      success: true,
      message: "Data imported successfully",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔄 RESET SETTINGS
const resetSettings = async (req, res) => {
  try {
    const userId = req.userId;

    await User.findByIdAndUpdate(userId, {
      bio: null,
      phone: null,
    });

    res.json({
      success: true,
      message: "Settings reset to default",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🚨 DELETE ALL DATA
const deleteAllData = async (req, res) => {
  try {
    const userId = req.userId;
    const role = req.user?.role;

    if (role === 'admin') {
      // 🚨 ADMIN PURGE: Delete EVERYTHING related to students
      await Analysis.deleteMany({});
      await Application.deleteMany({});
      await HelpTicket.deleteMany({});
      await Resume.deleteMany({});

      // Keep admins, delete students
      await User.deleteMany({ role: 'student' });

      return res.json({
        success: true,
        message: "Platform has been purged. All students, resumes, and reports deleted."
      });
    }

    // STUDENT: Delete only their own data
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const resumes = await Resume.find({ userId }, '_id').lean();
    const resumeIds = resumes.map((r) => r._id);

    // Delete related analysis
    await Analysis.deleteMany({
      resumeId: { $in: resumeIds },
    });

    // Delete related applications
    await Application.deleteMany({ userId });

    // Delete related help tickets
    await HelpTicket.deleteMany({ userId });

    // Delete resumes
    await Resume.deleteMany({ userId });

    // Reset user profile fields
    await User.findByIdAndUpdate(userId, {
      bio: null,
      phone: null,
      github: null,
      twitter: null,
      linkedin: null
    });

    res.json({
      success: true,
      message: "All account data deleted successfully",
    });

  } catch (err) {
    console.error(`[Delete All Data Error]:`, err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  exportData,
  importData,
  resetSettings,
  deleteAllData,
};
