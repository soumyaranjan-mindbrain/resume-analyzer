const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function check() {
    try {
        const count = await prisma.analysis.count();
        console.log(`Total analysis records: ${count}`);
        const reports = await prisma.analysis.findMany({
            take: 5,
            include: {
                resume: {
                    include: {
                        user: true
                    }
                }
            }
        });
        console.log('Sample report:', JSON.stringify(reports[0], null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

check();
