import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkReviews() {
    const reviews = await prisma.attractionReview.findMany({
        include: {
            user: true,
            attraction: { select: { id: true, name: true, slug: true } }
        }
    });
    console.log('--- ALL REVIEWS IN DB ---');
    console.log(JSON.stringify(reviews, null, 2));
    await prisma.$disconnect();
}

checkReviews();
