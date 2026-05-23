import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      vendorprofile: true
    }
  });
  console.log('All Users:', JSON.stringify(users.map(u => ({ email: u.email, role: u.role, isApproved: u.isApproved, isBanned: u.isBanned, vendor: u.vendorprofile })), null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
