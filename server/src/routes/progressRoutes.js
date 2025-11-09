import express from 'express';
import {
  getProgress,
  updateProgress,
  markVideoComplete,
  markModuleComplete
} from '../controllers/progressController.js';
import { verifyToken } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

router.get('/:userId/:courseId', apiLimiter, getProgress);
router.post('/:userId/:courseId/update', apiLimiter, updateProgress);
router.post('/:userId/:courseId/video-complete', apiLimiter, markVideoComplete);
router.post('/:userId/:courseId/module-complete', apiLimiter, markModuleComplete);

export default router;




