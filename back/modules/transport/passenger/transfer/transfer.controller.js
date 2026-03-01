import { transferService } from './transfer.service.js';

export const createTransfer = async (req, res, next) => {
    try {
        const transfer = await transferService.createTransfer(req.user.id, req.body);
        res.status(201).json({ success: true, data: transfer });
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

export const updateTransferStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const transfer = await transferService.updateStatus(req.params.id, status, req.user.id);
        res.status(200).json({ success: true, data: transfer });
    } catch (error) {
        next(error);
    }
};
