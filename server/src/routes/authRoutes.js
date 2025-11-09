import express from 'express';
import {
  syncUser,
  getUserByClerkId,
  webhookHandler
} from '../controllers/authController.js';
import { verifyToken, optionalAuth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Webhook endpoint (no auth required)
router.post('/webhook', webhookHandler);

// Sync user endpoint
router.post('/sync', apiLimiter, syncUser);

// Get user by Clerk ID
router.get('/user/:clerkId', optionalAuth, getUserByClerkId);

export default router;




