import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkImages() {
  try {
    const images = await prisma.attractionImage.findMany({
      include: { attraction: { select: { name: true } } }
    });
    console.log(JSON.stringify(images, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

checkImages();
