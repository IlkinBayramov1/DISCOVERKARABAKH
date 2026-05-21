import { bookingService } from '../modules/booking/booking.service.js';
import prisma from '../config/db.js';

async function testBookingRepo() {
  try {
    console.log('--- Booking Test Başlayır ---');
    
    // Vendor rolunda olan bir istifadəçi tapaq
    const vendor = await prisma.user.findFirst({
        where: { role: 'vendor' }
    });

    if (!vendor) {
        console.log('Bazada vendor tapılmadı, test ləğv edildi.');
        return;
    }

    console.log(`Vendor yoxlanılır: ${vendor.email} (ID: ${vendor.id})`);
    
    // getVendorBookings funksiyasını çağıraq (bu funksiya tour, hotel və s. daxil edir)
    const bookings = await bookingService.getVendorBookings(vendor.id);
    console.log(`Tapılan rezervasiyaların sayı: ${bookings.length}`);
    
    console.log('TEST UĞURLU: getVendorBookings artıq xəta vermir.');
  } catch (error) {
    console.error('TEST UĞURSUZ: Xəta hələ də davam edir:');
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

testBookingRepo();
