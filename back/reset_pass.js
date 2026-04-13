import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  await prisma.user.update({
    where: { email: 'ilkinresident@gmail.com' },
    data: { password: hashedPassword }
  });
  console.log('Password for ilkinresident@gmail.com reset to: 123456');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
