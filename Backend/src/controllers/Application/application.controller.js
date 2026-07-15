const Application = require("../../models/Application");
const Job = require("../../models/Job");
const Resume = require("../../models/Resume");
const Analysis = require("../../models/Analysis");
const User = require("../../models/User");
const { emitEvent } = require("../../utils/socket");

const applyToJob = async (req, res) => {
    try {
        const { jobId, resumeId } = req.body;
        const userId = req.userId || req.user?.id || req.user?._id;

        console.log(`[Apply] Request: User ${userId} applying to Job ${jobId} with Resume ${resumeId}`);

        if (!jobId || !resumeId) {
            console.error("[Apply] Error: Missing jobId or resumeId");
            return res.status(400).json({ error: "jobId and resumeId are required" });
        }

        if (!userId) {
            console.error("[Apply] Error: Missing userId in request");
            return res.status(401).json({ error: "User unauthorized" });
        }

        // Step 0: Check if job is hired
        const job = await Job.findById(jobId).lean();
        if (job?.isHired) {
            return res.status(400).json({ error: "This job is no longer accepting applications." });
        }

        // Step 1: Check if already applied
        const existing = await Application.findOne({
            userId,
            jobId
        }).lean();

        if (existing) {
            return res.status(400).json({ error: "You have already applied for this job" });
        }

        // Step 2: Create application record
        const application = await Application.create({
            userId,
            jobId,
            resumeId,
            status: "Applied"
        });

        const appObj = application.toObject();
        appObj.id = appObj._id.toString();

        console.log(`[Apply] Success: User ${userId} applied to Job ${jobId} with Resume ${resumeId}`);
        emitEvent("application_submitted", { jobId, userId, applicationId: appObj.id });
        res.json({ success: true, application: appObj });

    } catch (err) {
        console.error("[Apply Error]", err.message);
        res.status(500).json({ error: "Failed to apply for job: " + err.message });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id || req.user?._id;
        const apps = await Application.find({ userId }).sort({ createdAt: -1 }).lean();
        const applications = await Promise.all(apps.map(async (app) => {
            const job = await Job.findById(app.jobId).lean();
            const resume = await Resume.findById(app.resumeId).lean();
            if (resume) {
                resume.id = resume._id.toString();
                const analysis = await Analysis.findOne({ resumeId: resume._id }).lean();
                resume.analysis = analysis ? { ...analysis, id: analysis._id.toString() } : null;
            }
            return {
                ...app,
                id: app._id.toString(),
                job: job ? { ...job, id: job._id.toString() } : null,
                resume
            };
        }));

        res.json({ success: true, applications });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getJobApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;
        console.log(`[GetApplicants] Fetching candidates for Job ID: ${jobId}`);

        const apps = await Application.find({ jobId }).sort({ createdAt: -1 }).lean();
        const applications = await Promise.all(apps.map(async (app) => {
            const user = await User.findById(app.userId).select('name email phone').lean();
            const resume = await Resume.findById(app.resumeId).lean();
            if (resume) {
                resume.id = resume._id.toString();
                const analysis = await Analysis.findOne({ resumeId: resume._id }).lean();
                resume.analysis = analysis ? { ...analysis, id: analysis._id.toString() } : null;
            }
            return {
                ...app,
                id: app._id.toString(),
                user: user ? { ...user, id: user._id.toString() } : null,
                resume
            };
        }));

        console.log(`[GetApplicants] Successfully retrieved ${applications.length} applications for Job ${jobId}`);
        res.json({ success: true, applications });
    } catch (err) {
        console.error(`[GetApplicants Error] Job ${req.params.jobId}:`, err.message);
        res.status(500).json({ error: "Failed to fetch applicants: " + err.message });
    }
};

module.exports = {
    applyToJob,
    getMyApplications,
    getJobApplicants
};
