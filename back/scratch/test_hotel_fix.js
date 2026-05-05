import { hotelService } from '../modules/businesses/hotel/hotel/hotel.service.js';
import prisma from '../config/db.js';

async function testHotelRepo() {
  try {
    console.log('--- Hotel Test Başlayır ---');
    
    // Vendor rolunda olan bir istifadəçi tapaq
    const vendor = await prisma.user.findFirst({
        where: { role: 'vendor' }
    });

    if (!vendor) {
        console.log('Bazada vendor tapılmadı, test ləğv edildi.');
        return;
    }

    console.log(`Vendor yoxlanılır: ${vendor.email} (ID: ${vendor.id})`);
    
    // findByVendor funksiyasını çağıraq (bu funksiya amenities, images və s. daxil edir)
    const hotels = await hotelService.findByVendor(vendor.id);
    console.log(`Tapılan hotellərin sayı: ${hotels.length}`);
    
    if (hotels.length > 0) {
        console.log('İlk hotelin nümunəsi:', {
            id: hotels[0].id,
            name: hotels[0].name,
            amenitiesCount: hotels[0].amenities?.length,
            imagesCount: hotels[0].images?.length
        });
    }

    console.log('TEST UĞURLU: findByVendor artıq xəta vermir.');
  } catch (error) {
    console.error('TEST UĞURSUZ: Xəta hələ də davam edir:');
    console.error(error.message);
    if (error.stack) {
        // console.error(error.stack);
    }
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

testHotelRepo();
