const Job = require("../../models/Job");
const Application = require("../../models/Application");
const User = require("../../models/User");
const { emitEvent } = require("../../utils/socket");
const { extractTextFromPdf, extractTextFromDocx } = require("../../services/resumeAnalysis.service");

//   Create Job
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, description, type, experience, requirements, responsibilities, tags, salary, jdSource, jdText } = req.body;

    let finalDescription = description || jdText || "";
    let finalJdText = jdText || "";

    if (req.file) {
      const { buffer, originalname } = req.file;
      try {
        if (originalname.toLowerCase().endsWith(".pdf")) {
          finalJdText = await extractTextFromPdf(buffer);
        } else if (originalname.toLowerCase().endsWith(".docx")) {
          finalJdText = await extractTextFromDocx(buffer);
        }

        // If finalDescription was empty, use extracted text
        if (!finalDescription) finalDescription = finalJdText;
      } catch (err) {
        console.error("JD Extraction failed:", err.message);
      }
    }

    const job = await Job.create({
      title,
      company,
      location,
      description: finalDescription,
      type: type || "Full-time",
      experience,
      requirements,
      responsibilities,
      skillsRequired: tags || [], // frontend sends 'tags'
      salary,
      userId: req.userId || req.user?.id || req.user?._id,
      jdSource: jdSource || (req.file ? "FILE" : "MANUAL"),
      jdText: finalJdText || finalDescription
    });

    const jobObj = job.toObject();
    jobObj.id = jobObj._id.toString();

    res.status(201).json(jobObj);
    emitEvent("job_updated", { action: "create", id: jobObj.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//   Get All Jobs  
exports.getJobs = async (req, res) => {
  try {
    const { search, skill } = req.query;
    const currentUserId = req.userId || req.user?.id || req.user?._id;
    const isValidId = currentUserId && /^[0-9a-fA-F]{24}$/.test(currentUserId);

    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } }
      ];
    }
    if (skill) {
      query.skillsRequired = skill;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 }).lean();

    const jobsWithStatus = await Promise.all(jobs.map(async (j) => {
      const appCount = await Application.countDocuments({ jobId: j._id });
      let isApplied = false;
      let userApps = [];
      if (isValidId) {
        userApps = await Application.find({ jobId: j._id, userId: currentUserId }, '_id').lean();
        isApplied = userApps.length > 0;
      }
      return {
        ...j,
        id: j._id.toString(),
        _count: {
          applications: appCount
        },
        applications: userApps.map(a => ({ id: a._id.toString() })),
        isApplied
      };
    }));

    res.json(jobsWithStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//   Get Single Job
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('userId', 'name email').lean();

    if (!job) return res.status(404).json({ message: "Job not found" });

    const appCount = await Application.countDocuments({ jobId: job._id });

    const formattedJob = {
      ...job,
      id: job._id.toString(),
      user: job.userId ? { name: job.userId.name, email: job.userId.email } : null,
      userId: job.userId ? job.userId._id.toString() : null,
      _count: {
        applications: appCount
      }
    };

    res.json(formattedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//   Update Job
exports.updateJob = async (req, res) => {
  try {
    const { tags, ...rest } = req.body;
    const data = { ...rest };
    if (tags) data.skillsRequired = tags;

    // Handle JD file update if needed
    if (req.file) {
      const { buffer, originalname } = req.file;
      try {
        let extracted = "";
        if (originalname.toLowerCase().endsWith(".pdf")) {
          extracted = await extractTextFromPdf(buffer);
        } else if (originalname.toLowerCase().endsWith(".docx")) {
          extracted = await extractTextFromDocx(buffer);
        }
        data.jdText = extracted;
        data.jdSource = "FILE";
        if (!data.description) data.description = extracted;
      } catch (err) {
        console.error("JD Extraction failed:", err.message);
      }
    }

    const job = await Job.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });

    const jobObj = job.toObject();
    jobObj.id = jobObj._id.toString();

    res.json(jobObj);
    emitEvent("job_updated", { action: "update", id: jobObj.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//   Delete Job
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Manual Cascade: Delete related applications first
    await Application.deleteMany({ jobId: id });

    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job and related applications deleted successfully" });
    emitEvent("job_updated", { action: "delete", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get My Jobs
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.id }).lean();
    const jobsWithCounts = await Promise.all(jobs.map(async (j) => {
      const appCount = await Application.countDocuments({ jobId: j._id });
      return {
        ...j,
        id: j._id.toString(),
        _count: {
          applications: appCount
        }
      };
    }));

    res.json({ success: true, jobs: jobsWithCounts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggle Hired Status
exports.toggleJobHiredStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    const updatedJob = await Job.findByIdAndUpdate(id, { isHired: !job.isHired }, { new: true });
    const jobObj = updatedJob.toObject();
    jobObj.id = jobObj._id.toString();

    res.json({ success: true, job: jobObj });
    emitEvent("job_updated", { action: "toggle_hired", id: jobObj.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.extractJDText = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { buffer, originalname } = req.file;
    let extractedText = '';

    if (originalname.toLowerCase().endsWith('.pdf')) {
      extractedText = await extractTextFromPdf(buffer);
    } else if (originalname.toLowerCase().endsWith('.docx')) {
      extractedText = await extractTextFromDocx(buffer);
    } else if (originalname.toLowerCase().endsWith('.txt')) {
      extractedText = buffer.toString('utf-8');
    } else {
      return res.status(400).json({ error: 'Invalid file type. Please upload PDF, DOCX, or TXT.' });
    }

    // Check if user wants structured data (detailed extraction)
    const { structured } = req.query;
    if (structured === 'true') {
      const { extractStructuredJDText } = require("../../services/resumeAnalysis.service");
      const structuredData = await extractStructuredJDText(extractedText);
      return res.json(structuredData);
    }

    res.json({ text: extractedText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
