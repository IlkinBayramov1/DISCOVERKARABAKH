import prisma from '../../../config/db.js';
import crypto from 'crypto';
import { getIO } from '../../transport/tracking/tracking.gateway.js';
import { NotificationEvent, NotificationType } from './notification.constants.js';

class NotificationService {

    /**
     * Helper to create and broadcast a standardized notification
     */
    async _createAndBroadcast({ title, message, type, target, bookingId, bookingType }) {
        try {
            const notificationId = crypto.randomUUID();
            
            // 1. Save to Database
            const savedNotification = await prisma.notification.create({
                data: {
                    id: notificationId,
                    title,
                    message,
                    type,
                    target,
                    bookingId
                }
            });

            // 2. Map Link based on bookingType
            let link = null;
            if (bookingType) {
                if (bookingType === 'hotel') link = '/reservations';
                else if (bookingType === 'transfer' || bookingType === 'transport') link = '/transport/orders';
                else if (bookingType === 'tour') link = '/tours/bookings';
                else if (bookingType === 'attraction') link = '/attractions/bookings';
            }

            // 3. Construct Standard Payload
            const payload = {
                id: savedNotification.id,
                type,
                title: savedNotification.title,
                message: savedNotification.message,
                createdAt: savedNotification.createdAt,
                isRead: savedNotification.isRead,
                link
            };

            // 4. Broadcast via Socket.io to personal user room
            try {
                const io = getIO();
                io.to(`user_${target}`).emit(NotificationEvent.NOTIFICATION_CREATED, payload);
                console.log(`📡 Real-time notification broadcasted to room user_${target}: ${title}`);
            } catch (socketErr) {
                console.warn('[NotificationService] Socket.io not active, skipped real-time broadcast:', socketErr.message);
            }

            return payload;
        } catch (error) {
            console.error('[NotificationService] Failed to create or broadcast notification:', error);
        }
    }
    
    /**
     * Sends a booking confirmation to both Guest and Vendor.
     * @param {Object} booking - The booking object
     */
    async sendBookingConfirmation(booking) {
        try {
            const fullBooking = await prisma.booking.findUnique({
                where: { id: booking.id }
            });

            if (!fullBooking) {
                console.error(`[Notification Service] Booking ${booking.id} not found for confirmation`);
                return;
            }

            const { id, bookingNumber, totalPrice, currency, userId, vendorId, bookingType } = fullBooking;

            console.log(`[Notification Service] 📧 Sending Confirmation Notifications for PNR: ${bookingNumber}`);

            // Guest Notification
            await this._createAndBroadcast({
                title: 'Yeni Rezervasiya Təsdiqi',
                message: `Rezervasiyanız uğurla təsdiqləndi. PNR: ${bookingNumber}. Məbləğ: ${totalPrice} ${currency}.`,
                type: NotificationType.BOOKING_CONFIRMED,
                target: userId,
                bookingId: id,
                bookingType
            });

            // Vendor Notification
            if (vendorId) {
                await this._createAndBroadcast({
                    title: 'Yeni Rezervasiya Alındı',
                    message: `Yeni bir rezervasiya qəbul edildi. PNR: ${bookingNumber}. Məbləğ: ${totalPrice} ${currency}.`,
                    type: NotificationType.BOOKING_CONFIRMED,
                    target: vendorId,
                    bookingId: id,
                    bookingType
                });
            }
        } catch (error) {
            console.error('[Notification Service] Error in sendBookingConfirmation:', error);
        }
    }

    /**
     * Sends a cancellation alert to both Guest and Vendor.
     * @param {Object} booking 
     */
    async sendBookingCancellation(booking) {
        try {
            const fullBooking = await prisma.booking.findUnique({
                where: { id: booking.id }
            });

            if (!fullBooking) {
                console.error(`[Notification Service] Booking ${booking.id} not found for cancellation`);
                return;
            }

            const { id, bookingNumber, userId, vendorId, bookingType } = fullBooking;

            console.log(`[Notification Service] 📉 Sending Cancellation Alert for PNR: ${bookingNumber}`);

            // Guest Notification
            await this._createAndBroadcast({
                title: 'Rezervasiya İptalı',
                message: `Rezervasiyanız ləğv edildi. PNR: ${bookingNumber}.`,
                type: NotificationType.BOOKING_CANCELLED,
                target: userId,
                bookingId: id,
                bookingType
            });

            // Vendor Notification
            if (vendorId) {
                await this._createAndBroadcast({
                    title: 'Rezervasiya Ləğv Edildi',
                    message: `${bookingNumber} nömrəli rezervasiya ləğv edildi.`,
                    type: NotificationType.BOOKING_CANCELLED,
                    target: vendorId,
                    bookingId: id,
                    bookingType
                });
            }
        } catch (error) {
            console.error('[Notification Service] Error in sendBookingCancellation:', error);
        }
    }
}

export const notificationService = new NotificationService();
