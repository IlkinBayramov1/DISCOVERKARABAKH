import { httpClient } from '../../../shared/api/httpClient';

export interface IDailyCalendarData {
    date: string; // YYYY-MM-DD
    basePrice: number | null;
    minStay: number;
    closedToArrival: boolean;
    closedToDeparture: boolean;
    availableRooms: number;
    reservedRooms: number;
}

export interface IRoomTypeCalendar {
    roomTypeId: string;
    roomTypeName: string;
    totalInventory: number;
    days: IDailyCalendarData[];
}

export interface IBulkUpdateCalendarPayload {
    roomTypeId: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    days?: string[]; // e.g. ["Mon", "Tue"]

    basePrice?: number;
    availableRooms?: number;
    minStay?: number;
    closedToArrival?: boolean;
    closedToDeparture?: boolean;
}

export const calendarApi = {
    getCalendarData: (hotelId: string, startDate: string, endDate: string) => {
        return httpClient<{ success: boolean; data: IRoomTypeCalendar[] }>(
            `/hotels/${hotelId}/calendar?startDate=${startDate}&endDate=${endDate}`
        );
    },

    bulkUpdateCalendar: (hotelId: string, payload: IBulkUpdateCalendarPayload) => {
        return httpClient<{ success: boolean; message: string }>(
            `/hotels/${hotelId}/calendar/bulk-update`,
            {
                method: 'POST',
                body: JSON.stringify(payload)
            }
        );
    }
};
