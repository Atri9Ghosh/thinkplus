import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getCourseContent,
  addReview,
  getEnrolledCourses
} from '../controllers/courseController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.get('/', apiLimiter, getCourses);
router.get('/:id', apiLimiter, getCourse);

// Protected routes
router.post('/:id/enroll', verifyToken, enrollInCourse);
router.get('/:id/content', verifyToken, getCourseContent);
router.post('/:id/review', verifyToken, addReview);
router.get('/enrolled/:userId', verifyToken, getEnrolledCourses);

// Admin only routes
router.post('/', verifyToken, requireRole('admin'), createCourse);
router.put('/:id', verifyToken, requireRole('admin'), updateCourse);
router.delete('/:id', verifyToken, requireRole('admin'), deleteCourse);

export default router;




