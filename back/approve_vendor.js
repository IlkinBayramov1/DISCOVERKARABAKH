import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function approve() {
  const userId = '682c6d70-6937-4418-a7c4-8d1b53fe5f92';
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isApproved: true }
    });
    console.log(`Successfully approved vendor: ${user.email}`);
  } catch (error) {
    console.error('Error approving vendor:', error);
  } finally {
    await prisma.$disconnect();
  }
}

approve();
