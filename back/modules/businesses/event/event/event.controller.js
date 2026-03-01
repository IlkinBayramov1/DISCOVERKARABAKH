import { eventService } from './event.service.js';

export const createEvent = async (req, res, next) => {
    try {
        const event = await eventService.createEvent(req.user.id, req.body);
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        next(error);
    }
};

export const getEvents = async (req, res, next) => {
    try {
        const events = await eventService.getEvents(req.query);
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (error) {
        next(error);
    }
};

export const getEventById = async (req, res, next) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        next(error);
    }
};

export const updateEvent = async (req, res, next) => {
    try {
        const event = await eventService.updateEvent(req.params.id, req.user.id, req.user.role, req.body);
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        next(error);
    }
};

export const cancelEvent = async (req, res, next) => {
    try {
        const event = await eventService.cancelEvent(req.params.id, req.user.id, req.user.role);
        res.status(200).json({ success: true, data: event, message: 'Event cancelled successfully' });
    } catch (error) {
        next(error);
    }
};

export const getVendorDashboard = async (req, res, next) => {
    try {
        const stats = await eventService.getDashboardStats(req.user.id);
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};
