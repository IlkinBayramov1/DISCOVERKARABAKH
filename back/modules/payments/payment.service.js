import prisma from '../../config/db.js';
import { ApiError } from '../../core/api.error.js';
import { LocalBankProvider } from './providers/local.provider.js';
import { AzericardProvider } from './providers/azericard.provider.js';
import { bookingStrategyRegistry } from '../booking/booking.strategy.js';

class PaymentService {
    constructor() {
        this.providers = {
            local: new LocalBankProvider({ 
                baseUrl: process.env.BASE_URL || 'http://localhost:4004' 
            }),
            azericard: new AzericardProvider()
        };
    }

    /**
     * @param {string} bookingId 
     * @param {string} providerName 
     */
    async initiatePayment(bookingId, userId, providerName = 'azericard') {
        const provider = this.providers[providerName];
        if (!provider) throw ApiError.badRequest(`Unsupported payment provider: ${providerName}`);

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { user: true }
        });

        if (!booking) throw ApiError.notFound('Booking not found');
        if (booking.userId !== userId) throw ApiError.forbidden('Unauthorized');
        if (booking.status !== 'draft' && booking.status !== 'pending_payment') {
            throw ApiError.badRequest('Booking is not in a payable state');
        }

        // 1. Create Transaction Record in DB
        const transaction = await prisma.paymenttransaction.create({
            data: {
                bookingId: booking.id,
                amount: booking.totalPrice,
                currency: booking.currency,
                provider: providerName,
                status: 'pending'
            }
        });

        // 2. Initiate with Bank Provider
        const initiationResult = await provider.initiate({
            transactionId: transaction.id,
            amount: booking.totalPrice,
            currency: booking.currency,
            description: `Payment for Booking ${booking.bookingNumber}`
        });

        // 3. Update Transaction with Provider Info
        const updatedTransaction = await prisma.paymenttransaction.update({
            where: { id: transaction.id },
            data: {
                paymentUrl: initiationResult.paymentUrl,
                providerTransId: initiationResult.providerTransId,
                rawResponse: initiationResult.rawResponse
            }
        });

        // 4. Update Booking status to pending_payment
        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'pending_payment' }
        });

        return updatedTransaction;
    }

    /**
     * Handle Bank Callback (Webhook or Redirect Response)
     */
    async handleCallback(params, providerName = 'azericard') {
        const provider = this.providers[providerName];
        if (!provider) throw ApiError.badRequest(`Unsupported payment provider: ${providerName}`);

        // 1. Verify with Provider
        const verification = await provider.verify(params);
        
        // 2. Find Transaction
        const transaction = await prisma.paymenttransaction.findFirst({
            where: { 
                id: params.transId || params.transactionId,
                provider: providerName 
            },
            include: { 
                booking: { 
                    include: { 
                        items: true, 
                        guests: true,
                        hotel: true,
                        tour: true,
                        event: true,
                        attraction: true
                    } 
                } 
            }
        });

        if (!transaction) throw ApiError.notFound('Transaction not found');
        if (transaction.status !== 'pending') return transaction; // Already processed

        // 3. Update Transaction and Booking Atomically
        return await prisma.$transaction(async (tx) => {
            const updatedTx = await tx.paymenttransaction.update({
                where: { id: transaction.id },
                data: {
                    status: verification.status,
                    rawResponse: { ...transaction.rawResponse, callback: verification.rawResponse }
                }
            });

            if (verification.status === 'success') {
                // Deduct from user's wallet balance
                await tx.user.update({
                    where: { id: transaction.booking.userId },
                    data: {
                        balance: {
                            decrement: transaction.amount
                        }
                    }
                });

                // Determine transaction description
                let itemTitle = 'Rezervasiya Ödənişi';
                const bookingType = transaction.booking.bookingType;
                if (bookingType === 'hotel' && transaction.booking.hotel) {
                    itemTitle = transaction.booking.hotel.name;
                } else if (bookingType === 'tour' && transaction.booking.tour) {
                    itemTitle = transaction.booking.tour.name;
                } else if (bookingType === 'event' && transaction.booking.event) {
                    itemTitle = transaction.booking.event.title;
                } else if (bookingType === 'attraction' && transaction.booking.attraction) {
                    itemTitle = transaction.booking.attraction.name;
                }
                const description = `${itemTitle} (${transaction.booking.bookingNumber})`;

                // Log wallettransaction
                await tx.wallettransaction.create({
                    data: {
                        userId: transaction.booking.userId,
                        amount: transaction.amount,
                        type: 'payment',
                        status: 'COMPLETED',
                        description
                    }
                });

                await tx.booking.update({
                    where: { id: transaction.booking.bookingId },
                    data: { 
                        status: 'confirmed',
                        paymentStatus: 'captured',
                        paymentId: updatedTx.providerTransId
                    }
                });

                await tx.bookingAuditLog.create({
                    data: {
                        bookingId: transaction.bookingId,
                        action: 'payment_received',
                        meta: { transactionId: updatedTx.id, provider: providerName }
                    }
                });

                // Trigger Strategy Specific Success Hooks (Inventory update, notifications)
                const strategy = bookingStrategyRegistry.getStrategy(transaction.booking.bookingType);
                if (strategy && typeof strategy.onBookingSuccess === 'function') {
                    await strategy.onBookingSuccess(transaction.booking);
                }
            } else if (verification.status === 'failed') {
                await tx.booking.update({
                    where: { id: transaction.bookingId },
                    data: { paymentStatus: 'failed' }
                });
            }

            return updatedTx;
        });
    }

    async getTransactionByBooking(bookingId, userId) {
        return prisma.paymenttransaction.findFirst({
            where: { bookingId, booking: { userId } },
            orderBy: { createdAt: 'desc' }
        });
    }
}

export const paymentService = new PaymentService();
