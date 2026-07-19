export interface AvailabilitySlot {
    id: string;
    bookingNumber: string;
    vehicleId: string;
    passengerName: string;
    passengerPhone: string;
    passengerEmail: string;
    pickupAddress: string;
    dropoffAddress: string;
    price: number;
    paxCount: number;
    status: string;
    startTime: Date;
    endTime: Date;
    bufferStart: Date;
    bufferEnd: Date;
}

export type SlotState = 'free' | 'buffer' | 'active';

export const parseRide = (item: any): AvailabilitySlot | null => {
    if (!item) return null;

    const isBooking = !!item.bookingType;

    if (isBooking) {
        if (item.bookingType !== 'transfer') return null;

        const bookingItem = item.bookingitem?.[0];
        const rawDate = bookingItem?.checkIn || item.createdAt;
        if (!rawDate) return null;

        const startTime = new Date(rawDate);
        if (isNaN(startTime.getTime())) return null;

        // Fallback to 1 hour (60 mins) trip duration.
        // Once backend sends durationMin or equivalent, it will be used dynamically.
        const durationMin = item.durationMin || bookingItem?.durationMin || 60;
        const durationMs = durationMin * 60 * 1000;
        const endTime = new Date(startTime.getTime() + durationMs);

        // Buffer start is T - 3 hours
        const bufferStart = new Date(startTime.getTime() - 3 * 60 * 60 * 1000);
        // Buffer end is T + 3 hours (aligned with backend yoxlanışı: T - 3h to T + 3h block)
        const bufferEnd = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);

        const meta = bookingItem?.meta;
        const pickupAddress = meta?.pickupLocation?.address || 'Unknown pickup point';
        const dropoffAddress = meta?.dropoffLocation?.address || 'Unknown dropoff point';

        return {
            id: item.id,
            bookingNumber: item.bookingNumber || 'N/A',
            vehicleId: item.entityId || item.vehicleId,
            passengerName: item.user ? `${item.user.firstName || ''} ${item.user.lastName || ''}`.trim() : 'Guest Client',
            passengerPhone: item.user?.phone || 'N/A',
            passengerEmail: item.user?.email || 'N/A',
            pickupAddress,
            dropoffAddress,
            price: item.totalPrice || 0,
            paxCount: bookingItem?.adults || 1,
            status: item.status,
            startTime,
            endTime,
            bufferStart,
            bufferEnd
        };
    } else {
        const rawDate = item.scheduledAt || item.createdAt;
        if (!rawDate) return null;

        const startTime = new Date(rawDate);
        if (isNaN(startTime.getTime())) return null;

        const durationMin = item.durationMin || 60;
        const durationMs = durationMin * 60 * 1000;
        const endTime = new Date(startTime.getTime() + durationMs);

        const bufferStart = new Date(startTime.getTime() - 3 * 60 * 60 * 1000);
        const bufferEnd = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);

        let pickupAddress = 'Unknown pickup point';
        let dropoffAddress = 'Unknown dropoff point';

        try {
            const loc = typeof item.pickupLocation === 'string' ? JSON.parse(item.pickupLocation) : item.pickupLocation;
            pickupAddress = loc?.address || item.pickupLocation || pickupAddress;
        } catch (e) {
            pickupAddress = item.pickupLocation || pickupAddress;
        }

        try {
            const loc = typeof item.dropoffLocation === 'string' ? JSON.parse(item.dropoffLocation) : item.dropoffLocation;
            dropoffAddress = loc?.address || item.dropoffLocation || dropoffAddress;
        } catch (e) {
            dropoffAddress = item.dropoffLocation || dropoffAddress;
        }

        return {
            id: item.id,
            bookingNumber: item.bookingNumber || 'N/A',
            vehicleId: item.vehicleId || item.entityId,
            passengerName: item.passenger ? `${item.passenger.firstName || ''} ${item.passenger.lastName || ''}`.trim() : 
                           (item.user ? `${item.user.firstName || ''} ${item.user.lastName || ''}`.trim() : 'Guest Client'),
            passengerPhone: item.passenger?.phone || item.user?.phone || 'N/A',
            passengerEmail: item.passenger?.email || item.user?.email || 'N/A',
            pickupAddress,
            dropoffAddress,
            price: item.price || 0,
            paxCount: item.paxCount || 1,
            status: item.status,
            startTime,
            endTime,
            bufferStart,
            bufferEnd
        };
    }
};

export const buildAvailability = (bookings: any[]): AvailabilitySlot[] => {
    if (!Array.isArray(bookings)) return [];
    return bookings.map(parseRide).filter((slot): slot is AvailabilitySlot => slot !== null);
};

export const getMonthStatus = (slots: AvailabilitySlot[], vehicleId: string, dateStr: string): SlotState => {
    const dayStart = new Date(dateStr + 'T00:00:00');
    const dayEnd = new Date(dateStr + 'T23:59:59.999');

    const vehicleSlots = slots.filter(s => s.vehicleId === vehicleId && s.status !== 'cancelled' && s.status !== 'rejected');
    if (vehicleSlots.length === 0) return 'free';

    // Check active overlap
    const hasActive = vehicleSlots.some(s => 
        (s.startTime < dayEnd && s.endTime > dayStart)
    );
    if (hasActive) return 'active';

    // Check buffer overlap
    const hasBuffer = vehicleSlots.some(s => 
        (s.bufferStart < dayEnd && s.bufferEnd > dayStart)
    );
    if (hasBuffer) return 'buffer';

    return 'free';
};

export const getCellState = (
    slots: AvailabilitySlot[], 
    vehicleId: string, 
    hourDate: Date
): { state: SlotState; ride?: AvailabilitySlot } => {
    const cellStart = hourDate;
    const cellEnd = new Date(hourDate.getTime() + 60 * 60 * 1000 - 1); // 59m 59s 999ms

    const vehicleSlots = slots.filter(s => s.vehicleId === vehicleId && s.status !== 'cancelled' && s.status !== 'rejected');

    // 1. Check active ride overlap (Variant 1: any overlap blocks the cell)
    const activeRide = vehicleSlots.find(s => 
        (s.startTime < cellEnd && s.endTime > cellStart)
    );
    if (activeRide) {
        return { state: 'active', ride: activeRide };
    }

    // 2. Check buffer overlap (Variant 1: any overlap blocks the cell)
    const bufferRide = vehicleSlots.find(s => 
        (s.bufferStart < cellEnd && s.bufferEnd > cellStart)
    );
    if (bufferRide) {
        return { state: 'buffer', ride: bufferRide };
    }

    return { state: 'free' };
};

export const getDayTimeline = (
    slots: AvailabilitySlot[], 
    vehicleId: string, 
    date: Date
): { hour: number; state: SlotState; ride?: AvailabilitySlot }[] => {
    const timeline = [];
    const baseDate = new Date(date);
    baseDate.setHours(0, 0, 0, 0);

    for (let h = 0; h < 24; h++) {
        const hourDate = new Date(baseDate);
        hourDate.setHours(h);
        const cell = getCellState(slots, vehicleId, hourDate);
        timeline.push({
            hour: h,
            state: cell.state,
            ride: cell.ride
        });
    }
    return timeline;
};
