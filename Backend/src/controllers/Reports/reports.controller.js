const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllReports = async (req, res) => {
    try {
        const { startDate, endDate, range } = req.query;
        let where = {};

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        } else if (range && range !== 'all') {
            const now = new Date();
            let start;
            if (range === '24h') start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            else if (range === '7d') start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            else if (range === '30d') start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            else if (range === '1y') start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

            if (start) {
                where.createdAt = { gte: start };
            }
        }

        // Fetch all analyses with filtering
        const analyses = await prisma.analysis.findMany({
            where,
            select: {
                id: true,
                resumeId: true,
                atsScore: true,
                summary: true,
                experienceLevel: true,
                jobsMatched: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Get all unique resume IDs
        const resumeIds = [...new Set(analyses.map(a => a.resumeId))];

        // Fetch all corresponding resumes including user info
        const resumes = await prisma.resume.findMany({
            where: {
                id: { in: resumeIds }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        // Create a map for quick lookup
        const resumeMap = resumes.reduce((acc, resume) => {
            acc[resume.id] = resume;
            return acc;
        }, {});

        // Join data and filter out orphans
        const reports = analyses
            .map(analysis => ({
                ...analysis,
                resume: resumeMap[analysis.resumeId]
            }))
            .filter(report => report.resume); // Skip reports where resume was not found

        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ error: "Failed to fetch reports" });
    }
};
