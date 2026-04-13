import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    console.log('Finding user...');
    const user = await prisma.user.findUnique({ where: { email: 'ilkinresident@gmail.com' } });
    if (user) {
        console.log('Deleting driver profile for:', user.email);
        await prisma.driverProfile.deleteMany({ where: { userId: user.id } });
        await prisma.user.update({
            where: { id: user.id },
            data: { role: 'resident' } // Resetting role
        });
        console.log('User profile reset so they can register again');
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
