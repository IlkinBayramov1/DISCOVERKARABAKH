import { hotelService } from '../modules/businesses/hotel/hotel/hotel.service.js';
import prisma from '../config/db.js';

async function testRoomsRepo() {
  try {
    console.log('--- Room Test Başlayır ---');
    
    // Vendor rolunda olan bir istifadəçi tapaq
    const vendor = await prisma.user.findFirst({
        where: { role: 'vendor' }
    });

    if (!vendor) {
        console.log('Bazada vendor tapılmadı, test ləğv edildi.');
        return;
    }

    console.log(`Vendor yoxlanılır: ${vendor.email} (ID: ${vendor.id})`);
    
    // findRoomsByVendor funksiyasını çağıraq
    const rooms = await hotelService.findRoomsByVendor(vendor.id);
    console.log(`Tapılan otaqların sayı: ${rooms.length}`);
    
    console.log('TEST UĞURLU: findRoomsByVendor artıq xəta vermir.');
  } catch (error) {
    console.error('TEST UĞURSUZ: Xəta hələ də davam edir:');
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

testRoomsRepo();
