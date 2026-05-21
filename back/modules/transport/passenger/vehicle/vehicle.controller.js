import { vehicleService } from './vehicle.service.js';

export const createVehicle = async (req, res, next) => {
    try {
        const vehicle = await vehicleService.createVehicle(req.user.id, req.body);
        res.status(201).json({ success: true, data: vehicle });
    } catch (error) {
        next(error);
    }
};

export const getVehicles = async (req, res, next) => {
    try {
        const result = await vehicleService.getVehicles(req.user.id, req.query, req.user.role);
        res.status(200).json({ success: true, count: result.count, data: result.vehicles });
    } catch (error) {
        next(error);
    }
};

export const getVehicle = async (req, res, next) => {
    try {
        const vehicle = await vehicleService.getVehicleById(req.params.id);
        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        next(error);
    }
};

export const updateVehicle = async (req, res, next) => {
    try {
        const vehicle = await vehicleService.updateVehicle(req.params.id, req.user.id, req.body, req.user.role);
        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        next(error);
    }
};

export const deleteVehicle = async (req, res, next) => {
    try {
        await vehicleService.deleteVehicle(req.params.id, req.user.id, req.user.role);
        res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
    } catch (error) {
        next(error);
    }
};
