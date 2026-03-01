import { cargoVehicleService } from './cargoVehicle.service.js';

export const registerVehicle = async (req, res, next) => {
    try {
        const vehicle = await cargoVehicleService.registerVehicle(req.user.id, req.body);
        res.status(201).json({ success: true, data: vehicle });
    } catch (error) {
        next(error);
    }
};

export const getVehicles = async (req, res, next) => {
    try {
        const vehicles = await cargoVehicleService.getVehicles(req.query);
        res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
    } catch (error) {
        next(error);
    }
};

export const getVehicleById = async (req, res, next) => {
    try {
        const vehicle = await cargoVehicleService.getVehicleById(req.params.id);
        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        next(error);
    }
};

export const updateVehicle = async (req, res, next) => {
    try {
        const vehicle = await cargoVehicleService.updateVehicle(req.params.id, req.user.id, req.user.role, req.body);
        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        next(error);
    }
};

export const deleteVehicle = async (req, res, next) => {
    try {
        await cargoVehicleService.deleteVehicle(req.params.id, req.user.id, req.user.role);
        res.status(200).json({ success: true, message: 'Cargo vehicle deleted successfully' });
    } catch (error) {
        next(error);
    }
};
