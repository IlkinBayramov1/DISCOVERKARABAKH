import prisma from '../../../../config/db.js';
import crypto from 'crypto';

class FraudDetectionService {

    constructor() {
        // Tunable Enterprise Risk weights
        this.RISK_THRESHOLDS = {
            HighCancellationVelocity: 50, // Flag if cancelled > 3 times past 24H
            SimultaneousBookingIP: 30,    // Flag if > 2 active bookings on exact same dates
            NewUserHighValue: 40,         // Flag if new user books expensive stay
            InventoryHoarding: 50,        // Flag if user books too many rooms at once
            LastMinuteLargeBooking: 30,   // Flag if user books 3+ rooms for today
            Blacklisted: 100,             // Flag if user data is in blacklist
            AbnormalGuestPattern: 20
        };

        this.NEW_USER_DAYS = 7;
        this.MAX_ROOMS_PER_BOOKING = 5;
        this.LAST_MINUTE_ROOMS_LIMIT = 3;
        this.HIGH_VALUE_THRESHOLD = 2000;
        this.MAX_ALLOWABLE_RISK = 80;
    }

    /**
     * Evaluates a booking request payload against historical User Data
     * to assign a cumulative Risk Score.
     * 
     * @param {string} userId - Booking Originator
     * @param {Object} data - Contains items mapped with checkIn & checkOut
     * @returns {Object} { isApproved: boolean, score: number, reasons: Array }
     */
    async evaluateTransactionRisk(userId, data) {
        let riskScore = 0;
        let reasons = [];

        try {
            // 0. Fetch User Context
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { createdAt: true, email: true, phone: true }
            });

            if (user) {
                // Check if user credentials (email or phone) are blacklisted
                const blacklisted = await prisma.blacklist.findFirst({
                    where: {
                        OR: [
                            { value: user.email },
                            { value: user.phone || 'N/A' }
                        ]
                    }
                });

                if (blacklisted) {
                    riskScore += this.RISK_THRESHOLDS.Blacklisted;
                    reasons.push(`User is blacklisted (Match: ${blacklisted.value}). Reason: ${blacklisted.reason || 'No reason provided'}`);
                }

                const daysSinceCreation = (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24);
                const isNewUser = daysSinceCreation <= this.NEW_USER_DAYS;

                // Check for High Value (if totalAmount is provided in payload or calculated)
                const totalAmount = data.totalAmount || 0; 
                if (isNewUser && totalAmount >= this.HIGH_VALUE_THRESHOLD) {
                    riskScore += this.RISK_THRESHOLDS.NewUserHighValue;
                    reasons.push(`New account (created ${Math.round(daysSinceCreation)} days ago) making high-value booking.`);
                }
            }

            // 1. Bulk Inventory Hoarding (Current Transaction)
            const totalRoomsRequested = data.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
            if (totalRoomsRequested > this.MAX_ROOMS_PER_BOOKING) {
                riskScore += this.RISK_THRESHOLDS.InventoryHoarding;
                reasons.push(`Bulk booking detected: Requesting ${totalRoomsRequested} rooms at once.`);
            }

            // 2. Last-Minute Large Booking (Urgency Check)
            const today = new Date().toISOString().split('T')[0];
            const isLastMinute = data.items.some(item => item.checkIn === today);
            if (isLastMinute && totalRoomsRequested >= this.LAST_MINUTE_ROOMS_LIMIT) {
                riskScore += this.RISK_THRESHOLDS.LastMinuteLargeBooking;
                reasons.push(`Last-minute large booking for today with ${totalRoomsRequested} rooms.`);
            }

            // 3. High Cancellation Velocity (Chargeback / Bot mitigation)
            const recentCancellations = await prisma.bookingauditlog.count({
                where: {
                    booking: { userId: userId },
                    action: 'cancelled',
                    createdAt: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Past 24 hours
                    }
                }
            });

            if (recentCancellations >= 3) {
                riskScore += this.RISK_THRESHOLDS.HighCancellationVelocity;
                reasons.push('High cancellation frequency detected in the last 24 hours.');
            }

            // 2. Overlapping Simultaneous Booking lock (Inventory hoarding)
            if (data.items && data.items.length > 0) {
                const checkInDate = new Date(data.items[0].checkIn);

                const conflictingBookings = await prisma.booking.count({
                    where: {
                        userId: userId,
                        status: { notIn: ['cancelled', 'refunded'] },
                        bookingitem: {
                            some: {
                                checkIn: {
                                    lte: checkInDate // Extremely simplified overlap for demo
                                },
                                checkOut: {
                                    gte: checkInDate
                                }
                            }
                        }
                    }
                });

                // Allowing 1 overlap optionally for families, but flagging > 2
                if (conflictingBookings >= 2) {
                    riskScore += this.RISK_THRESHOLDS.SimultaneousBookingIP;
                    reasons.push(`User already holds ${conflictingBookings} active overlapping reservations.`);
                }
            }

            // 3. (Future Extension) Validate IP address mismatch vs Card Country

            const result = {
                isApproved: riskScore < this.MAX_ALLOWABLE_RISK,
                score: riskScore,
                reasons
            };

            // 4. Persistence: Always log Significant Risk evaluations to Audit Log
            if (riskScore > 0 || !result.isApproved) {
                await prisma.bookingauditlog.create({
                    data: {
                        id: crypto.randomUUID(),
                        bookingId: null,
                        action: 'risk_evaluation',
                        meta: JSON.stringify({
                            score: riskScore,
                            reasons: reasons,
                            isApproved: result.isApproved,
                            context: { userId, totalAmount: data.totalAmount || 0 }
                        })
                    }
                }).catch(err => console.error('[FraudService] Failed to log risk audit:', err));
            }

            return result;

        } catch (error) {
            console.error('[FraudService] Risk Calculation Failed:', error);
            // Fail open for UX, but flag heavily internally
            return { isApproved: true, score: -1, reasons: ['Calculation Error'] };
        }
    }

    /**
     * Formats a raw bookingauditlog record into a structured frontend representation.
     * @param {Object} log - Prisma bookingauditlog record
     * @returns {Object} Formatted risk log
     */
    formatRiskLog(log) {
        let parsedMeta = { score: 0, reasons: [], isApproved: true, context: {} };
        try {
            parsedMeta = log.meta ? JSON.parse(log.meta) : parsedMeta;
        } catch (err) {
            console.error(`[FraudService] Error parsing risk log meta for log ${log?.id}:`, err);
        }
        return {
            id: log.id,
            action: log.action,
            createdAt: log.createdAt,
            details: {
                score: parsedMeta.score !== undefined ? parsedMeta.score : 0,
                reasons: parsedMeta.reasons || [],
                isApproved: parsedMeta.isApproved !== undefined ? parsedMeta.isApproved : true
            },
            context: parsedMeta.context || {}
        };
    }
}

export const fraudDetectionService = new FraudDetectionService();
