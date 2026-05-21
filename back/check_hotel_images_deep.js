import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const hotels = await prisma.hotel.findMany({
    include: { images: true },
    take: 5
  });
  hotels.forEach(h => {
    console.log(`Hotel: ${h.name}, Images Count: ${h.images.length}`);
    h.images.forEach(img => console.log(`  - ${img.url}`));
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
