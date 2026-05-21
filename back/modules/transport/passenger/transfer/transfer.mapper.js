// Basic DTO mapper
export const toTransferDTO = (transfer) => {
    return {
        id: transfer.id,
        status: transfer.status,
        origin: transfer.pickupLocation,
        destination: transfer.dropoffLocation,
        price: transfer.price,
        driver: transfer.driver ? {
            name: `${transfer.driver.firstName} ${transfer.driver.lastName}`,
            phone: transfer.driver.phone,
            rating: transfer.driver.rating
        } : null,
        vehicle: transfer.vehicle ? {
            model: `${transfer.vehicle.brand} ${transfer.vehicle.model}`,
            plate: transfer.vehicle.plateNumber
        } : null,
        createdAt: transfer.createdAt
    };
};
