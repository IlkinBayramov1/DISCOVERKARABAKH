import prisma from '../config/db.js';

async function verifyAction(name, actionFn, checkFn) {
  console.log(`\nTesting: ${name}...`);
  try {
    await actionFn();
    const isCorrect = await checkFn();
    console.log(isCorrect ? `✅ ${name} Successful` : `❌ ${name} Failed (Value not updated in DB)`);
  } catch (err) {
    console.error(`❌ ${name} Error:`, err.message);
  }
}

async function main() {
  const testVendorId = '34385da7-4c31-49e5-b869-f3f93bd1ee7b'; // hotel@discoverkarabakh.com
  const testHotelId = '094a3f98-f6ba-412d-8fc7-cc61ee3be781'; // Test Payment Hotel

  console.log('=== ADMIN LOGIC VERIFICATION ===');

  // 1. Vendor Approval
  await verifyAction(
    'Approve Vendor',
    () => prisma.user.update({ where: { id: testVendorId }, data: { isApproved: true } }),
    async () => (await prisma.user.findUnique({ where: { id: testVendorId } })).isApproved === true
  );

  // 2. Vendor Rejection
  await verifyAction(
    'Reject Vendor',
    () => prisma.user.update({ where: { id: testVendorId }, data: { isApproved: false } }),
    async () => (await prisma.user.findUnique({ where: { id: testVendorId } })).isApproved === false
  );

  // 3. Hotel Approval
  await verifyAction(
    'Approve Hotel',
    () => prisma.hotel.update({ where: { id: testHotelId }, data: { status: 'active' } }),
    async () => (await prisma.hotel.findUnique({ where: { id: testHotelId } })).status === 'active'
  );

  // 4. Hotel Rejection
  await verifyAction(
    'Reject Hotel',
    () => prisma.hotel.update({ where: { id: testHotelId }, data: { status: 'rejected' } }),
    async () => (await prisma.hotel.findUnique({ where: { id: testHotelId } })).status === 'rejected'
  );

  // Reset to pending for user testing
  await prisma.hotel.update({ where: { id: testHotelId }, data: { status: 'pending' } });
  
  console.log('\n--- Final DB State Check ---');
  const vendor = await prisma.user.findUnique({ where: { id: testVendorId } });
  const hotel = await prisma.hotel.findUnique({ where: { id: testHotelId } });
  
  console.log(`Vendor (${vendor.email}) isApproved: ${vendor.isApproved}`);
  console.log(`Hotel (${hotel.name}) status: ${hotel.status}`);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
