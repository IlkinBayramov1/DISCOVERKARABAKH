import { driverService } from '../driver/driver.service.js';

export const getFleetMap = async (req, res, next) => {
    try {
        const vendorId = req.user.id;
        const locations = await driverService.getFleetLocations(vendorId);
        
        res.status(200).json({ success: true, count: locations.length, data: locations });
    } catch (error) {
        next(error);
    }
};
