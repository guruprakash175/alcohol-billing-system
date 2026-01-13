const DailyQuota = require('../models/DailyQuota');
const { sendForbidden, sendInternalError } = require('../utils/response');
const logger = require('../utils/logger');

const checkQuotaAvailability = async (req, res, next) => {
  try {
    const { customerId, customerUid, totalVolume } = req.body;
    
    // If no volume specified, skip check
    if (!totalVolume || totalVolume <= 0) {
      return next();
    }
    
    // Determine which ID to use
    const uid = customerUid || (customerId ? req.user?.uid : req.uid);
    
    if (!uid) {
      return sendForbidden(res, 'Customer ID required for quota check');
    }
    
    // Get today's quota
    const quota = await DailyQuota.getTodayQuotaByUid(uid);
    
    if (!quota) {
      return sendInternalError(res, 'Unable to retrieve quota information');
    }
    
    // Check if can consume
    if (!quota.canConsume(totalVolume)) {
      logger.warn(`Quota exceeded for user ${uid}. Trying to consume ${totalVolume}L, remaining: ${quota.remaining}L`);
      
      return sendForbidden(res, 'Daily alcohol quota exceeded', {
        quota: {
          limit: quota.limit,
          consumed: quota.consumed,
          remaining: quota.remaining,
          requestedVolume: totalVolume,
        },
      });
    }
    
    // Attach quota to request for later use
    req.quota = quota;
    
    next();
  } catch (error) {
    logger.error('Quota check error:', error);
    return sendInternalError(res, 'Error checking quota');
  }
};

const validateOrderQuota = async (req, res, next) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return next();
    }
    
    // Calculate total volume
    const totalVolume = items.reduce((sum, item) => {
      return sum + (item.volume * item.quantity);
    }, 0);
    
    // Add to request body for quota check
    req.body.totalVolume = totalVolume;
    
    next();
  } catch (error) {
    logger.error('Order quota validation error:', error);
    return sendInternalError(res, 'Error validating order quota');
  }
};

module.exports = {
  checkQuotaAvailability,
  validateOrderQuota,
};