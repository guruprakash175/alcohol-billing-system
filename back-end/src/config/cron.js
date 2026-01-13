const cron = require('node-cron');
const DailyQuota = require('../models/DailyQuota');
const logger = require('../utils/logger');

// Reset daily quotas at midnight (00:00)
const scheduleQuotaReset = () => {
  // Run every day at midnight (0 0 * * *)
  const resetTime = process.env.QUOTA_RESET_TIME || '00:00';
  const [hour, minute] = resetTime.split(':');
  
  const cronExpression = `${minute} ${hour} * * *`;

  cron.schedule(cronExpression, async () => {
    try {
      logger.info('Starting daily quota reset...');
      
      const result = await DailyQuota.updateMany(
        {},
        {
          $set: {
            consumed: 0,
            lastReset: new Date(),
          },
        }
      );

      logger.info(`Daily quota reset completed. Updated ${result.modifiedCount} records`);
    } catch (error) {
      logger.error('Error resetting daily quotas:', error.message);
    }
  });

  logger.info(`Quota reset scheduled at ${resetTime} daily (${cronExpression})`);
};

// Manual quota reset (for testing or manual trigger)
const resetAllQuotas = async () => {
  try {
    const result = await DailyQuota.updateMany(
      {},
      {
        $set: {
          consumed: 0,
          lastReset: new Date(),
        },
      }
    );

    logger.info(`Manual quota reset: Updated ${result.modifiedCount} records`);
    return result;
  } catch (error) {
    logger.error('Error in manual quota reset:', error.message);
    throw error;
  }
};

// Clean up old quota records (older than 90 days)
const cleanupOldQuotas = () => {
  // Run every day at 1:00 AM
  cron.schedule('0 1 * * *', async () => {
    try {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const result = await DailyQuota.deleteMany({
        lastReset: { $lt: ninetyDaysAgo },
        consumed: 0,
      });

      if (result.deletedCount > 0) {
        logger.info(`Cleaned up ${result.deletedCount} old quota records`);
      }
    } catch (error) {
      logger.error('Error cleaning up old quotas:', error.message);
    }
  });

  logger.info('Old quota cleanup scheduled at 1:00 AM daily');
};

// Initialize all cron jobs
const initializeCronJobs = () => {
  scheduleQuotaReset();
  cleanupOldQuotas();
  logger.info('All cron jobs initialized');
};

module.exports = {
  initializeCronJobs,
  resetAllQuotas,
  scheduleQuotaReset,
  cleanupOldQuotas,
};