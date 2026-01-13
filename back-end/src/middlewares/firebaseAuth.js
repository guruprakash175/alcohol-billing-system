const { verifyIdToken, isFirebaseEnabled } = require('../config/firebaseAdmin');
const User = require('../models/User');
const { sendUnauthorized, sendInternalError } = require('../utils/response');
const logger = require('../utils/logger');

const authenticateFirebase = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendUnauthorized(res, 'No token provided');
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      return sendUnauthorized(res, 'Invalid token format');
    }
    
    // Verify Firebase ID token
    let decodedToken;
    
    if (isFirebaseEnabled()) {
      decodedToken = await verifyIdToken(idToken);
    } else {
      logger.warn('Firebase disabled: Using mock auth for development');
      // Mock token for development
      decodedToken = {
        uid: 'dev-user-123',
        email: 'dev@example.com',
        phone_number: '+919876543210',
        name: 'Dev User',
        role: 'customer'
      };
    }
    
    // Find or create user in database
    let user = await User.findByUid(decodedToken.uid);
    
    if (!user) {
      // Create new user
      user = await User.create({
        uid: decodedToken.uid,
        email: decodedToken.email,
        phoneNumber: decodedToken.phone_number,
        name: decodedToken.name,
        role: decodedToken.role || 'customer',
      });
      
      logger.info(`New user created: ${user.uid}`);
    }
    
    // Check if user is active
    if (!user.isActive) {
      return sendUnauthorized(res, 'Account is inactive');
    }
    
    // Attach user and decoded token to request
    req.user = user;
    req.decodedToken = decodedToken;
    req.uid = decodedToken.uid;
    req.userRole = decodedToken.role || user.role;
    
    // Update last login
    user.updateLastLogin().catch(err => {
      logger.error('Error updating last login:', err);
    });
    
    next();
  } catch (error) {
    logger.error('Firebase auth error:', error);
    
    if (error.message === 'Invalid or expired token') {
      return sendUnauthorized(res, 'Invalid or expired token');
    }
    
    return sendInternalError(res, 'Authentication failed');
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await verifyIdToken(idToken);
      
      const user = await User.findByUid(decodedToken.uid);
      
      if (user && user.isActive) {
        req.user = user;
        req.decodedToken = decodedToken;
        req.uid = decodedToken.uid;
        req.userRole = decodedToken.role || user.role;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticateFirebase,
  optionalAuth,
};