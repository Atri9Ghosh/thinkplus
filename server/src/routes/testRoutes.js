import express from 'express';
import {
  getCourseTests,
  getTest,
  createTest,
  updateTest,
  deleteTest,
  submitTest,
  getTestResults,
  getTestAnalytics
} from '../controllers/testController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes (with auth)
router.get('/course/:courseId', verifyToken, getCourseTests);
router.get('/:id', verifyToken, getTest);
router.post('/:id/submit', verifyToken, submitTest);
router.get('/results/:userId/:testId', verifyToken, getTestResults);

// Admin only routes
router.post('/', verifyToken, requireRole('admin'), createTest);
router.put('/:id', verifyToken, requireRole('admin'), updateTest);
router.delete('/:id', verifyToken, requireRole('admin'), deleteTest);
router.get('/analytics/:testId', verifyToken, requireRole('admin'), getTestAnalytics);

export default router;




