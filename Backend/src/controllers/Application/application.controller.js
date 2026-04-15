const prisma = require("../../prisma/client");

const applyToJob = async (req, res) => {
    try {
        const { jobId, resumeId } = req.body;
        const userId = req.userId || req.user?.id || req.user?._id;

        if (!jobId || !resumeId) {
            return res.status(400).json({ error: "jobId and resumeId are required" });
        }

        if (!userId) {
            return res.status(401).json({ error: "User unauthorized" });
        }

        // Step 1: Check if already applied
        const existing = await prisma.application.findFirst({
            where: {
                userId,
                jobId
            }
        });

        if (existing) {
            return res.status(400).json({ error: "You have already applied for this job" });
        }

        // Step 2: Create application record
        const application = await prisma.application.create({
            data: {
                userId,
                jobId,
                resumeId,
                status: "Applied"
            }
        });

        console.log(`[Apply] Success: User ${userId} applied to Job ${jobId} with Resume ${resumeId}`);
        res.json({ success: true, application });

    } catch (err) {
        console.error("[Apply Error]", err.message);
        res.status(500).json({ error: "Failed to apply for job: " + err.message });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id || req.user?._id;
        const applications = await prisma.application.findMany({
            where: { userId },
            include: {
                job: true,
                resume: {
                    include: { analysis: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        res.json({ success: true, applications });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    applyToJob,
    getMyApplications
};
