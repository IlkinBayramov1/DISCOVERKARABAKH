import { userRepository } from '../users/user.repository.js';
import { ApiError } from '../../core/api.error.js';
import prisma from '../../config/db.js';
import { utilityService } from '../businesses/utility/utility.service.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isBanned: true,
        isApproved: true,
        createdAt: true,
        vendorprofile: true,
        _count: {
          select: {
            hotel: true,
            restaurant: true,
            tour: true,
            vehicle: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Get base user details and role
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        isBanned: true,
        isApproved: true,
        createdAt: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        balance: true
      }
    });

    if (!user) {
      throw ApiError.notFound('İstifadəçi tapılmadı');
    }

    // 2. Fetch specific profile dynamically based on role to avoid multiple LEFT JOINs
    let profile = null;
    const role = user.role;

    if (role === 'tourist' || role === 'user') {
      profile = await prisma.touristprofile.findUnique({ where: { userId: id } });
    } else if (role === 'resident') {
      profile = await prisma.residentprofile.findUnique({ where: { userId: id } });
    } else if (role === 'investor') {
      profile = await prisma.investorprofile.findUnique({ where: { userId: id } });
    } else if (role === 'driver') {
      profile = await prisma.driverprofile.findUnique({
        where: { userId: id },
        include: { vehicle: true }
      });
    } else if (role === 'vendor') {
      profile = await prisma.vendorprofile.findUnique({ where: { userId: id } });
    }

    res.status(200).json({
      success: true,
      data: {
        ...user,
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.params.id);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    await userRepository.delete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const banUser = async (req, res, next) => {
  try {
    const user = await userRepository.update(req.params.id, { isBanned: true });
    // Prisma throws if not found usually, but update returns object. 
    // If we want safe check, findById first or handle prisma error.
    // updateUser in repo assumes ID exists or prisma throws.
    // Let's rely on repo or wrap. Repo update maps to prisma.update which throws P2025 if not found.

    res.status(200).json({ success: true, message: 'User banned', data: user });
  } catch (error) {
    // Handle Prisma "Record to update not found."
    if (error.code === 'P2025') return next(ApiError.notFound('User not found'));
    next(error);
  }
};

export const unbanUser = async (req, res, next) => {
  try {
    const user = await userRepository.update(req.params.id, { isBanned: false });
    res.status(200).json({ success: true, message: 'User unbanned', data: user });
  } catch (error) {
    if (error.code === 'P2025') return next(ApiError.notFound('User not found'));
    next(error);
  }
};

export const approveUser = async (req, res, next) => {
  try {
    const user = await userRepository.update(req.params.id, { isApproved: true });
    res.status(200).json({ success: true, message: 'User approved', data: user });
  } catch (error) {
    if (error.code === 'P2025') return next(ApiError.notFound('User not found'));
    next(error);
  }
};

export const rejectUser = async (req, res, next) => {
  try {
    const user = await userRepository.update(req.params.id, { isApproved: false });
    res.status(200).json({ success: true, message: 'User rejected (isApproved=false)', data: user });
  } catch (error) {
    if (error.code === 'P2025') return next(ApiError.notFound('User not found'));
    next(error);
  }
};

// ============================================
// Business (Hotel/Tour/Attraction/Utility/Transport) Governance
// =============================================================

export const getPendingBusinesses = async (req, res, next) => {
    try {
        const [hotels, tours, attractions, utilityLogs, vehicles] = await Promise.all([
            prisma.hotel.findMany({
                where: { status: 'pending' },
                include: { 
                    user: { select: { email: true, phone: true, firstName: true, lastName: true, balance: true } },
                    booking: { include: { user: { select: { email: true, phone: true } } } },
                    review: true
                }
            }),
            prisma.tour.findMany({
                where: { status: 'pending' },
                include: { 
                    user: { select: { email: true, phone: true, firstName: true, lastName: true, balance: true } },
                    booking: { include: { user: { select: { email: true, phone: true } } } },
                    review: true
                }
            }),
            prisma.attraction.findMany({
                where: { status: 'pending' },
                include: { 
                    user: { select: { email: true, phone: true, firstName: true, lastName: true, balance: true } },
                    booking: { include: { user: { select: { email: true, phone: true } } } },
                    review: true
                }
            }),
            prisma.utilityuploadlog.findMany({
                where: { isRolledBack: false },
                include: { admin: { select: { email: true, phone: true, firstName: true, lastName: true } } }
            }),
            prisma.vehicle.findMany({
                where: { status: 'Inactive' },
                include: { 
                    user: { select: { email: true, phone: true, firstName: true, lastName: true, balance: true } },
                    booking: { include: { user: { select: { email: true, phone: true } } } },
                    ride: true
                }
            })
        ]);

        const utilityWithBills = await Promise.all(utilityLogs.map(async log => {
            const bills = await prisma.utilitybill.findMany({
                where: { batchId: log.batchId }
            });
            const totalAmount = bills.reduce((sum, b) => sum + b.amount, 0);
            const totalPaid = bills.reduce((sum, b) => sum + b.paidAmount, 0);
            return {
                ...log,
                totalAmount,
                totalPaid,
                bills
            };
        }));

        res.status(200).json({
            success: true,
            data: {
                hotels,
                tours,
                attractions,
                utility: utilityWithBills,
                transport: vehicles
            }
        });
    } catch (error) {
        next(error);
    }
};

const formatBusiness = (biz, type) => {
    if (!biz) return null;
    if (type === 'hotel') {
        const images = biz.hotelimage ? biz.hotelimage.map(img => ({ url: img.url, order: img.order })) : [];
        return { ...biz, bizType: 'hotel', images };
    }
    if (type === 'tour') {
        let images = [];
        if (typeof biz.images === 'string') {
            try {
                images = JSON.parse(biz.images);
            } catch (e) {
                images = biz.images ? biz.images.split(',') : [];
            }
        } else if (Array.isArray(biz.images)) {
            images = biz.images;
        }
        return { ...biz, bizType: 'tour', images };
    }
    if (type === 'attraction') {
        const images = biz.attractionimage ? biz.attractionimage.map(img => ({ url: img.url, order: img.order })) : [];
        return { ...biz, bizType: 'attraction', images };
    }
    if (type === 'transport') {
        let images = [];
        if (typeof biz.images === 'string') {
            try {
                images = JSON.parse(biz.images);
            } catch (e) {
                images = biz.images ? biz.images.split(',') : [];
            }
        } else if (Array.isArray(biz.images)) {
            images = biz.images;
        }
        return { ...biz, bizType: 'transport', images };
    }
    return biz;
};

export const getAllBusinesses = async (req, res, next) => {
    try {
        const { type, status } = req.query; // type: 'hotel' | 'tour' | 'attraction' | 'utility' | 'transport'
        
        let data;
        let count = 0;

        if (type === 'hotel') {
            const where = status ? { status } : {};
            const rawData = await prisma.hotel.findMany({ 
                where, 
                include: { 
                    user: { select: { email: true, phone: true, firstName: true, lastName: true, balance: true } },
                    booking: { include: { user: { select: { email: true, phone: true } } } },
                    review: true,
                    hotelimage: true
                },
                orderBy: { createdAt: 'desc' }
            });
            data = rawData.map(b => formatBusiness(b, 'hotel'));
            count = data.length;
        } else if (type === 'tour') {
            const where = status ? { status } : {};
            const rawData = await prisma.tour.findMany({ 
                where, 
                include: { 
                    user: { select: { email: true, phone: true, firstName: true, lastName: true, balance: true } },
                    booking: { include: { user: { select: { email: true, phone: true } } } },
                    review: true
                },
                orderBy: { createdAt: 'desc' }
            });
            data = rawData.map(b => formatBusiness(b, 'tour'));
            count = data.length;
        } else if (type === 'attraction') {
            const where = status ? { status } : {};
            const rawData = await prisma.attraction.findMany({ 
                where, 
                include: { 
                    user: { select: { email: true, phone: true, firstName: true, lastName: true, balance: true } },
                    booking: { include: { user: { select: { email: true, phone: true } } } },
                    review: true,
                    attractionimage: true
                },
                orderBy: { createdAt: 'desc' }
            });
            data = rawData.map(b => formatBusiness(b, 'attraction'));
            count = data.length;
        } else if (type === 'utility') {
            const where = status === 'active' ? { isRolledBack: false } : status === 'rejected' ? { isRolledBack: true } : {};
            const logs = await prisma.utilityuploadlog.findMany({
                where,
                include: { admin: { select: { email: true, phone: true, firstName: true, lastName: true } } },
                orderBy: { createdAt: 'desc' }
            });
            data = await Promise.all(logs.map(async log => {
                const bills = await prisma.utilitybill.findMany({
                    where: { batchId: log.batchId }
                });
                const totalAmount = bills.reduce((sum, b) => sum + b.amount, 0);
                const totalPaid = bills.reduce((sum, b) => sum + b.paidAmount, 0);
                return {
                    ...log,
                    totalAmount,
                    totalPaid,
                    bills
                };
            }));
            count = data.length;
        } else if (type === 'transport') {
            let dbStatus;
            if (status === 'active') dbStatus = 'Active';
            else if (status === 'inactive' || status === 'rejected') dbStatus = 'Inactive';
            
            const where = dbStatus ? { status: dbStatus } : {};
            const rawData = await prisma.vehicle.findMany({ 
                where, 
                include: { 
                    user: { select: { email: true, phone: true, firstName: true, lastName: true, balance: true } },
                    booking: { include: { user: { select: { email: true, phone: true } } } },
                    ride: true
                },
                orderBy: { createdAt: 'desc' }
            });
            data = rawData.map(b => formatBusiness(b, 'transport'));
            count = data.length;
        } else {
            const [hotelsRaw, toursRaw, attractionsRaw, rawUtilityLogs, vehiclesRaw] = await Promise.all([
                prisma.hotel.findMany({ 
                    include: { 
                        user: { select: { email: true, phone: true, firstName: true, lastName: true, balance: true } },
                        booking: { include: { user: { select: { email: true, phone: true } } } },
                        review: true,
                        hotelimage: true
                    },
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.tour.findMany({ 
                    include: { 
                        user: { select: { email: true, phone: true, firstName: true, lastName: true, balance: true } },
                        booking: { include: { user: { select: { email: true, phone: true } } } },
                        review: true
                    },
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.attraction.findMany({ 
                    include: { 
                        user: { select: { email: true, phone: true, firstName: true, lastName: true, balance: true } },
                        booking: { include: { user: { select: { email: true, phone: true } } } },
                        review: true,
                        attractionimage: true
                    },
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.utilityuploadlog.findMany({ 
                    include: { admin: { select: { email: true, phone: true, firstName: true, lastName: true } } },
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.vehicle.findMany({ 
                    include: { 
                        user: { select: { email: true, phone: true, firstName: true, lastName: true, balance: true } },
                        booking: { include: { user: { select: { email: true, phone: true } } } },
                        ride: true
                    },
                    orderBy: { createdAt: 'desc' }
                })
            ]);

            const hotels = hotelsRaw.map(b => formatBusiness(b, 'hotel'));
            const tours = toursRaw.map(b => formatBusiness(b, 'tour'));
            const attractions = attractionsRaw.map(b => formatBusiness(b, 'attraction'));
            const transport = vehiclesRaw.map(b => formatBusiness(b, 'transport'));

            const utility = await Promise.all(rawUtilityLogs.map(async log => {
                const bills = await prisma.utilitybill.findMany({
                    where: { batchId: log.batchId }
                });
                const totalAmount = bills.reduce((sum, b) => sum + b.amount, 0);
                const totalPaid = bills.reduce((sum, b) => sum + b.paidAmount, 0);
                return {
                    ...log,
                    totalAmount,
                    totalPaid,
                    bills
                };
            }));

            data = { hotels, tours, attractions, utility, transport };
            count = hotels.length + tours.length + attractions.length + utility.length + transport.length;
        }

        res.status(200).json({
            success: true,
            count,
            data
        });
    } catch (error) {
        next(error);
    }
};

export const approveBusiness = async (req, res, next) => {
    try {
        const { type, id } = req.params;
        let updated;

        if (type === 'hotel') {
            updated = await prisma.hotel.update({ where: { id }, data: { status: 'active' } });
        } else if (type === 'tour') {
            updated = await prisma.tour.update({ where: { id }, data: { status: 'active' } });
        } else if (type === 'attraction') {
            updated = await prisma.attraction.update({ where: { id }, data: { status: 'active' } });
        } else if (type === 'transport') {
            updated = await prisma.vehicle.update({ where: { id }, data: { status: 'Active' } });
        } else if (type === 'utility') {
            // Approving utility uploads is a no-op since it's already active on upload
            updated = await prisma.utilityuploadlog.findFirst({
                where: { OR: [{ id }, { batchId: id }] }
            });
            if (!updated) throw ApiError.notFound('Utility upload log not found');
        } else {
            throw ApiError.badRequest('Unknown business type for approval');
        }

        res.status(200).json({
            success: true,
            message: `${type.toUpperCase()} approved successfully!`,
            data: updated
        });
    } catch (error) {
        if (error.code === 'P2025') return next(ApiError.notFound('Business not found'));
        next(error);
    }
};

export const rejectBusiness = async (req, res, next) => {
    try {
        const { type, id } = req.params;
        let updated;

        if (type === 'hotel') {
            updated = await prisma.hotel.update({ where: { id }, data: { status: 'rejected' } });
        } else if (type === 'tour') {
            updated = await prisma.tour.update({ where: { id }, data: { status: 'rejected' } });
        } else if (type === 'attraction') {
            updated = await prisma.attraction.update({ where: { id }, data: { status: 'rejected' } });
        } else if (type === 'transport') {
            updated = await prisma.vehicle.update({ where: { id }, data: { status: 'Inactive' } });
        } else if (type === 'utility') {
            const log = await prisma.utilityuploadlog.findFirst({
                where: { OR: [{ id }, { batchId: id }] }
            });
            if (!log) throw ApiError.notFound('Utility upload log not found');
            updated = await utilityService.rollbackUpload(req.user.id, log.batchId);
        } else {
            throw ApiError.badRequest('Unknown business type for rejection');
        }

        res.status(200).json({
            success: true,
            message: `${type.toUpperCase()} rejected/rolled back successfully!`,
            data: updated
        });
    } catch (error) {
        if (error.code === 'P2025') return next(ApiError.notFound('Business not found'));
        next(error);
    }
};

/**
 * ============================================
 * Bron İdarəetməsi (Booking Management)
 * ============================================
 */

/** Bütün platforma üzrə bronları gətirir */
export const getAllBookings = async (req, res, next) => {
    try {
        const { status, type, vendorId, userId, entityId, page = 1, limit = 10, search } = req.query;
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        const where = {};
        if (status) where.status = status;
        if (type) where.bookingType = type;
        if (vendorId) where.vendorId = vendorId;
        if (userId) where.userId = userId;
        if (entityId) where.entityId = entityId;
        if (search) {
            where.OR = [
                { bookingNumber: { contains: search } },
                { user: { email: { contains: search } } }
            ];
        }

        const [bookings, totalCount] = await Promise.all([
            prisma.booking.findMany({
                where,
                include: {
                    user: { select: { email: true, phone: true } },
                    hotel: { select: { name: true, address: true, city: true } },
                    tour: { select: { name: true, address: true, city: true } },
                    attraction: { select: { name: true, address: true, city: true } },
                    event: { select: { title: true, location: true, city: true } },
                    vehicle: { select: { brand: true, model: true, plateNumber: true } },
                    bookingitem: true,
                    guest: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum
            }),
            prisma.booking.count({ where })
        ]);

        res.status(200).json({
            success: true,
            data: bookings,
            pagination: {
                total: totalCount,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(totalCount / limitNum)
            }
        });
    } catch (error) {
        next(error);
    }
};

/** Bronun detallarını gətirir */
export const getBookingDetails = async (req, res, next) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: req.params.id },
            include: {
                user: { select: { email: true, phone: true } },
                bookingitem: true,
                guest: true,
                bookingauditlog: true,
                hotel: { select: { name: true, address: true, city: true } },
                tour: { select: { name: true, address: true, city: true } },
                attraction: { select: { name: true, address: true, city: true } },
                event: { select: { title: true, location: true, city: true } },
                vehicle: { select: { brand: true, model: true, plateNumber: true } }
            }
        });

        if (!booking) throw ApiError.notFound('Bron tapılmadı');
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
};

/** Bron statusunu yeniləyir */
export const updateBookingStatus = async (req, res, next) => {
    try {
        const { status, note } = req.body;
        const bookingId = req.params.id;

        const updated = await prisma.$transaction(async (tx) => {
            const b = await tx.booking.update({
                where: { id: bookingId },
                data: { status }
            });

            await tx.bookingauditlog.create({
                data: {
                    bookingId,
                    action: `STATUS_CHANGE_TO_${status.toUpperCase()}`,
                    meta: { note, updatedAt: new Date() }
                }
            });

            return b;
        });

        res.status(200).json({ success: true, message: 'Status yeniləndi', data: updated });
    } catch (error) {
        next(error);
    }
};

/**
 * ============================================
 * Rəy Moderasiyası (Review Moderation)
 * ============================================
 */

/** Bütün rəyləri (ve ya tip üzrə) gətirir */
export const getAllReviews = async (req, res, next) => {
    try {
        const { type, status, rating } = req.query; // type: 'general' | 'room' | 'attraction'
        const where = status ? { status } : {};
        if (rating) where.rating = Number(rating);

        let data;
        if (type === 'room') {
            data = await prisma.roomReview.findMany({
                where,
                include: { user: { select: { email: true } }, roomType: { select: { name: true } } },
                orderBy: { createdAt: 'desc' }
            });
        } else if (type === 'attraction') {
            data = await prisma.attractionReview.findMany({
                where,
                include: { user: { select: { email: true } }, attraction: { select: { name: true } } },
                orderBy: { createdAt: 'desc' }
            });
        } else {
            // Default: General reviews
            data = await prisma.review.findMany({
                where,
                include: { 
                    user: { select: { email: true } },
                    hotel: { select: { name: true } },
                    restaurant: { select: { name: true } },
                    tour: { select: { name: true } }
                },
                orderBy: { createdAt: 'desc' }
            });
        }

        res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
        next(error);
    }
};

/** Rəyi təsdiqləyir və ya rədd edir */
export const updateReviewStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, type } = req.body; // type: 'general' | 'attraction' (room has no status in schema)

        let updated;
        if (type === 'attraction') {
            updated = await prisma.attractionReview.update({ where: { id }, data: { status } });
        } else {
            updated = await prisma.review.update({ where: { id }, data: { status } });
        }

        res.status(200).json({ success: true, message: 'Rəy statusu yeniləndi', data: updated });
    } catch (error) {
        if (error.code === 'P2025') return next(ApiError.notFound('Rəy tapılmadı'));
        next(error);
    }
};

/** Rəyi tamamilə silir */
export const deleteReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { type } = req.query;

        if (type === 'room') {
            await prisma.roomReview.delete({ where: { id } });
        } else if (type === 'attraction') {
            await prisma.attractionReview.delete({ where: { id } });
        } else {
            await prisma.review.delete({ where: { id } });
        }

        res.status(200).json({ success: true, message: 'Rəy silindi' });
    } catch (error) {
        if (error.code === 'P2025') return next(ApiError.notFound('Rəy tapılmadı'));
        next(error);
    }
};

/**
 * ============================================
 * Maliyyə və Tranzaksiyalar (Financial Control)
 * ============================================
 */

/** Bütün ödəniş tranzaksiyalarını gətirir */
export const getAllTransactions = async (req, res, next) => {
    try {
        const { status, provider, startDate, endDate, page = 1, limit = 10, search } = req.query;
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = limit === 'all' ? undefined : (parseInt(limit, 10) || 10);
        const skip = limit === 'all' ? undefined : ((pageNum - 1) * limitNum);

        const where = {};
        if (status) where.status = status;
        if (provider) where.provider = provider;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                where.createdAt.lte = end;
            }
        }
        if (search) {
            where.OR = [
                { id: { contains: search } },
                { providerTransId: { contains: search } },
                { booking: { bookingNumber: { contains: search } } },
                { booking: { user: { email: { contains: search } } } }
            ];
        }

        const count = await prisma.paymenttransaction.count({ where });
        const transactions = await prisma.paymenttransaction.findMany({
            where,
            include: {
                booking: {
                    select: {
                        bookingNumber: true,
                        totalPrice: true,
                        currency: true,
                        user: { select: { email: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limitNum
        });

        res.status(200).json({ 
            success: true, 
            count: transactions.length, 
            pagination: limit === 'all' ? null : {
                total: count,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(count / limitNum)
            },
            data: transactions 
        });
    } catch (error) {
        next(error);
    }
};

/** Şirkətlərin dövriyyə və geri ödəniş (Refund) statistikasını gətirir */
export const getCompanyTurnoverStats = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        
        const where = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                where.createdAt.lte = end;
            }
        }

        const bookings = await prisma.booking.findMany({
            where: {
                ...where,
                status: { in: ['confirmed', 'checked_in', 'checked_out', 'refunded', 'cancelled'] }
            },
            include: {
                paymenttransaction: true
            }
        });

        const companyMap = {};

        for (const booking of bookings) {
            const key = `${booking.bookingType}_${booking.entityId}`;
            if (!companyMap[key]) {
                companyMap[key] = {
                    entityId: booking.entityId,
                    type: booking.bookingType,
                    bookingsCount: 0,
                    grossTurnover: 0,
                    totalRefunds: 0,
                    netTurnover: 0
                };
            }

            const stats = companyMap[key];
            stats.bookingsCount += 1;

            const isPaid = ['confirmed', 'checked_in', 'checked_out', 'refunded'].includes(booking.status) || 
                           ['captured', 'success', 'completed'].includes(booking.paymentStatus?.toLowerCase() || '');

            if (isPaid) {
                stats.grossTurnover += booking.totalPrice;
            }

            if (booking.status === 'refunded') {
                stats.totalRefunds += booking.totalPrice;
            } else if (booking.status === 'cancelled') {
                const hasRefund = booking.paymenttransaction?.some(pt => pt.status === 'refunded');
                if (hasRefund) {
                    stats.totalRefunds += booking.totalPrice;
                }
            }
        }

        const results = await Promise.all(Object.values(companyMap).map(async (stats) => {
            let name = 'Unknown Business';
            let vendorId = null;
            let city = null;

            try {
                if (stats.type === 'hotel') {
                    const data = await prisma.hotel.findUnique({
                        where: { id: stats.entityId },
                        select: { name: true, ownerId: true, city: true }
                    });
                    if (data) {
                        name = data.name;
                        vendorId = data.ownerId;
                        city = data.city;
                    }
                } else if (stats.type === 'tour') {
                    const data = await prisma.tour.findUnique({
                        where: { id: stats.entityId },
                        select: { name: true, ownerId: true, city: true }
                    });
                    if (data) {
                        name = data.name;
                        vendorId = data.ownerId;
                        city = data.city;
                    }
                } else if (stats.type === 'attraction') {
                    const data = await prisma.attraction.findUnique({
                        where: { id: stats.entityId },
                        select: { name: true, vendorId: true, city: true }
                    });
                    if (data) {
                        name = data.name;
                        vendorId = data.vendorId;
                        city = data.city;
                    }
                } else if (stats.type === 'event') {
                    const data = await prisma.event.findUnique({
                        where: { id: stats.entityId },
                        select: { title: true, vendorId: true, city: true }
                    });
                    if (data) {
                        name = data.title;
                        vendorId = data.vendorId;
                        city = data.city;
                    }
                } else if (stats.type === 'transfer' || stats.type === 'transport') {
                    const data = await prisma.vehicle.findUnique({
                        where: { id: stats.entityId },
                        select: { brand: true, model: true, plateNumber: true, vendorId: true }
                    });
                    if (data) {
                        name = `${data.brand} ${data.model} (${data.plateNumber || ''})`.trim();
                        vendorId = data.vendorId;
                    }
                }
            } catch (err) {
                console.error(`Error fetching entity ${stats.entityId}:`, err);
            }

            let vendorEmail = null;
            if (vendorId) {
                const vendorUser = await prisma.user.findUnique({
                    where: { id: vendorId },
                    select: { email: true }
                });
                if (vendorUser) {
                    vendorEmail = vendorUser.email;
                }
            }

            const gross = Math.round(stats.grossTurnover * 100) / 100;
            const refunds = Math.round(stats.totalRefunds * 100) / 100;
            const net = Math.round((gross - refunds) * 100) / 100;

            return {
                ...stats,
                name,
                city,
                vendorEmail,
                grossTurnover: gross,
                totalRefunds: refunds,
                netTurnover: net
            };
        }));

        res.status(200).json({ success: true, data: results });
    } catch (error) {
        next(error);
    }
};

/** İstifadəçilərin cüzdan balansları, depozit, çıxarış və xərclərini gətirir */
export const getUserWalletStats = async (req, res, next) => {
    try {
        const { startDate, endDate, search } = req.query;

        const userWhere = {};
        if (search) {
            userWhere.OR = [
                { email: { contains: search } },
                { firstName: { contains: search } },
                { lastName: { contains: search } }
            ];
        }

        const users = await prisma.user.findMany({
            where: userWhere,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                balance: true,
                createdAt: true
            }
        });

        const txWhere = {};
        if (startDate || endDate) {
            txWhere.createdAt = {};
            if (startDate) txWhere.createdAt.gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                txWhere.createdAt.lte = end;
            }
        }

        const userIds = users.map(u => u.id);

        const [walletTransactions, cardTransactions] = await Promise.all([
            prisma.wallettransaction.findMany({
                where: {
                    userId: { in: userIds },
                    status: 'COMPLETED',
                    ...txWhere
                }
            }),
            prisma.paymenttransaction.findMany({
                where: {
                    booking: { userId: { in: userIds } },
                    status: 'completed',
                    provider: { not: 'wallet' },
                    ...txWhere
                },
                include: {
                    booking: { select: { userId: true } }
                }
            })
        ]);

        const statsMap = {};
        userIds.forEach(id => {
            statsMap[id] = {
                cardSpend: 0,
                walletSpend: 0,
                totalDeposits: 0,
                totalWithdrawals: 0
            };
        });

        for (const tx of walletTransactions) {
            const stats = statsMap[tx.userId];
            if (!stats) continue;

            if (tx.type === 'deposit') {
                stats.totalDeposits += tx.amount;
            } else if (tx.type === 'withdrawal') {
                stats.totalWithdrawals += tx.amount;
            } else if (tx.type === 'payment') {
                stats.walletSpend += tx.amount;
            }
        }

        for (const tx of cardTransactions) {
            const userId = tx.booking?.userId;
            if (!userId) continue;
            const stats = statsMap[userId];
            if (!stats) continue;

            stats.cardSpend += tx.amount;
        }

        const data = users.map(user => {
            const stats = statsMap[user.id] || { cardSpend: 0, walletSpend: 0, totalDeposits: 0, totalWithdrawals: 0 };
            
            const cSpend = Math.round(stats.cardSpend * 100) / 100;
            const wSpend = Math.round(stats.walletSpend * 100) / 100;
            const totalSpent = Math.round((cSpend + wSpend) * 100) / 100;
            const totalDeposits = Math.round(stats.totalDeposits * 100) / 100;
            const totalWithdrawals = Math.round(stats.totalWithdrawals * 100) / 100;

            return {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                balance: Math.round((user.balance || 0) * 100) / 100,
                cardSpend: cSpend,
                walletSpend: wSpend,
                totalSpent,
                totalDeposits,
                totalWithdrawals
            };
        });

        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

/** Müəyyən bir istifadəçinin ətraflı maliyyə hesabatını (cüzdan, kart və rezervasiya tarixçəsini) gətirir */
export const getUserFinancialDetails = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Core istifadəçi məlumatları (balance null-safety ilə)
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                balance: true,
                createdAt: true
            }
        });

        if (!user) throw ApiError.notFound('İstifadəçi tapılmadı');

        // 2. Cüzdan hərəkətləri
        const walletTransactions = await prisma.wallettransaction.findMany({
            where: { userId: id, status: 'COMPLETED' },
            orderBy: { createdAt: 'desc' }
        });

        // 3. Birbaşa bank kartı ilə tamamlanmış ödənişlər (cüzdan yükləmələri bura daxil deyil)
        const cardTransactions = await prisma.paymenttransaction.findMany({
            where: {
                booking: { userId: id },
                status: 'completed',
                provider: { not: 'wallet' }
            },
            include: {
                booking: {
                    select: {
                        bookingNumber: true,
                        bookingType: true,
                        totalPrice: true,
                        currency: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // 4. Rezervasiyalar və xərclər
        const bookings = await prisma.booking.findMany({
            where: { userId: id },
            include: {
                hotel: { select: { name: true, city: true } },
                tour: { select: { name: true, city: true } },
                event: { select: { title: true, city: true } },
                attraction: { select: { name: true, city: true } },
                vehicle: { select: { brand: true, model: true } },
                bookingitem: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            data: {
                user: {
                    ...user,
                    balance: Math.round((user.balance || 0) * 100) / 100
                },
                walletTransactions: walletTransactions.map(tx => ({
                    ...tx,
                    amount: Math.round((tx.amount || 0) * 100) / 100
                })),
                cardTransactions: cardTransactions.map(tx => ({
                    ...tx,
                    amount: Math.round((tx.amount || 0) * 100) / 100
                })),
                bookings: bookings.map(b => {
                    const firstItem = b.bookingitem?.[0];
                    return {
                        id: b.id,
                        bookingNumber: b.bookingNumber,
                        bookingType: b.bookingType,
                        status: b.status,
                        totalPrice: Math.round((b.totalPrice || 0) * 100) / 100,
                        currency: b.currency,
                        createdAt: b.createdAt,
                        startDate: firstItem?.checkIn || null,
                        endDate: firstItem?.checkOut || null,
                        businessName: b.hotel?.name || b.tour?.name || b.event?.title || b.attraction?.name || (b.vehicle ? `${b.vehicle.brand} ${b.vehicle.model}` : 'N/A')
                    };
                })
            }
        });
    } catch (error) {
        next(error);
    }
};

/** Tranzaksiya detallarını gətirir (Bank cavabı daxil olmaqla) */
export const getTransactionDetails = async (req, res, next) => {
    try {
        const transaction = await prisma.paymenttransaction.findUnique({
            where: { id: req.params.id },
            include: {
                booking: {
                    include: { user: { select: { email: true, phone: true } } }
                }
            }
        });

        if (!transaction) throw ApiError.notFound('Tranzaksiya tapılmadı');
        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
};

/**
 * ============================================
 * Promosiyalar və Kuponlar (Promotions)
 * ============================================
 */

/** Bütün aktiv promosiyaları gətirir */
export const getAllPromotions = async (req, res, next) => {
    try {
        const promotions = await prisma.promotion.findMany({
            include: { hotel: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, count: promotions.length, data: promotions });
    } catch (error) {
        next(error);
    }
};

/** Yeni kupon/promosiya yaradır */
export const createPromotion = async (req, res, next) => {
    try {
        const promotion = await prisma.promotion.create({
            data: req.body
        });
        res.status(201).json({ success: true, data: promotion });
    } catch (error) {
        next(error);
    }
};

/** Promosiyanı silir */
export const deletePromotion = async (req, res, next) => {
    try {
        await prisma.promotion.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: 'Promosiya silindi' });
    } catch (error) {
        if (error.code === 'P2025') return next(ApiError.notFound('Promosiya tapılmadı'));
        next(error);
    }
};

/**
 * ============================================
 * Moderasiya (Fraud & Blacklist)
 * ============================================
 */

export const getBlacklist = async (req, res, next) => {
    try {
        const blacklist = await prisma.blacklist.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, data: blacklist });
    } catch (error) {
        next(error);
    }
};

export const addToBlacklist = async (req, res, next) => {
    try {
        const { type, value, reason } = req.body;
        const entry = await prisma.blacklist.create({
            data: { type, value, reason }
        });
        res.status(201).json({ success: true, data: entry });
    } catch (error) {
        next(error);
    }
};

export const removeFromBlacklist = async (req, res, next) => {
    try {
        await prisma.blacklist.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: 'Silindi' });
    } catch (error) {
        next(error);
    }
};

/** Risk loqları (Hələlik mock/simulyasiya) */
export const getRiskLogs = async (req, res, next) => {
    try {
        // Gələcəkdə bu məlumatlar bazadan çəkiləcək
        const mockLogs = [
            { id: '1', action: 'risk_evaluation', details: { score: 85, reasons: ['High cancellation velocity'], isApproved: false }, createdAt: new Date().toISOString() },
            { id: '2', action: 'risk_evaluation', details: { score: 20, reasons: [], isApproved: true }, createdAt: new Date().toISOString() }
        ];
        res.status(200).json({ success: true, data: mockLogs });
    } catch (error) {
        next(error);
    }
};

/**
 * ============================================
 * Analitika (Platform-wide)
 * ============================================
 */

export const getPlatformAnalytics = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        
        const stats = await prisma.hotelDailyStat.aggregate({
            _sum: {
                totalRevenue: true,
                totalBookings: true,
                impressions: true
            },
            _avg: {
                occupancyRate: true,
                conversionRate: true
            }
        });

        // Trendləri hesablamaq üçün son 30 günü çəkirik
        const trends = await prisma.hotelDailyStat.findMany({
            orderBy: { date: 'asc' },
            take: 30,
            select: { date: true, totalRevenue: true }
        });

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalRevenue: stats._sum.totalRevenue || 0,
                    bookingCount: stats._sum.totalBookings || 0,
                    occupancyRate: stats._avg.occupancyRate || 0,
                    impressions: stats._sum.impressions || 0
                },
                trends: {
                    revenue: trends.map(t => ({ date: t.date, amount: t.totalRevenue }))
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ============================================
 * Gəlir İdarəetməsi (Revenue Management)
 * ============================================
 */

export const getPricingRules = async (req, res, next) => {
    try {
        const rules = await prisma.pricingRule.findMany({
            where: { hotelId: req.params.hotelId },
            orderBy: { priority: 'desc' }
        });
        res.status(200).json({ success: true, data: rules });
    } catch (error) {
        next(error);
    }
};

export const createPricingRule = async (req, res, next) => {
    try {
        const rule = await prisma.pricingRule.create({
            data: { ...req.body, hotelId: req.params.hotelId }
        });
        res.status(201).json({ success: true, data: rule });
    } catch (error) {
        next(error);
    }
};

export const deletePricingRule = async (req, res, next) => {
    try {
        await prisma.pricingRule.delete({ where: { id: req.params.ruleId } });
        res.status(200).json({ success: true, message: 'Qayda silindi' });
    } catch (error) {
        next(error);
    }
};
