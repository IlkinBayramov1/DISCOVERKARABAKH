import prisma from './config/db.js';

async function checkAdmins() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'admin' }
    });
    
    console.log('--- Current Admins ---');
    if (admins.length === 0) {
      console.log('No admins found in database!');
    } else {
      admins.forEach(a => console.log(`Email: ${a.email}, Role: ${a.role}, Approved: ${a.isApproved}`));
    }
  } catch (error) {
    console.error('Error checking admins:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmins();
