import prisma from './config/db.js';
import { hashPassword } from './utils/hash.util.js';

async function resetAdmin() {
  try {
    const email = 'admin@discoverkarabakh.com';
    const hashedPassword = await hashPassword('admin123');
    
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'admin',
        isApproved: true,
        isActive: true
      },
      create: {
        id: 'admin-fixed-id',
        email,
        password: hashedPassword,
        role: 'admin',
        isApproved: true,
        isActive: true,
        firstName: 'System',
        lastName: 'Admin',
        updatedAt: new Date()
      }
    });
    
    console.log(`--- Admin Reset Successful ---`);
    console.log(`Email: ${user.email}`);
    console.log(`New Password: admin123`);
    console.log(`Role: ${user.role}`);
  } catch (error) {
    console.error('Error resetting admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdmin();
