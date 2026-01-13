const { sendForbidden } = require('../utils/response');
const logger = require('../utils/logger');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.userRole) {
      return sendForbidden(res, 'Access denied. No user role found.');
    }
    
    const userRole = req.userRole;
    
    if (!allowedRoles.includes(userRole)) {
      logger.warn(`Unauthorized access attempt by ${req.uid} with role ${userRole}`);
      return sendForbidden(res, `Access denied. Required role: ${allowedRoles.join(' or ')}`);
    }
    
    next();
  };
};

// Specific role middleware
const isCustomer = authorize('customer');
const isCashier = authorize('cashier', 'admin');
const isAdmin = authorize('admin');
const isCashierOrAdmin = authorize('cashier', 'admin');

module.exports = {
  authorize,
  isCustomer,
  isCashier,
  isAdmin,
  isCashierOrAdmin,
};