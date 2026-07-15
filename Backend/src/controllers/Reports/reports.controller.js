const User = require("../../models/User");
const Resume = require("../../models/Resume");
const Analysis = require("../../models/Analysis");

exports.getAllReports = async (req, res) => {
    try {
        const { startDate, endDate, range } = req.query;
        let query = {};

        if (startDate || endDate) {
            query.createdAt = {};
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start && !isNaN(start.getTime())) query.createdAt.$gte = start;
            if (end && !isNaN(end.getTime())) query.createdAt.$lte = end;

            // If no valid dates were provided after all, remove the createdAt filter
            if (Object.keys(query.createdAt).length === 0) {
                delete query.createdAt;
            }
        } else if (range && range !== 'all') {
            const now = new Date();
            let start;
            if (range === '24h') start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            else if (range === '7d') start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            else if (range === '30d') start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            else if (range === '1y') start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

            if (start) {
                query.createdAt = { $gte: start };
            }
        }

        // Fetch all analyses with filtering
        const analyses = await Analysis.find(query)
            .select('resumeId atsScore summary experienceLevel jobsMatched createdAt')
            .sort({ createdAt: -1 })
            .lean();

        // Get all unique resume IDs, filtering out any invalid ones
        const resumeIds = [...new Set(analyses.map(a => a.resumeId).filter(Boolean))];

        // 1. Fetch Resumes (Manual join to handle orphans gracefully)
        const resumes = resumeIds.length > 0 ? await Resume.find({ _id: { $in: resumeIds } }).lean() : [];

        // 2. Fetch Users associated with these resumes
        const userIds = [...new Set(resumes.map(r => r.userId).filter(Boolean))];
        const users = userIds.length > 0 ? await User.find({ _id: { $in: userIds } }).select('id name email').lean() : [];

        // 3. Create maps for quick lookup
        const userMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = {
                id: user._id.toString(),
                name: user.name,
                email: user.email
            };
            return acc;
        }, {});

        const resumeMap = resumes.reduce((acc, resume) => {
            if (resume && resume._id) {
                const user = resume.userId ? userMap[resume.userId.toString()] : null;
                acc[resume._id.toString()] = {
                    id: resume._id.toString(),
                    fileUrl: resume.fileUrl,
                    fileName: resume.fileName,
                    extractedText: resume.extractedText,
                    createdAt: resume.createdAt,
                    user: user || { name: 'Unknown User', email: 'N/A' }
                };
            }
            return acc;
        }, {});

        // 4. Join Analysis -> Resume -> User
        const reports = analyses
            .map(analysis => {
                const resumeIdStr = analysis.resumeId ? analysis.resumeId.toString() : null;
                const resume = resumeIdStr ? resumeMap[resumeIdStr] : null;
                return {
                    id: analysis._id.toString(),
                    resumeId: resumeIdStr,
                    atsScore: analysis.atsScore,
                    summary: analysis.summary,
                    experienceLevel: analysis.experienceLevel,
                    jobsMatched: analysis.jobsMatched,
                    createdAt: analysis.createdAt,
                    resume
                };
            })
            .filter(report => report.resume); // Skip reports where resume was totally missing

        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ error: "Failed to fetch reports" });
    }
};
