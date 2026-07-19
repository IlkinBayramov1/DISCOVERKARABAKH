import { driverService } from './driver.service.js';

// For prospective drivers to register
export const registerDriver = async (req, res, next) => {
    try {
        const driver = await driverService.registerDriver(req.user.id, req.body);
        res.status(201).json({ success: true, data: driver });
    } catch (error) {
        next(error);
    }
};

export const createDriver = async (req, res, next) => {
    try {
        // Vendor creates a driver. req.user.id is the vendorId.
        const driver = await driverService.createDriverByVendor(req.user.id, req.body);
        res.status(201).json({ success: true, data: driver });
    } catch (error) {
        next(error);
    }
};

export const getMyDriverProfile = async (req, res, next) => {
    try {
        const profile = await driverService.getMyProfile(req.user.id);
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        next(error);
    }
};

export const getTransportVendors = async (req, res, next) => {
    try {
        const vendors = await driverService.getTransportVendors();
        res.status(200).json({ success: true, data: vendors });
    } catch (error) {
        next(error);
    }
};

export const getDrivers = async (req, res, next) => {
    try {
        const result = await driverService.getDrivers(req.user.id, req.user.role, req.query);
        res.status(200).json({ success: true, count: result.count, data: result.drivers });
    } catch (error) {
        next(error);
    }
};

export const approveDriver = async (req, res, next) => {
    try {
        const driver = await driverService.approveDriver(req.params.id, req.user.id, req.user.role);
        res.status(200).json({ success: true, data: driver });
    } catch (error) {
        next(error);
    }
};

export const assignDriverVehicle = async (req, res, next) => {
    try {
        const driver = await driverService.assignVehicle(req.params.id, req.user.id, req.user.role, req.body);
        res.status(200).json({ success: true, data: driver });
    } catch (error) {
        next(error);
    }
};

export const updateDriverStatus = async (req, res, next) => {
    try {
        // Driver toggles online/offline
        const { status } = req.body;
        const driver = await driverService.updateStatus(req.params.id, req.user.id, status);
        res.status(200).json({ success: true, data: driver });
    } catch (error) {
        next(error);
    }
};

export const updateDriverLicense = async (req, res, next) => {
    try {
        const { id } = req.params;
        let targetDriverId = id;
        if (!targetDriverId) {
            // Self update
            const ownProfile = await driverService.getMyProfile(req.user.id);
            targetDriverId = ownProfile.id;
        }

        const driver = await driverService.updateLicense(req.user.id, req.user.role, targetDriverId, req.body);
        res.status(200).json({ success: true, data: driver });
    } catch (error) {
        next(error);
    }
};

