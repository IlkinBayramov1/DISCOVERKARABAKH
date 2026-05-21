import { useState, useCallback } from 'react';
import { calendarApi } from '../api/calendar.api';
import type { IRoomCalendar, ICalendarBulkUpdate, ICalendarNote } from '../types';

export function useCalendar(hotelId: string | undefined) {
    const [calendarData, setCalendarData] = useState<IRoomCalendar[]>([]);
    const [notes, setNotes] = useState<ICalendarNote[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCalendar = useCallback(async (startDate: string, endDate: string) => {
        if (!hotelId) return;
        setLoading(true);
        setError(null);
        try {
            const [calendarRes, notesRes] = await Promise.all([
                calendarApi.getCalendarData(hotelId, startDate, endDate),
                calendarApi.getNotes(hotelId, startDate, endDate)
            ]);
            
            const rawCal = calendarRes as any;
            const rawNotes = notesRes as any;
            
            const processedCalendar = Array.isArray(rawCal?.data) ? rawCal.data : (Array.isArray(rawCal) ? rawCal : []);
            const processedNotes = Array.isArray(rawNotes?.data) ? rawNotes.data : (Array.isArray(rawNotes) ? rawNotes : []);
            
            setCalendarData(processedCalendar);
            setNotes(processedNotes);

            return { 
                calendar: processedCalendar, 
                notes: processedNotes 
            };
        } catch (err: any) {
            setError(err.message || 'Failed to fetch calendar data');
            return null;
        } finally {
            setLoading(false);
        }
    }, [hotelId]);

    const bulkUpdate = useCallback(async (payload: ICalendarBulkUpdate) => {
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

    const addNote = useCallback(async (data: { date: string; note: string; type: string }) => {
        if (!hotelId) return;
        try {
            await calendarApi.saveNote(hotelId, data);
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to save note');
            return false;
        }
    }, [hotelId]);

    const removeNote = useCallback(async (date: string) => {
        if (!hotelId) return;
        try {
            await calendarApi.deleteNote(hotelId, date);
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to delete note');
            return false;
        }
    }, [hotelId]);

    return {
        calendarData,
        notes,
        loading,
        error,
        fetchCalendar,
        bulkUpdate,
        addNote,
        removeNote
    };
}
