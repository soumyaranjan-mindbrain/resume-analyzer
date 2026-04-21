const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function check() {
    try {
        const analyses = await prisma.analysis.findMany({ take: 1 });
        if (analyses.length === 0) {
            console.log('No analyses found');
            return;
        }
        const analysis = analyses[0];
        const resume = await prisma.resume.findUnique({
            where: { id: analysis.resumeId },
            include: { user: true }
        });

        const report = { ...analysis, resume };
        console.log('Backend Report structure:', JSON.stringify(report, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

check();
