import prisma from '../../../../config/db.js';

class FraudDetectionService {

    constructor() {
        // Tunable Enterprise Risk weights
        this.RISK_THRESHOLDS = {
            HighCancellationVelocity: 50, // Flag if cancelled > 3 times past 24H
            SimultaneousBookingIP: 30,    // Flag if > 2 active bookings on exact same dates
            AbnormalGuestPattern: 20
        };

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
            // 1. High Cancellation Velocity (Chargeback / Bot mitigation)
            const recentCancellations = await prisma.bookingAuditLog.count({
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
                        items: {
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

            return {
                isApproved: riskScore < this.MAX_ALLOWABLE_RISK,
                score: riskScore,
                reasons
            };

        } catch (error) {
            console.error('[FraudService] Risk Calculation Failed:', error);
            // Fail open for UX, but flag heavily internally
            return { isApproved: true, score: -1, reasons: ['Calculation Error'] };
        }
    }
}

export const fraudDetectionService = new FraudDetectionService();
