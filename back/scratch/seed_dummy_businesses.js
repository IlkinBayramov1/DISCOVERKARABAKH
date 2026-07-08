import prisma from '../config/db.js';

async function seed() {
  const vendorId = 'cd06d45d-8e7e-4efa-b172-d9fd420899f4'; // shusahotel@gmail.com
  const adminId = 'fc37c2ec-f5a1-4da6-a94f-c99abc4958f0'; // admin@discoverkarabakh.com
  const residentUserId = 'a2b8057d-6c00-49cf-bbd3-040967d5347f'; // ilkin600@gmail.com

  console.log('Seeding Tours...');
  const existingTours = await prisma.tour.count();
  if (existingTours === 0) {
    await prisma.tour.createMany({
      data: [
        {
          id: 'tour-1',
          name: 'Şuşa Tarixi və Qala Turu',
          slug: 'susa-tarixi-ve-qala-turu',
          description: 'Şuşanın qədim tarixi abidələrinə gəzinti və peşəkar bələdçi xidməti.',
          address: 'Şuşa Qalası',
          phone: '+994501112233',
          email: 'susa-tour@discoverkarabakh.com',
          durationDays: 1,
          durationNights: 0,
          difficulty: 'Medium',
          groupSizeMin: 1,
          groupSizeMax: 10,
          pricePerPerson: 50.0,
          ownerId: vendorId,
          city: 'Şuşa',
          availableSlots: 10,
          meetingPoint: 'Yuxarı Gövhər Ağa Məscidinin qarşısı',
          status: 'active',
          updatedAt: new Date()
        },
        {
          id: 'tour-2',
          name: 'Ağdam İmarət Kompleksi Turu',
          slug: 'agdam-imaret-kompleksi-turu',
          description: 'Ağdam şəhərində Pənahəli xanın imarət kompleksi və Çörək muzeyi turu.',
          address: 'Ağdam mərkəz',
          phone: '+994504445566',
          email: 'agdam-tour@discoverkarabakh.com',
          durationDays: 1,
          durationNights: 0,
          difficulty: 'Easy',
          groupSizeMin: 1,
          groupSizeMax: 15,
          pricePerPerson: 40.0,
          ownerId: vendorId,
          city: 'Ağdam',
          availableSlots: 15,
          meetingPoint: 'Ağdam Cümə Məscidinin qarşısı',
          status: 'active',
          updatedAt: new Date()
        }
      ]
    });
    console.log('Tours seeded!');
  }

  console.log('Seeding Attractions...');
  const existingAttractions = await prisma.attraction.count();
  if (existingAttractions === 0) {
    await prisma.attraction.createMany({
      data: [
        {
          id: 'attr-1',
          name: 'Cıdır Düzü',
          slug: 'cidir-duzu',
          description: 'Şuşanın ən məşhur təbii düzənliyi və möhtəşəm dərə mənzərəsi.',
          address: 'Cıdır Düzü',
          latitude: 39.75,
          longitude: 46.75,
          entryType: 'free',
          status: 'active',
          vendorId: vendorId,
          city: 'Şuşa',
          category: 'Tebiet_Abidesi',
          updatedAt: new Date()
        },
        {
          id: 'attr-2',
          name: 'Yuxarı Gövhər Ağa Məscidi',
          slug: 'yuxari-govher-aga-mescidi',
          description: 'Şuşanın 18-ci əsrə aid memarlıq abidəsi və tarixi məscidi.',
          address: 'Şuşa Mərkəz',
          latitude: 39.755,
          longitude: 46.755,
          entryType: 'free',
          status: 'active',
          vendorId: vendorId,
          city: 'Şuşa',
          category: 'Tarixi_Mekan',
          updatedAt: new Date()
        }
      ]
    });
    console.log('Attractions seeded!');
  }

  console.log('Seeding Vehicles...');
  const existingVehicles = await prisma.vehicle.count();
  if (existingVehicles === 0) {
    await prisma.vehicle.createMany({
      data: [
        {
          id: 'veh-1',
          vendorId: vendorId,
          brand: 'Mercedes-Benz',
          model: 'Sprinter',
          year: 2020,
          color: 'Ağ',
          plateNumber: '99-AB-123',
          category: 'Bus',
          seats: 18,
          luggage: 10,
          description: 'Şuşa turları üçün geniş və rahat minibus.',
          status: 'Active',
          updatedAt: new Date()
        },
        {
          id: 'veh-2',
          vendorId: vendorId,
          brand: 'Toyota',
          model: 'Land Cruiser',
          year: 2021,
          color: 'Qara',
          plateNumber: '77-CD-456',
          category: 'Premium',
          seats: 7,
          luggage: 4,
          description: 'Dağlıq ərazilər üçün premium və güclü SUV.',
          status: 'Active',
          updatedAt: new Date()
        }
      ]
    });
    console.log('Vehicles seeded!');
  }

  console.log('Seeding Utility Upload Log and Bills...');
  const existingUtility = await prisma.utilityuploadlog.count();
  if (existingUtility === 0) {
    const batchId = 'batch-2026-07-02';
    
    // Create abonents first if they do not exist
    const abonent1 = await prisma.utilityabonent.upsert({
      where: { abonentCode: '10001' },
      update: {},
      create: {
        id: 'ab-1',
        abonentCode: '10001',
        residentName: 'İlkin Bayramov',
        localAddress: 'Şuşa şəhəri, ev 12',
        userId: residentUserId
      }
    });

    const abonent2 = await prisma.utilityabonent.upsert({
      where: { abonentCode: '10002' },
      update: {},
      create: {
        id: 'ab-2',
        abonentCode: '10002',
        residentName: 'Əli Məmmədov',
        localAddress: 'Ağdam şəhəri, ev 4'
      }
    });

    // Create utility upload log
    await prisma.utilityuploadlog.create({
      data: {
        id: 'log-1',
        batchId: batchId,
        fileName: 'kommunal_iyul_2026.xlsx',
        rowCount: 2,
        successCount: 2,
        errorCount: 0,
        uploadedByAdminId: adminId,
        isRolledBack: false
      }
    });

    // Create utility bills
    await prisma.utilitybill.createMany({
      data: [
        {
          id: 'bill-1',
          abonentCode: '10001',
          utilityType: 'gas',
          amount: 25.5,
          paidAmount: 0.0,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          status: 'unpaid',
          billingMonth: '2026-07',
          batchId: batchId
        },
        {
          id: 'bill-2',
          abonentCode: '10002',
          utilityType: 'water',
          amount: 15.0,
          paidAmount: 0.0,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'unpaid',
          billingMonth: '2026-07',
          batchId: batchId
        }
      ]
    });
    console.log('Utility upload log and bills seeded!');
  }

  console.log('Seeding process completed!');
}

seed().catch(console.error);
