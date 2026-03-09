import { useState, useCallback } from 'react';
import { calendarApi } from '../api/calendar.api';
import type { IRoomTypeCalendar, IBulkUpdateCalendarPayload } from '../api/calendar.api';

export function useCalendar(hotelId: string | undefined) {
    const [calendarData, setCalendarData] = useState<IRoomTypeCalendar[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCalendar = useCallback(async (startDate: string, endDate: string) => {
        if (!hotelId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await calendarApi.getCalendarData(hotelId, startDate, endDate);
            setCalendarData(res.data);
            return res.data;
        } catch (err: any) {
            setError(err.message || 'Failed to fetch calendar data');
            return null;
        } finally {
            setLoading(false);
        }
    }, [hotelId]);

    const bulkUpdate = useCallback(async (payload: IBulkUpdateCalendarPayload) => {
        if (!hotelId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await calendarApi.bulkUpdateCalendar(hotelId, payload);
            return res.success;
        } catch (err: any) {
            setError(err.message || 'Failed to update calendar');
            return false;
        } finally {
            setLoading(false);
        }
    }, [hotelId]);

    return {
        calendarData,
        loading,
        error,
        fetchCalendar,
        bulkUpdate
    };
}
