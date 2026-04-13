import { hotelService } from './modules/businesses/hotel/hotel/hotel.service.js';
import prisma from './config/db.js';

async function verify() {
    try {
        const hotel = await prisma.hotel.findFirst({
            where: { status: 'active' }
        });

        if (!hotel) {
            console.log("No active hotels found to test.");
            return;
        }

        console.log(`Testing Hotel: ${hotel.name} (${hotel.id})`);
        const result = await hotelService.findById(hotel.id);
        
        if (result.roomTypes && result.roomTypes.length > 0) {
            result.roomTypes.forEach(rt => {
                console.log(`Room: ${rt.name}, basePrice: ${rt.basePrice}`);
            });
        } else {
            console.log("No room types found for this hotel.");
        }
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

verify();
