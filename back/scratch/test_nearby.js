import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
    try {
        const attractions = await prisma.attraction.findMany({
            take: 3,
            select: { id: true, name: true, latitude: true, longitude: true }
        });
        console.log('Attractions in DB:', JSON.stringify(attractions, null, 2));

        if (attractions.length > 0) {
            const { latitude, longitude } = attractions[0];
            console.log(`Testing nearby search for: ${attractions[0].name} (${latitude}, ${longitude})`);
            
            // We need to import the repository, but since this is a standalone script, 
            // we'll just run the raw query logic directly to verify SQL works.
            const nearby = await prisma.$queryRaw`
                SELECT a.id, a.name, 
                ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( a.latitude ) ) 
                * cos( radians( a.longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) 
                * sin( radians( a.latitude ) ) ) ) AS distance
                FROM Attraction a
                WHERE a.status = 'active'
                HAVING distance <= 50
                ORDER BY distance ASC
                LIMIT 5
            `;
            console.log('Nearby results:', JSON.stringify(nearby, null, 2));
        } else {
            console.log('No attractions found to test.');
        }
    } catch (err) {
        console.error('Test failed:', err);
    } finally {
        await prisma.$disconnect();
    }
}

test();
