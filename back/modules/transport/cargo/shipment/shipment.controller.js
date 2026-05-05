import { shipmentService } from './shipment.service.js';
import { driverRepository } from '../../driver/driver.repository.js';
import { ApiError } from '../../../../core/api.error.js';

export const createShipment = async (req, res, next) => {
    try {
        // Optionally pull idempotencyKey from headers
        const idempotencyKey = req.headers['idempotency-key'] || req.body.idempotencyKey;
        const payload = { ...req.body, idempotencyKey };

        const shipment = await shipmentService.createShipment(req.user.id, payload);

        // Status 200 instead of 201 if it was an idempotent replay
        const status = shipment._idempotentRestored ? 200 : 201;
        res.status(status).json({ success: true, data: shipment });
    } catch (error) {
        next(error);
    }
};

export const assignDriver = async (req, res, next) => {
    try {
        const { cargoVehicleId, driverProfileId } = req.body;
        const shipment = await shipmentService.assignDriver(
            req.params.id,
            cargoVehicleId,
            driverProfileId,
            req.user.role,
            req.user.id
        );
        res.status(200).json({ success: true, data: shipment });
    } catch (error) {
        next(error);
    }
};

export const advanceStatus = async (req, res, next) => {
    try {
        const { nextStatus, status, extraPayload } = req.body;
        const targetStatus = nextStatus || status;
        
        if (!targetStatus) throw ApiError.badRequest('Status is required');

        const shipment = await shipmentService.advanceStatus(req.params.id, targetStatus, extraPayload);
        res.status(200).json({ success: true, data: shipment });
    } catch (error) {
        next(error);
    }
};

export const getShipment = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id);
        res.status(200).json({ success: true, data: shipment });
    } catch (error) {
        next(error);
    }
};

export const getAllShipments = async (req, res, next) => {
    try {
        const result = await shipmentService.getAllShipments(req.query);
        res.status(200).json({ success: true, count: result.count, data: result.shipments });
    } catch (error) {
        next(error);
    }
};

export const getMyShipments = async (req, res, next) => {
    try {
        const driverProfile = await driverRepository.findByUserId(req.user.id);
        if (!driverProfile) {
            throw ApiError.notFound('Driver profile not found');
        }
        
        // Fetch shipments assigned to this driver
        const result = await shipmentService.getAllShipments({ driverId: driverProfile.id });
        res.status(200).json({ success: true, count: result.count, data: result.shipments });
    } catch (error) {
        next(error);
    }
};
