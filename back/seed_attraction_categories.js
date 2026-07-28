import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  const categories = [
    { name: 'Muzey', slug: 'muzey', description: 'Tarixi və mədəni muzeylər' },
    { name: 'Park', slug: 'park', description: 'İstirahət və gəzinti parkları' },
    { name: 'Tarixi Məkan', slug: 'tarixi-mekan', description: 'Qədim qalalar, abidələr və tarixi yerlər' },
    { name: 'Təbiət Abidəsi', slug: 'tebiet-abidesi', description: 'Şəlalələr, meşələr və digər təbiət gözəllikləri' },
    { name: 'Memorial Kompleks', slug: 'memorial-kompleks', description: 'Xatirə abidələri və kompleksləri' },
    { name: 'İdman və Əyləncə', slug: 'idman-eylence', description: 'Aktiv istirahət və əyləncə mərkəzləri' },
  ];

  console.log('Seeding attraction categories...');

  for (const cat of categories) {
    try {
      const created = await prisma.attractioncategory.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      });
      console.log(`Created/Updated category: ${created.name}`);
    } catch (error) {
      console.error(`Error creating category ${cat.name}:`, error);
    }
  }

  console.log('Seeding completed.');
  await prisma.$disconnect();
}

seed();
