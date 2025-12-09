import { createClerkClient } from '@clerk/backend';
import jwt from 'jsonwebtoken';
const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.sub) {
        try {
          const user = await clerk.users.getUser(decoded.sub);
          if (user) {
            req.user = {
              clerkId: decoded.sub,
              email: user.emailAddresses?.[0]?.emailAddress || decoded.email,
            };
            return next();
          }
        } catch (userError) {
          req.user = {
            clerkId: decoded.sub,
            email: decoded.email,
          };
          return next();
        }
      }
    } catch (verifyError) {
      console.error('Token verification error:', verifyError.message);
      try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.sub) {
          req.user = {
            clerkId: decoded.sub,
            email: decoded.email,
          };
          return next();
        }
      } catch (decodeError) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    }

    return res.status(401).json({ error: 'Invalid token' });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};
export const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const User = (await import('../models/User.js')).default;
      const user = await User.findOne({ clerkId: req.user.clerkId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      req.user.role = user.role;
      req.user.userId = user._id;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({ error: 'Authorization failed' });
    }
  };
};
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.sub) {
          req.user = {
            clerkId: decoded.sub,
            email: decoded.email,
          };
        }
      } catch (tokenError) {
      }
    }

    next();
  } catch (error) {
    next();
  }
};


