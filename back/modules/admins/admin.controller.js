import { userRepository } from '../users/user.repository.js';
import { ApiError } from '../../core/api.error.js';
import prisma from '../../config/db.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isBanned: true,
        isApproved: true,
        createdAt: true,
        vendorprofile: true,
        _count: {
          select: {
            hotels: true,
            restaurants: true,
            tours: true,
            vehicles: true
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
// Business (Hotel/Restaurant/Tour) Governance
// ============================================

export const getPendingBusinesses = async (req, res, next) => {
    try {
        // Fetch all generic businesses that have 'pending' status
        const hotels = await prisma.hotel.findMany({
            where: { status: 'pending' },
            include: { owner: { select: { email: true, phone: true } } }
        });

        const restaurants = await prisma.restaurant.findMany({
            where: { status: 'pending' },
            include: { owner: { select: { email: true, phone: true } } }
        });

        // Add Tour, Event, Attractions here when they get 'status' fields in Prisma
        // const tours = [] ...

        res.status(200).json({
            success: true,
            data: {
                hotels,
                restaurants,
                tours: [] // Placeholder until DB is migrated
            }
        });
    } catch (error) {
        next(error);
    }
};

// Bütün biznesləri (status filtrasiyası ilə) gətirir
export const getAllBusinesses = async (req, res, next) => {
    try {
        const { type, status } = req.query; // type: 'hotel' | 'restaurant' | 'tour'
        const where = status ? { status } : {};
        
        let data;
        let count = 0;

        if (type === 'hotel') {
            data = await prisma.hotel.findMany({ 
                where, 
                include: { owner: { select: { email: true, phone: true } } },
                orderBy: { createdAt: 'desc' }
            });
            count = data.length;
        } else if (type === 'restaurant') {
            data = await prisma.restaurant.findMany({ 
                where, 
                include: { owner: { select: { email: true, phone: true } } },
                orderBy: { createdAt: 'desc' }
            });
            count = data.length;
        } else if (type === 'tour') {
            data = await prisma.tour.findMany({ 
                where, 
                include: { owner: { select: { email: true, phone: true } } },
                orderBy: { createdAt: 'desc' }
            });
            count = data.length;
        } else {
            // Əgər tip seçilməyibsə hamısını birlikdə qaytar (Sadələşdirilmiş)
            const [hotels, restaurants, tours] = await Promise.all([
                prisma.hotel.findMany({ where, include: { owner: { select: { email: true } } } }),
                prisma.restaurant.findMany({ where, include: { owner: { select: { email: true } } } }),
                prisma.tour.findMany({ where, include: { owner: { select: { email: true } } } })
            ]);
            data = { hotels, restaurants, tours };
            count = hotels.length + restaurants.length + tours.length;
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
        } else if (type === 'restaurant') {
            updated = await prisma.restaurant.update({ where: { id }, data: { status: 'active' } });
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
        } else if (type === 'restaurant') {
            updated = await prisma.restaurant.update({ where: { id }, data: { status: 'rejected' } });
        } else {
            throw ApiError.badRequest('Unknown business type for rejection');
        }

        res.status(200).json({
            success: true,
            message: `${type.toUpperCase()} rejected successfully!`,
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
        const { status, type, vendorId, userId } = req.query;
        const where = {};
        if (status) where.status = status;
        if (type) where.bookingType = type;
        if (vendorId) where.vendorId = vendorId;
        if (userId) where.userId = userId;

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                user: { select: { email: true } },
                hotel: { select: { name: true } },
                tour: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
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
                hotel: { select: { name: true, address: true } },
                tour: { select: { name: true } }
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
        const { status, provider, startDate, endDate } = req.query;
        const where = {};
        if (status) where.status = status;
        if (provider) where.provider = provider;
        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        const transactions = await prisma.paymentTransaction.findMany({
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
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (error) {
        next(error);
    }
};

/** Tranzaksiya detallarını gətirir (Bank cavabı daxil olmaqla) */
export const getTransactionDetails = async (req, res, next) => {
    try {
        const transaction = await prisma.paymentTransaction.findUnique({
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
