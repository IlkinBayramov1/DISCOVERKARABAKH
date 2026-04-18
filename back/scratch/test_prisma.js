import prisma from '../config/db.js';

async function test() {
  try {
    const hotels = await prisma.hotel.count();
    console.log('Hotels count:', hotels);
    const restaurants = await prisma.restaurant.count();
    console.log('Restaurants count:', restaurants);
    const tours = await prisma.tour.count();
    console.log('Tours count:', tours);
  } catch (err) {
    console.error('CRASH DETECTED:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
