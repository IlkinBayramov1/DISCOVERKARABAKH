const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const images = await prisma.hotelImage.findMany({
    include: { hotel: { select: { name: true } } },
    take: 10
  });
  console.log(JSON.stringify(images, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
