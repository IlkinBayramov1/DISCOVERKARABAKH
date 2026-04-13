import prisma from '../../../../config/db.js';

class InventoryLockService {
    /**
     * Attempts to acquire a lock for a room type and date range.
     * @returns {Promise<string|null>} The lock ID if successful, null otherwise.
     */
    async acquireLock(userId, roomTypeId, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const expirationMinutes = 10;
        const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

        // 1. Calculate how many rooms are actually available for each night
        // by subtracting reservedRooms AND active locks from totalRooms.
        
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        
        // We use a transaction to ensure we don't have race conditions during lock acquisition
        return prisma.$transaction(async (tx) => {
            // Check availability for each date
            for (let i = 0; i < nights; i++) {
                const currentDate = new Date(start);
                currentDate.setDate(start.getDate() + i);

                const availability = await tx.roomAvailability.findUnique({
                    where: {
                        roomTypeId_date: {
                            roomTypeId,
                            date: currentDate
                        }
                    }
                });

                if (!availability) {
                    throw new Error(`No availability data for ${currentDate.toISOString().split('T')[0]}`);
                }

                // Count active locks for this date
                const activeLocks = await tx.inventoryLock.count({
                    where: {
                        roomTypeId,
                        startDate: { lte: currentDate },
                        endDate: { gt: currentDate },
                        expiresAt: { gt: new Date() }
                    }
                });

                const trulyAvailable = availability.totalRooms - (availability.reservedRooms + activeLocks);

                if (trulyAvailable <= 0) {
                    return null; // No rooms left
                }
            }

            // If we reached here, it means all nights are available
            const lock = await tx.inventoryLock.create({
                data: {
                    roomTypeId,
                    startDate: start,
                    endDate: end,
                    userId: userId || 'anonymous',
                    expiresAt
                }
            });

            return lock.id;
        });
    }

    async getActiveLocksForDate(roomTypeId, date) {
        const d = new Date(date);
        return prisma.inventoryLock.count({
            where: {
                roomTypeId,
                startDate: { lte: d },
                endDate: { gt: d },
                expiresAt: { gt: new Date() }
            }
        });
    }

    async releaseLock(lockId) {
        try {
            await prisma.inventoryLock.delete({
                where: { id: lockId }
            });
        } catch (e) {
            // Lock might already be deleted or expired
        }
    }

    /**
     * Deletes all expired locks from the database.
     * Can be called by a cron job.
     */
    async cleanupExpiredLocks() {
        return prisma.inventoryLock.deleteMany({
            where: {
                expiresAt: { lte: new Date() }
            }
        });
    }
}

export const inventoryLockService = new InventoryLockService();
