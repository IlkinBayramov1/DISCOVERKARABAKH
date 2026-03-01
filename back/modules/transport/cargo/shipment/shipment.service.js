import { shipmentRepository } from './shipment.repository.js';
import { cargoVehicleRepository } from '../vehicle/cargoVehicle.repository.js';
import { validateCargoPolicy } from '../policy/cargo.policy.js';
import { cargoEvents, SHIPMENT_EVENTS } from '../events/cargo.events.js';
import { ApiError } from '../../../../core/api.error.js';
import prisma from '../../../../config/db.js';

const ALLOWED_TRANSITIONS = {
    Pending: ['DriverAssigned', 'Cancelled'],
    DriverAssigned: ['VehicleArrived', 'Cancelled'],
    VehicleArrived: ['PickedUp', 'Cancelled'],
    PickedUp: ['InTransit'],
    InTransit: ['AtDropoff', 'Failed'],
    AtDropoff: ['Delivered', 'Failed'],
    Delivered: ['Completed'],
    Failed: ['DriverAssigned', 'Cancelled'],
    Cancelled: [],
    Completed: []
};

class ShipmentService {
    async createShipment(senderId, data) {
        // 1. Idempotency Guard (Prevent Duplicate POSTs)
        if (data.idempotencyKey) {
            const existing = await shipmentRepository.findByIdempotencyKey(data.idempotencyKey);
            if (existing) {
                // Return exactly what was returned previously without modifying DB
                return { ...existing, _idempotentRestored: true };
            }
        }

        // Assign standard dummy pricing breakdown if not fully calculated yet
        // In a real system, this would call pricing Service depending on external maps API
        const basePrice = 50;
        const distanceFee = 120;
        const weightFee = data.weightKg * 0.5;
        const insuranceFee = data.declaredValue ? data.declaredValue * 0.01 : 0;
        const urgencyFee = 0;
        const tax = (basePrice + distanceFee + weightFee + insuranceFee) * 0.18;
        const totalPrice = basePrice + distanceFee + weightFee + insuranceFee + urgencyFee + tax;

        const pricingData = {
            basePrice, distanceFee, weightFee, insuranceFee, urgencyFee, tax, totalPrice
        };

        const shipmentRecord = {
            senderId,
            idempotencyKey: data.idempotencyKey || null,
            pickupLocation: data.pickupLocation,
            dropoffLocation: data.dropoffLocation,
            weightKg: data.weightKg,
            volumeM3: data.volumeM3 || 0,
            dimensions: data.dimensions,
            cargoDescription: data.cargoDescription,
            isHazardous: data.isHazardous || false,
            requiresRefrigeration: data.requiresRefrigeration || false,
            declaredValue: data.declaredValue || 0,
            status: 'Pending'
        };

        const newShipment = await shipmentRepository.createShipment(shipmentRecord, pricingData);

        // Dispatch Event via Node.js EventEmitter (Mocking Message Broker Phase 1)
        cargoEvents.emit(SHIPMENT_EVENTS.CREATED, newShipment);

        return newShipment;
    }

    async assignDriver(shipmentId, cargoVehicleId, driverProfileId, role, userId) {
        const shipment = await shipmentRepository.findById(shipmentId);
        if (!shipment) throw ApiError.notFound('Shipment not found');

        // 2. State Transition Guard
        this._enforceTransition(shipment.status, 'DriverAssigned');

        // Fetch Contexts for Policy Execution
        const vehicle = await cargoVehicleRepository.findById(cargoVehicleId);
        if (!vehicle) throw ApiError.notFound('Cargo vehicle not found');

        const driver = await prisma.driverProfile.findUnique({
            where: { id: driverProfileId },
            include: { capabilities: true }
        });
        if (!driver) throw ApiError.notFound('Driver not found');

        // 3. Execute Pure Function Rule Engine
        validateCargoPolicy(shipment, vehicle, driver);

        // Apply assignment
        const updated = await shipmentRepository.updateStatus(shipmentId, 'DriverAssigned', {
            driverId: driverProfileId,
            cargoVehicleId: cargoVehicleId
        });

        cargoEvents.emit(SHIPMENT_EVENTS.DRIVER_ASSIGNED, updated);
        return updated;
    }

    // Generic status advancement with PoD integration
    async advanceStatus(shipmentId, nextStatus, extraPayload = {}) {
        const shipment = await shipmentRepository.findById(shipmentId);
        if (!shipment) throw ApiError.notFound('Shipment not found');

        this._enforceTransition(shipment.status, nextStatus);

        const updated = await shipmentRepository.updateStatus(shipmentId, nextStatus, extraPayload);

        // Dynamic event emitting based on status
        let eventName = `shipment.${nextStatus.charAt(0).toLowerCase() + nextStatus.slice(1)}`;
        cargoEvents.emit(eventName, updated);

        return updated;
    }

    async getShipmentById(id) {
        const shipment = await shipmentRepository.findById(id);
        if (!shipment) throw ApiError.notFound('Shipment not found');
        return shipment;
    }

    _enforceTransition(currentStatus, nextStatus) {
        const allowed = ALLOWED_TRANSITIONS[currentStatus];
        if (!allowed || !allowed.includes(nextStatus)) {
            throw ApiError.badRequest(`Enterprise Logistics Constraint: Invalid state transition from ${currentStatus} to ${nextStatus}`);
        }
    }
}

export const shipmentService = new ShipmentService();
