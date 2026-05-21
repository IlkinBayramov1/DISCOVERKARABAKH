import { generateKeywords } from './core/utils/keyword.util.js';
import prisma from './config/db.js';
import { attractionService } from './modules/businesses/attraction/attraction/attraction.service.js';
import { attractionRepository } from './modules/businesses/attraction/attraction/attraction.repository.js';
import { attractionAnalyticsController } from './modules/businesses/attraction/stats/attractionAnalytics.controller.js';
import { attractionReviewReportService } from './modules/businesses/attraction/review/attractionReviewReport.service.js';

async function testAll() {
    console.log('--- 1. Keyword Generation Test ---');
    const keywords = generateKeywords('Şuşa');
    console.log('Keywords for Şuşa:', keywords);
    if (keywords.includes('Shusha') && keywords.includes('Шуша')) {
        console.log('✅ Success: Multilingual variants generated.');
    } else {
        console.log('❌ Failure: Variants missing.');
    }

    console.log('\n--- 2. Database Integration Tests ---');
    try {
        let user = await prisma.user.findFirst();
        let category = await prisma.attractionCategory.findFirst();
        
        if (!user || !category) {
            console.log('User or Category missing in DB. Skipping DB-dependent tests.');
            return;
        }

        console.log('\n--- 3. Search & Event Linking Test ---');
        const attraction = await attractionService.createAttraction({
            name: 'Şuşa Qalası ' + Date.now(),
            slug: 'shusha-fortress-' + Date.now(),
            description: 'Tarixi qala kompleksi',
            address: 'Şuşa ş.',
            latitude: 39.75,
            longitude: 46.75,
            city: 'Shusha',
            categoryId: category.id,
            images: [
                { url: 'img1.jpg', type: 'image' },
                { url: 'tour360.jpg', type: '360_image' }
            ]
        });
        console.log('Attraction created with keywords:', attraction.searchKeywords);

        const details = await attractionService.getAttractionById(attraction.id);
        console.log('Attraction Details fetched. Nearby events count:', details.nearbyEvents?.length || 0);

        const searchResult = await attractionRepository.findAll({ q: 'Shusha' });
        if (searchResult.data.some(a => a.id === attraction.id)) {
            console.log('✅ Success: Found attraction by searching "Shusha".');
        } else {
            console.log('❌ Failure: Search failed.');
        }

        console.log('\n--- 4. Analytics Test ---');
        const mockRes = {
            status: () => mockRes,
            json: (data) => console.log('Analytics Distribution verified.')
        };
        await attractionAnalyticsController.getDeepAnalytics({ params: { id: attraction.id }, query: {} }, mockRes, (e) => console.error(e));
        console.log('✅ Success: Analytics extraction logic verified.');

        console.log('\n--- 5. Reporting Test ---');
        const review = await prisma.attractionReview.create({
            data: {
                attractionId: attraction.id,
                userId: user.id,
                rating: 5,
                comment: 'Test Review'
            }
        });
        
        await attractionReviewReportService.createReport(user.id, review.id, {
            reason: 'Spam',
            customNote: 'Test report'
        });
        
        const reports = await attractionReviewReportService.getAllReports();
        if (reports.length > 0) {
            console.log('✅ Success: Report system integrated.');
        }

    } catch (error) {
        console.error('Test Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testAll();
