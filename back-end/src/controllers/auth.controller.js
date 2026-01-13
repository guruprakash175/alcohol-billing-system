const User = require('../models/User');
const { setUserRole } = require('../config/firebaseAdmin');
const { sendSuccess, sendCreated, sendBadRequest } = require('../utils/response');
const auditService = require('../services/audit.service');
const logger = require('../utils/logger');

exports.syncUser = async (req, res) => {
  try {
    let { uid, email, phoneNumber, role, name } = req.body;

    if (!uid) {
      return sendBadRequest(res, 'UID is required');
    }

    let user = await User.findByUid(uid);

    // 🔹 Demo Account Role Enforcement
    if (email === 'admin@pos.com') role = 'admin';
    if (email === 'cashier@pos.com') role = 'cashier';

    if (user) {
      // Update existing user
      if (email) user.email = email;
      if (phoneNumber) user.phoneNumber = phoneNumber;
      if (name) user.name = name;
      
      // Force role update for demo accounts
      if (role && (email === 'admin@pos.com' || email === 'cashier@pos.com')) {
        user.role = role;
      }
      
      await user.save();
      
      return sendSuccess(res, { user }, 'User synced successfully');
    }

    // Create new user
    user = await User.create({
      uid,
      email,
      phoneNumber,
      name,
      role: role || 'customer',
    });

    // Set custom claims in Firebase
    if (role) {
      await setUserRole(uid, role);
    }

    auditService.logLogin(uid, user.role);
    logger.info(`New user created: ${uid}`);

    return sendCreated(res, { user }, 'User created successfully');
  } catch (error) {
    logger.error('Sync user error:', error);
    return sendBadRequest(res, error.message);
  }
};

exports.verifyToken = async (req, res) => {
  try {
    return sendSuccess(res, {
      valid: true,
      user: req.user,
      role: req.userRole,
    }, 'Token is valid');
  } catch (error) {
    logger.error('Verify token error:', error);
    return sendBadRequest(res, error.message);
  }
};