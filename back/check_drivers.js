import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const drivers = await prisma.driverProfile.findMany({
    include: {
      user: true,
      currentVehicle: true,
      currentCargoVehicle: true
    }
  });

  console.log('--- Driver Profiles & User Roles & Vehicles ---');
  drivers.forEach(d => {
    console.log(`Driver ID: ${d.id}`);
    console.log(`Name: ${d.firstName} ${d.lastName}`);
    console.log(`Status: ${d.status}`);
    console.log(`User Email: ${d.user.email}`);
    if (d.currentVehicle) {
      console.log(`Passenger Vehicle: ${d.currentVehicle.brand} ${d.currentVehicle.model} (${d.currentVehicle.plateNumber})`);
    }
    if (d.currentCargoVehicle) {
      console.log(`Cargo Vehicle: ${d.currentCargoVehicle.brand} ${d.currentCargoVehicle.model} (${d.currentCargoVehicle.licensePlate})`);
    }
    console.log('-----------------------------------');
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
