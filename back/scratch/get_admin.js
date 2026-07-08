import prisma from '../config/db.js';

async function main() {
    const users = await prisma.user.findMany({
        select: {
            email: true,
            role: true
        }
    });
    console.log("Users in Database:", users);
    process.exit(0);
}
main();
