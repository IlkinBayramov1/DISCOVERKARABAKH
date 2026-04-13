import { httpClient } from '@/shared/api/httpClient';
import type { IRoomCalendar, ICalendarBulkUpdate, ICalendarNote } from '../types';

export const calendarApi = {
    getCalendarData: (hotelId: string, startDate: string, endDate: string) =>
        httpClient<{ success: boolean; data: IRoomCalendar[] }>(
            `/hotels/${hotelId}/calendar?startDate=${startDate}&endDate=${endDate}`
        ),

    bulkUpdateCalendar: (hotelId: string, payload: ICalendarBulkUpdate) =>
        httpClient<{ success: boolean; message: string }>(
            `/hotels/${hotelId}/calendar/bulk-update`,
            {
                method: 'POST',
                body: JSON.stringify(payload)
            }
        ),

    getNotes: (hotelId: string, startDate: string, endDate: string) =>
        httpClient<ICalendarNote[]>(
            `/hotels/${hotelId}/notes?startDate=${startDate}&endDate=${endDate}`
        ),

    saveNote: (hotelId: string, data: { date: string; note: string; type: string }) =>
        httpClient<{ message: string }>(`/hotels/${hotelId}/notes`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    deleteNote: (hotelId: string, date: string) =>
        httpClient<{ message: string }>(`/hotels/${hotelId}/notes?date=${date}`, {
            method: 'DELETE'
        })
};
