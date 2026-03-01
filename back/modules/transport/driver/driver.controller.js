import { driverService } from './driver.service.js';

// For prospective drivers to register
export const registerDriver = async (req, res, next) => {
    try {
        // If managed by a vendor, maybe vendor ID is passed or inferred?
        // Let's assume standard user creates profile.
        // If Vendor creates driver, different flow?
        // MVP: User registers self as driver.
        const driver = await driverService.registerDriver(req.user.id, req.body);
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
