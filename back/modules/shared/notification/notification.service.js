/**
 * Centralized Notification Service
 * Handles Email/SMS/In-app notifications across the platform.
 */
class NotificationService {
    
    /**
     * Sends a booking confirmation to both Guest and Vendor.
     * @param {Object} booking - The hydrated booking object
     */
    async sendBookingConfirmation(booking) {
        const { bookingNumber, totalPrice, currency, hotel } = booking;
        
        console.log(`[Notification Service] 📧 Sending Confirmation Email for PNR: ${bookingNumber}`);
        console.log(`[Guest] Dear Customer, your booking for ${hotel?.name || 'Hotel'} is confirmed. Total: ${totalPrice} ${currency}`);
        console.log(`[Vendor] New Reservation received! PNR: ${bookingNumber}. Please prepare the rooms.`);
        
        // Integration point for NodeMailer, SendGrid, or Twilio would go here
    }

    /**
     * Sends a cancellation alert to both Guest and Vendor.
     * @param {Object} booking 
     */
    async sendBookingCancellation(booking) {
        const { bookingNumber, hotel } = booking;

        console.log(`[Notification Service] 📉 Sending Cancellation Alert for PNR: ${bookingNumber}`);
        console.log(`[Guest] Your reservation for ${hotel?.name || 'Hotel'} has been successfully cancelled.`);
        console.log(`[Vendor] Note: PNR ${bookingNumber} has been cancelled. Inventory released.`);
    }
}

export const notificationService = new NotificationService();
