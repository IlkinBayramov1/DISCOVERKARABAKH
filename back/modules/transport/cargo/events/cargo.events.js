import { EventEmitter } from 'events';

class CargoEventEmitter extends EventEmitter { }

export const cargoEvents = new CargoEventEmitter();

// Event Constants
export const SHIPMENT_EVENTS = {
    CREATED: 'shipment.created',
    DRIVER_ASSIGNED: 'shipment.driverAssigned',
    VEHICLE_ARRIVED: 'shipment.vehicleArrived',
    PICKED_UP: 'shipment.pickedUp',
    IN_TRANSIT: 'shipment.inTransit',
    AT_DROPOFF: 'shipment.atDropoff',
    DELIVERED: 'shipment.delivered',
    COMPLETED: 'shipment.completed',
    CANCELLED: 'shipment.cancelled',
    FAILED: 'shipment.failed'
};

/**
 * Basic Event Listeners (Phase 1 In-Memory)
 * Ready to be swapped with Message Broker (RabbitMQ/Kafka) in Phase 2
 */

cargoEvents.on(SHIPMENT_EVENTS.CREATED, (shipment) => {
    // Logic: Send push notification to user, deduct preliminary balance, etc.
    console.log(`[CARGO EVENT] Shipment Created: ${shipment.id}`);
});

cargoEvents.on(SHIPMENT_EVENTS.DELIVERED, (shipment) => {
    // Logic: Notify sender, release funds to driver/vendor
    console.log(`[CARGO EVENT] Shipment Delivered: ${shipment.id}`);
});

cargoEvents.on(SHIPMENT_EVENTS.FAILED, (shipment) => {
    // Logic: Trigger support alert, handle refund or retry
    console.log(`[CARGO EVENT] Shipment Failed: ${shipment.id}`);
});
