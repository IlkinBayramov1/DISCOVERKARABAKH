import prisma from './config/db.js';
import { hashPassword } from './utils/hash.util.js';
import crypto from 'crypto';

async function createAdmin() {
    try {
        console.log('Checking for admin user...');
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@discoverkarabakh.com' }
        });

        if (existingAdmin) {
            console.log('Admin user already exists. Resetting password to admin123...');
            const hashedPassword = await hashPassword('admin123');
            await prisma.user.update({
                where: { email: 'admin@discoverkarabakh.com' },
                data: {
                    password: hashedPassword,
                    role: 'admin',
                    isApproved: true,
                    isActive: true,
                    isBanned: false
                }
            });
            console.log('Admin password reset successfully!');
        } else {
            console.log('Admin user not found. Creating new admin user...');
            const hashedPassword = await hashPassword('admin123');
            await prisma.user.create({
                data: {
                    id: crypto.randomUUID(),
                    email: 'admin@discoverkarabakh.com',
                    password: hashedPassword,
                    firstName: 'System',
                    lastName: 'Admin',
                    role: 'admin',
                    isApproved: true,
                    isActive: true,
                    isBanned: false,
                    updatedAt: new Date()
                }
            });
            console.log('Admin user created successfully!');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
