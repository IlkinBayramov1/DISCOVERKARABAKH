import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';

async function updateDist() {
  const passwordHash = await bcrypt.hash('123456', 10);

  // 1. Create or get Tour Vendor
  const tourVendor = await prisma.user.upsert({
    where: { email: 'karabakhtours@gmail.com' },
    update: {},
    create: {
      id: 'vendor-tours-id',
      email: 'karabakhtours@gmail.com',
      password: passwordHash,
      role: 'vendor',
      isActive: true,
      isApproved: true,
      firstName: 'Tural',
      lastName: 'Həsənov',
      phone: '+994507778899',
      balance: 1500.0,
      updatedAt: new Date()
    }
  });
  console.log('Tour vendor:', tourVendor.email);

  // Create vendor profile for tour vendor
  await prisma.vendorprofile.upsert({
    where: { userId: tourVendor.id },
    update: {},
    create: {
      id: 'vp-tours',
      companyName: 'Karabakh Tours LLC',
      category: 'Turlar',
      userId: tourVendor.id
    }
  });

  // 2. Create or get Transport Vendor
  const transVendor = await prisma.user.upsert({
    where: { email: 'karabakhtrans@gmail.com' },
    update: {},
    create: {
      id: 'vendor-trans-id',
      email: 'karabakhtrans@gmail.com',
      password: passwordHash,
      role: 'vendor',
      isActive: true,
      isApproved: true,
      firstName: 'Vasif',
      lastName: 'Əliyev',
      phone: '+994556667788',
      balance: 3200.0,
      updatedAt: new Date()
    }
  });
  console.log('Transport vendor:', transVendor.email);

  // Create vendor profile for transport vendor
  await prisma.vendorprofile.upsert({
    where: { userId: transVendor.id },
    update: {},
    create: {
      id: 'vp-trans',
      companyName: 'Karabakh Transport Services',
      category: 'Nəqliyyat',
      userId: transVendor.id
    }
  });

  // 3. Create or get Attraction Vendor
  const attrVendor = await prisma.user.upsert({
    where: { email: 'karabakhattr@gmail.com' },
    update: {},
    create: {
      id: 'vendor-attr-id',
      email: 'karabakhattr@gmail.com',
      password: passwordHash,
      role: 'vendor',
      isActive: true,
      isApproved: true,
      firstName: 'Anar',
      lastName: 'Məmmədov',
      phone: '+994703334455',
      balance: 500.0,
      updatedAt: new Date()
    }
  });
  console.log('Attraction vendor:', attrVendor.email);

  // Create vendor profile for attraction vendor
  await prisma.vendorprofile.upsert({
    where: { userId: attrVendor.id },
    update: {},
    create: {
      id: 'vp-attr',
      companyName: 'Karabakh Cultural Heritage',
      category: 'Görməli Yerlər',
      userId: attrVendor.id
    }
  });

  // 4. Update Tours ownerId
  await prisma.tour.updateMany({
    where: { id: { in: ['tour-1', 'tour-2'] } },
    data: { ownerId: tourVendor.id }
  });
  console.log('Updated Tours ownerId to tour vendor');

  // 5. Update Vehicles vendorId
  await prisma.vehicle.updateMany({
    where: { id: { in: ['veh-1', 'veh-2'] } },
    data: { vendorId: transVendor.id }
  });
  console.log('Updated Vehicles vendorId to transport vendor');

  // 6. Update Attractions vendorId
  await prisma.attraction.updateMany({
    where: { id: { in: ['attr-1', 'attr-2'] } },
    data: { vendorId: attrVendor.id }
  });
  console.log('Updated Attractions vendorId to attraction vendor');

  console.log('Distribution completed!');
}

updateDist().catch(console.error);
