import prisma from '../config/db.js';

async function main() {
  console.log('--- Business Analysis ---');
  
  const hotels = await prisma.hotel.findMany({
    select: { id: true, name: true, status: true, ownerId: true }
  });

  const restaurants = await prisma.restaurant.findMany({
    select: { id: true, name: true, status: true, vendorId: true }
  });

  console.log('\nHotels:');
  console.table(hotels.map(h => ({
    id: h.id,
    name: h.name,
    status: h.status,
    owner: h.ownerId
  })));
  
  console.log('\nRestaurants:');
  console.table(restaurants.map(r => ({
    id: r.id,
    name: r.name,
    status: r.status,
    owner: r.vendorId
  })));
  
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
