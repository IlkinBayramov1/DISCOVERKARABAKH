import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function listPending() {
  try {
    const pendingVendors = await prisma.user.findMany({
      where: {
        role: 'vendor',
        isApproved: false
      },
      include: {
        vendorProfile: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    console.log(JSON.stringify(pendingVendors, null, 2));
  } catch (error) {
    console.error('Error fetching pending vendors:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listPending();
