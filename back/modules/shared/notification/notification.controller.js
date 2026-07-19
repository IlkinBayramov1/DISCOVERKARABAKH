import prisma from '../../../config/db.js';
import { ApiError } from '../../../core/api.error.js';

export const getMyNotifications = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const userId = req.user.id;
        const userRole = req.user.role;

        // Targets: specific userId, 'all', or 'vendor' if user has vendor role, 'guest' if user has resident/tourist/user role
        const targets = [userId, 'all'];
        if (userRole === 'vendor') {
            targets.push('vendor');
        } else if (['resident', 'tourist', 'user'].includes(userRole)) {
            targets.push('guest');
        }

        const where = {
            target: { in: targets }
        };

        const [notifications, total, unreadCount] = await prisma.$transaction([
            prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.notification.count({ where }),
            prisma.notification.count({
                where: { ...where, isRead: false }
            })
        ]);

        // Map links based on bookingType in bulk
        const bookingIds = notifications.filter(n => n.bookingId).map(n => n.bookingId);
        let bookingTypeMap = {};
        if (bookingIds.length > 0) {
            const bookings = await prisma.booking.findMany({
                where: { id: { in: bookingIds } },
                select: { id: true, bookingType: true }
            });
            bookingTypeMap = bookings.reduce((acc, b) => {
                acc[b.id] = b.bookingType;
                return acc;
            }, {});
        }

        const formattedNotifications = notifications.map(n => {
            let link = null;
            if (n.bookingId && bookingTypeMap[n.bookingId]) {
                const bType = bookingTypeMap[n.bookingId];
                if (bType === 'hotel') link = '/reservations';
                else if (bType === 'transfer' || bType === 'transport') link = '/transport/orders';
                else if (bType === 'tour') link = '/tours/bookings';
                else if (bType === 'attraction') link = '/attractions/bookings';
            }
            return {
                id: n.id,
                type: n.type,
                title: n.title,
                message: n.message,
                createdAt: n.createdAt,
                isRead: n.isRead,
                link
            };
        });

        res.status(200).json({
            success: true,
            data: {
                notifications: formattedNotifications,
                unreadCount,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Ensure notification exists
        const notification = await prisma.notification.findFirst({
            where: { id }
        });

        if (!notification) {
            throw ApiError.notFound('Notification not found');
        }

        // Verify authorization (target: userId, 'all', or 'vendor'/'guest' matching user role)
        const isTargeted = notification.target === userId || 
            notification.target === 'all' || 
            (notification.target === 'vendor' && req.user.role === 'vendor') ||
            (notification.target === 'guest' && ['resident', 'tourist', 'user'].includes(req.user.role));

        if (!isTargeted) {
            throw ApiError.forbidden('Unauthorized');
        }

        const updated = await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: updated
        });
    } catch (error) {
        next(error);
    }
};

export const markAllAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        const targets = [userId, 'all'];
        if (userRole === 'vendor') {
            targets.push('vendor');
        } else if (['resident', 'tourist', 'user'].includes(userRole)) {
            targets.push('guest');
        }

        await prisma.notification.updateMany({
            where: {
                target: { in: targets },
                isRead: false
            },
            data: { isRead: true }
        });

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        next(error);
    }
};

export const deleteNotification = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const notification = await prisma.notification.findFirst({
            where: { id }
        });

        if (!notification) {
            throw ApiError.notFound('Notification not found');
        }

        const isTargeted = notification.target === userId || 
            notification.target === 'all' || 
            (notification.target === 'vendor' && req.user.role === 'vendor') ||
            (notification.target === 'guest' && ['resident', 'tourist', 'user'].includes(req.user.role));

        if (!isTargeted) {
            throw ApiError.forbidden('Unauthorized');
        }

        await prisma.notification.delete({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: 'Notification deleted'
        });
    } catch (error) {
        next(error);
    }
};
