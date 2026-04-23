import { transferService } from './transfer.service.js';
import { driverRepository } from '../../driver/driver.repository.js';
import { ApiError } from '../../../../core/api.error.js';

export const searchTaxis = async (req, res, next) => {
    try {
        const availableTaxis = await transferService.searchTaxis(req.body);
        res.status(200).json({ success: true, count: availableTaxis.length, data: availableTaxis });
    } catch (error) {
        next(error);
    }
};

export const getTransfer = async (req, res, next) => {
    try {
        const transfer = await transferService.getTransferById(req.params.id);
        res.status(200).json({ success: true, data: transfer });
    } catch (error) {
        next(error);
    }
};

export const getMyTransfers = async (req, res, next) => {
    try {
        const result = await transferService.getUserTransfers(req.user.id, req.query);
        res.status(200).json({ success: true, count: result.count, data: result.rides });
    } catch (error) {
        next(error);
    }
};

export const getAllTransfers = async (req, res, next) => {
    try {
        const result = await transferService.getAllTransfers(req.user.id, req.user.role, req.query);
        res.status(200).json({ success: true, count: result.count, data: result.rides });
    } catch (error) {
        next(error);
    }
};

export const updateTransferStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const transfer = await transferService.updateStatus(req.params.id, status, req.user.id);
        res.status(200).json({ success: true, data: transfer });
    } catch (error) {
        next(error);
    }
};

export const getDriverRides = async (req, res, next) => {
    try {
        const driverProfile = await driverRepository.findByUserId(req.user.id);
        if (!driverProfile) {
            throw ApiError.notFound('Driver profile not found');
        }
        
        const result = await transferService.getDriverTransfers(driverProfile.id, req.query);
        res.status(200).json({ success: true, count: result.count, data: result.rides });
    } catch (error) {
        next(error);
    }
};

export const acceptRide = async (req, res, next) => {
    try {
        const driverProfile = await driverRepository.findByUserId(req.user.id);
        if (!driverProfile) throw ApiError.forbidden('You are not a registered driver');

        const ride = await transferService.acceptRide(req.params.id, driverProfile.id);
        res.status(200).json({ success: true, data: ride });
    } catch (error) {
        next(error);
    }
};

export const rejectRide = async (req, res, next) => {
    try {
        const driverProfile = await driverRepository.findByUserId(req.user.id);
        if (!driverProfile) throw ApiError.forbidden('You are not a registered driver');

        // We pull the required elements from body if needed, otherwise fallback to DB info inside service.
        const { pickupLocation, requiredSeats, requiredCategory } = req.body;
        
        const result = await transferService.rejectRide(
            req.params.id, 
            driverProfile.id, 
            pickupLocation, 
            requiredSeats, 
            requiredCategory
        );
        res.status(200).json({ success: true, result });
    } catch (error) {
        next(error);
    }
};

export const arriveAtPickup = async (req, res, next) => {
    try {
        const driverProfile = await driverRepository.findByUserId(req.user.id);
        const ride = await transferService.updateLifecycle(req.params.id, driverProfile?.id || req.user.id, 'ARRIVED');
        res.status(200).json({ success: true, data: ride });
    } catch (error) {
        next(error);
    }
};

export const startRide = async (req, res, next) => {
    try {
        const driverProfile = await driverRepository.findByUserId(req.user.id);
        const ride = await transferService.updateLifecycle(req.params.id, driverProfile?.id || req.user.id, 'STARTED');
        res.status(200).json({ success: true, data: ride });
    } catch (error) {
        next(error);
    }
};

export const completeRide = async (req, res, next) => {
    try {
        const driverProfile = await driverRepository.findByUserId(req.user.id);
        const ride = await transferService.updateLifecycle(req.params.id, driverProfile?.id || req.user.id, 'COMPLETED');
        res.status(200).json({ success: true, data: ride });
    } catch (error) {
        next(error);
    }
};
