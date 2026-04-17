const prisma = require("../../prisma/client");
const {
    extractTextFromPdf,
    extractResumeData,
    optimizeResumeForJD,
} = require("../../services/resumeAnalysis.service");

const autoFillFromResume = async (req, res) => {
    try {
        const { resumeId } = req.body;
        if (!resumeId) return res.status(400).json({ error: "resumeId is required" });

        const userId = req.userId || req.user?.id;
        const resume = await prisma.resume.findFirst({
            where: { id: resumeId, userId: userId },
        });

        if (!resume) {
            return res.status(404).json({ error: "Resume not found" });
        }

        let extractedText = resume.extractedText;
        if (!extractedText) {
            extractedText = await extractTextFromPdf(resume.fileUrl);
            await prisma.resume.update({
                where: { id: resumeId },
                data: { extractedText },
            });
        }

        const structuredData = await extractResumeData(extractedText);

        res.json({
            success: true,
            data: structuredData,
        });
    } catch (err) {
        console.error("[AutoFill Error]", err.message);
        res.status(500).json({ error: "Failed to extract resume data: " + err.message });
    }
};

const optimizeForJD = async (req, res) => {
    try {
        const { resumeData, jobDescription } = req.body;
        if (!resumeData || !jobDescription) {
            return res.status(400).json({ error: "resumeData and jobDescription are required" });
        }

        const optimizedData = await optimizeResumeForJD(resumeData, jobDescription);

        res.json({
            success: true,
            data: optimizedData,
        });
    } catch (err) {
        console.error("[Optimization Error]", err.message);
        res.status(500).json({ error: "Optimization failed: " + err.message });
    }
};

module.exports = {
    autoFillFromResume,
    optimizeForJD,
};
