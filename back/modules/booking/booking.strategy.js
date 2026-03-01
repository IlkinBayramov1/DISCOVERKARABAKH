/**
 * Base Strategy Interface for Polymorphic Bookings
 */
export class BookingStrategy {
    /**
     * Validates if the requested entity is available for the given parameters.
     * @param {Object} data 
     * @returns {Object} Contextual data to pass to pricing (e.g. pulled database records)
     */
    async validateAvailability(data) {
        throw new Error('validateAvailability not implemented');
    }

    /**
     * Calculates the definitive price.
     * @param {Object} context 
     * @param {Object} data 
     * @returns {number}
     */
    async calculatePrice(context, data) {
        throw new Error('calculatePrice not implemented');
    }

    /**
     * Formats the JSON metadata that gets stored in `Booking.details`.
     * @param {Object} context 
     * @param {Object} data 
     */
    async generateDetailsPayload(context, data) {
        throw new Error('generateDetailsPayload not implemented');
    }

    /**
     * Optional hook fired after successful DB creation (e.g., locking inventory).
     * @param {Object} booking 
     */
    async onBookingSuccess(booking) { }

    /**
     * Optional hook fired upon reservation cancellation (e.g., releasing inventory).
     * @param {Object} booking 
     */
    async onBookingCancelled(booking) { }
}

/**
 * Registry to hold dynamic Booking Strategies without bloating the Main Service.
 */
class BookingStrategyConfigurator {
    constructor() {
        this.strategies = new Map();
    }

    register(type, strategyInstance) {
        if (!(strategyInstance instanceof BookingStrategy)) {
            throw new Error(`Strategy for ${type} must extend BookingStrategy`);
        }
        this.strategies.set(type, strategyInstance);
    }

    getStrategy(type) {
        return this.strategies.get(type);
    }
}

export const bookingStrategyRegistry = new BookingStrategyConfigurator();
