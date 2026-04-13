const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixTimestamps() {
  try {
    // Update users with null createdAt
    const result = await prisma.user.updateMany({
      where: { createdAt: null },
      data: {
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    console.log(`Updated ${result.count} users with null timestamps`);
  } catch (error) {
    console.error('Error fixing timestamps:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixTimestamps();