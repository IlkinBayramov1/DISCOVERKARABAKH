import prisma from '../config/db.js';

async function list() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true }
  });
  const hotels = await prisma.hotel.findMany({
    select: { id: true, name: true, ownerId: true }
  });
  console.log({ users, hotels });
}

list().catch(console.error);
