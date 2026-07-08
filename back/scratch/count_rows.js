import prisma from '../config/db.js';

async function check() {
  const hotels = await prisma.hotel.count();
  const tours = await prisma.tour.count();
  const attractions = await prisma.attraction.count();
  const utility = await prisma.utilityuploadlog.count();
  const transport = await prisma.vehicle.count();
  
  console.log({ hotels, tours, attractions, utility, transport });
}

check().catch(console.error);
