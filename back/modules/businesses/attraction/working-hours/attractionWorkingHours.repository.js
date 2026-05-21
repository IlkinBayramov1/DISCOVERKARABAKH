import prisma from '../../../../config/db.js';

class AttractionWorkingHoursRepository {
    async upsert(attractionId, dayOfWeek, data) {
        return await prisma.attractionWorkingHour.upsert({
            where: {
                attractionId_dayOfWeek: {
                    attractionId,
                    dayOfWeek
                }
            },
            update: data,
            create: {
                attractionId,
                dayOfWeek,
                ...data
            }
        });
    }

    async findByAttractionId(attractionId) {
        return await prisma.attractionWorkingHour.findMany({
            where: { attractionId },
            orderBy: { dayOfWeek: 'asc' }
        });
    }
}

export const attractionWorkingHoursRepository = new AttractionWorkingHoursRepository();
