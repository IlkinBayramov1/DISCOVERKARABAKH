import prisma from '../../../config/db.js';
import crypto from 'crypto';

function mapDriver(driver) {
    if (!driver) return null;
    
    let licenseImages = [];
    let idCardImages = [];
    
    try {
        licenseImages = driver.licenseImages ? JSON.parse(driver.licenseImages) : [];
    } catch (err) {
        licenseImages = []; // Legacy data handling
    }
    
    try {
        idCardImages = driver.idCardImages ? JSON.parse(driver.idCardImages) : [];
    } catch (err) {
        idCardImages = []; // Legacy data handling
    }

    return {
        ...driver,
        licenseImages,
        idCardImages,
        licenseCategories: driver.licenseCategories
            ? driver.licenseCategories.split(',').map(c => c.trim())
            : []
    };
}

class DriverRepository {
    async create(data) {
        const { licenseImages, idCardImages, licenseCategories, ...rest } = data;
        const insertData = {
            id: data.id || crypto.randomUUID(),
            ...rest,
        };

        if (licenseImages) {
            insertData.licenseImages = typeof licenseImages === 'string' ? licenseImages : JSON.stringify(licenseImages);
        }
        if (idCardImages) {
            insertData.idCardImages = typeof idCardImages === 'string' ? idCardImages : JSON.stringify(idCardImages);
        }
        if (licenseCategories) {
            insertData.licenseCategories = Array.isArray(licenseCategories) 
                ? Array.from(new Set(licenseCategories.map(c => c.trim()))).join(',')
                : licenseCategories;
        }

        const created = await prisma.driverprofile.create({
            data: insertData,
        });
        return mapDriver(created);
    }

    async findByUserId(userId) {
        const driver = await prisma.driverprofile.findUnique({
            where: { userId },
            include: {
                user_driverprofile_userIdTouser: { select: { email: true } },
                user_driverprofile_managedByIdTouser: { select: { vendorprofile: { select: { companyName: true } } } },
                vehicle: true
            }
        });
        return mapDriver(driver);
    }

    async findById(id) {
        const driver = await prisma.driverprofile.findUnique({
            where: { id },
            include: {
                user_driverprofile_userIdTouser: { select: { email: true } },
                user_driverprofile_managedByIdTouser: { select: { vendorprofile: { select: { companyName: true } } } },
                vehicle: true
            }
        });
        return mapDriver(driver);
    }

    async findAll(filter = {}, skip = 0, take = 10) {
        const where = {};
        if (filter.managedById) where.managedById = filter.managedById;
        if (filter.status) where.status = filter.status;
        if (filter.search) {
            where.OR = [
                { firstName: { contains: filter.search } },
                { lastName: { contains: filter.search } },
                { phone: { contains: filter.search } }
            ];
        }

        const count = await prisma.driverprofile.count({ where });
        const drivers = await prisma.driverprofile.findMany({
            where,
            skip,
            take,
            orderBy: { id: 'desc' }, // or createdAt if available
            include: {
                user_driverprofile_userIdTouser: { select: { email: true } },
                user_driverprofile_managedByIdTouser: { select: { vendorprofile: { select: { companyName: true } } } },
                vehicle: { select: { brand: true, model: true, plateNumber: true } },
                cargovehicle: { select: { brand: true, model: true, licensePlate: true } }
            }
        });

        return { count, drivers: drivers.map(d => mapDriver(d)) };
    }

    async update(id, data) {
        const { licenseImages, idCardImages, licenseCategories, ...rest } = data;
        const updateData = {
            ...rest,
        };

        if (licenseImages !== undefined) {
            updateData.licenseImages = licenseImages ? (typeof licenseImages === 'string' ? licenseImages : JSON.stringify(licenseImages)) : null;
        }
        if (idCardImages !== undefined) {
            updateData.idCardImages = idCardImages ? (typeof idCardImages === 'string' ? idCardImages : JSON.stringify(idCardImages)) : null;
        }
        if (licenseCategories !== undefined) {
            updateData.licenseCategories = licenseCategories 
                ? (Array.isArray(licenseCategories) 
                    ? Array.from(new Set(licenseCategories.map(c => c.trim()))).join(',') 
                    : licenseCategories)
                : null;
        }

        const updated = await prisma.driverprofile.update({
            where: { id },
            data: updateData,
        });
        return mapDriver(updated);
    }

    async delete(id) {
        return prisma.driverprofile.delete({
            where: { id },
        });
    }
}

export const driverRepository = new DriverRepository();

