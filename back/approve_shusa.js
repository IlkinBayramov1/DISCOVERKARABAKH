import prisma from './config/db.js';

async function approveAllVendorHotels() {
    try {
        const email = 'shusahotel@gmail.com';
        
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) return;

        // Bütün hotellərini "active" edirik ki, hamısı görünsün
        const hotels = await prisma.hotel.findMany({
            where: { ownerId: user.id }
        });

        for (const hotel of hotels) {
            await prisma.hotel.update({
                where: { id: hotel.id },
                data: { status: 'active' }
            });
            console.log(`✅ Hotel Təsdiqləndi: ${hotel.name}`);
        }
        
    } catch (error) {
        console.error('Xəta baş verdi:', error);
    } finally {
        await prisma.$disconnect();
    }
}

approveAllVendorHotels();
