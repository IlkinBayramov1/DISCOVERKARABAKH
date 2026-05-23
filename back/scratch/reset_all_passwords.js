import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    const prefix = user.email.split('@')[0];
    const passwordText = prefix === 'admin' ? 'admin123' : `${prefix}123`;
    const hashedPassword = await bcrypt.hash(passwordText, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    console.log(`Password for ${user.email} reset to: ${passwordText}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
