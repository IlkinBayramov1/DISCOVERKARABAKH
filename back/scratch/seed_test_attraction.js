import prisma from '../config/db.js';

async function seedTestAttraction() {
    console.log('--- SEEDING TEST ATTRACTION ---');
    try {
        const category = await prisma.attractionCategory.findFirst();
        if (!category) {
            console.log('No attraction category found. Creating one...');
            // I won't create a category to avoid messing upDB, I'll just look for one.
            return;
        }

        const user = await prisma.user.findFirst({ where: { role: 'vendor' } }) || await prisma.user.findFirst();
        if (!user) {
            console.log('No user found to own the attraction.');
            return;
        }

        const testAttraction = await prisma.attraction.create({
            data: {
                name: 'Test Paid Attraction',
                slug: 'test-paid-attraction-' + Date.now(),
                city: 'Shusha',
                description: 'A beautiful test destination for booking verification.',
                address: 'Test Address 123',
                latitude: 39.75,
                longitude: 46.75,
                entryType: 'paid',
                price: 20.00,
                categoryId: category.id,
                vendorId: user.id,
                status: 'active'
            }
        });

        console.log('Test attraction created:', testAttraction.name, '(ID:', testAttraction.id, ')');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedTestAttraction();
