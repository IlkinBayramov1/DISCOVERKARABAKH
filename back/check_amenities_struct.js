import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const hotel = await prisma.hotel.findFirst({
    include: {
      amenities: { include: { amenity: true } }
    }
  });
  console.log(JSON.stringify(hotel?.amenities, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
