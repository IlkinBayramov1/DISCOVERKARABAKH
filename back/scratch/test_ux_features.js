import prisma from '../config/db.js';
import { attractionService } from '../modules/businesses/attraction/attraction/attraction.service.js';
import { attractionReviewService } from '../modules/businesses/attraction/review/attractionReview.service.js';
import { attractionStatsService } from '../modules/businesses/attraction/stats/attractionStats.service.js';

async function testUXFeatures() {
    const userId = '05083aae-61b8-4880-93e9-9a31497d82e4'; // Existing user
    const slug = 'test-attraction-' + Date.now();

    try {
        console.log('--- Phase 1: Create Attraction with Audio Guide ---');
        const attraction = await attractionService.createAttraction({
            name: 'Test Shusha Fortress',
            slug: slug,
            description: 'Historical fortress with audio guide',
            address: 'Shusha city entrance',
            latitude: 39.76,
            longitude: 46.75,
            city: 'Shusha',
            categoryId: (await prisma.attractionCategory.findFirst()).id,
            audioUrl: 'https://example.com/audio/shusha_fortress.mp3'
        });
        console.log('Attraction created with AudioURL:', attraction.audioUrl);

        console.log('\n--- Phase 2: Create Review with Images ---');
        const review = await attractionReviewService.createReview(userId, attraction.id, {
            rating: 5,
            comment: 'Amazing place! The audio guide was very helpful.',
            images: [
                'https://example.com/photos/shusha1.jpg',
                'https://example.com/photos/shusha2.jpg'
            ]
        });
        console.log('Review created with Images:', review.images);

        console.log('\n--- Phase 3: Verify Stats Update ---');
        // Wait a bit for the async event to process
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const stats = await prisma.attractionStat.findUnique({
            where: { attractionId: attraction.id }
        });
        console.log('Attraction Average Rating:', stats?.averageRating);

        if (stats?.averageRating === 5) {
            console.log('\n✅ SUCCESS: All UX backend features are working correctly!');
        } else {
            console.log('\n❌ FAILURE: Average rating not updated correctly.');
        }

        // Cleanup
        await prisma.attractionReview.delete({ where: { id: review.id } });
        await prisma.attraction.delete({ where: { id: attraction.id } });
        console.log('\nCleanup completed.');

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testUXFeatures();
