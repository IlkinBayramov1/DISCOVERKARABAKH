import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function search() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'vendor',
        isApproved: false,
        vendorProfile: {
          category: 'attraction'
        }
      },
      include: {
        vendorProfile: true
      }
    });
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error searching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

search();
