import express from 'express';
import {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcementController.js';
import { verifyToken, requireRole, optionalAuth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes (optional auth)
router.get('/', optionalAuth, apiLimiter, getAnnouncements);
router.get('/:id', optionalAuth, apiLimiter, getAnnouncement);

// Admin only routes
router.post('/', verifyToken, requireRole('admin'), createAnnouncement);
router.put('/:id', verifyToken, requireRole('admin'), updateAnnouncement);
router.delete('/:id', verifyToken, requireRole('admin'), deleteAnnouncement);

export default router;




