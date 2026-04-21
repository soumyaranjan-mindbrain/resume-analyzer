const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function check() {
    try {
        const analyses = await prisma.analysis.findMany({
            select: { id: true, resumeId: true }
        });
        console.log(`Analyses found: ${analyses.length}`);

        if (analyses.length > 0) {
            const resumeIds = analyses.map(a => a.resumeId);
            const resumes = await prisma.resume.findMany({
                where: { id: { in: resumeIds } }
            });
            console.log(`Resumes found for those IDs: ${resumes.length}`);

            const orphaned = analyses.filter(a => !resumes.some(r => r.id === a.resumeId));
            console.log(`Orphaned analyses: ${orphaned.length}`);
            if (orphaned.length > 0) {
                console.log(`Sample orphan resumeId: ${orphaned[0].resumeId}`);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

check();
