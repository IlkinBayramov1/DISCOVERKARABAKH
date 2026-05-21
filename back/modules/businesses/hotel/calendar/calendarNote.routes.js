import express from 'express';
import { calendarNoteController } from './calendarNote.controller.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';

const router = express.Router({ mergeParams: true });

// All routes are protected for vendors/admins
router.use(authMiddleware);
router.use(authorize('vendor', 'admin'));

router.get('/', calendarNoteController.getNotes);
router.post('/', calendarNoteController.createNote);
router.delete('/', calendarNoteController.deleteNote);

export default router;
