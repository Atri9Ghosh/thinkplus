import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUserProgress,
  getDashboardData,
  getAllUsers,
  updateUserRole
} from '../controllers/userController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// User profile routes
router.get('/profile/:clerkId', verifyToken, getUserProfile);
router.put('/profile/:clerkId', verifyToken, updateUserProfile);

// Progress and dashboard
router.get('/:id/progress', verifyToken, getUserProgress);
router.get('/:id/dashboard', verifyToken, getDashboardData);

// Admin only routes
router.get('/', verifyToken, requireRole('admin'), getAllUsers);
router.put('/:id/role', verifyToken, requireRole('admin'), updateUserRole);

export default router;




