const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { role: 'student' }
  });
  console.log('Students count:', users.length);
  console.log('Students:', JSON.stringify(users, null, 2));

  const allUsers = await prisma.user.findMany();
  console.log('All Users:', allUsers.map(u => ({ email: u.email, role: u.role })));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
