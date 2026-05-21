import { userRepository } from '../modules/users/user.repository.js';
import prisma from '../config/db.js';

async function testLoginRepo() {
  try {
    console.log('--- Test Başlayır ---');
    // Verilənlər bazasındakı hər hansı bir istifadəçini götürək
    const firstUser = await prisma.user.findFirst();
    
    if (!firstUser) {
      console.log('Bazada istifadəçi tapılmadı, test ləğv edildi.');
      return;
    }

    console.log(`İstifadəçi yoxlanılır: ${firstUser.email}`);
    
    const user = await userRepository.findByEmail(firstUser.email);
    console.log('Tapılan istifadəçi (şifrəsiz):', { ...user, password: '***' });
    
    if (user && (user.vendorprofile || user.role !== 'vendor')) {
      console.log('TEST UĞURLU: findByEmail artıq xəta vermir.');
    } else {
      console.log('TEST QEYRİ-MÜƏYYƏN: İstifadəçi tapıldı, lakin vendor profili yoxdur (əgər vendorsunuzsa).');
    }
  } catch (error) {
    console.error('TEST UĞURSUZ: Xəta hələ də davam edir:');
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

testLoginRepo();
