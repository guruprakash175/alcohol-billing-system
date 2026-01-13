const DailyQuota = require('../models/DailyQuota');
const logger = require('../utils/logger');

class QuotaService {
  async getTodayQuota(userId) {
    try {
      return await DailyQuota.getTodayQuota(userId);
    } catch (error) {
      logger.error('Error getting today quota:', error);
      throw error;
    }
  }

  async getTodayQuotaByUid(userUid) {
    try {
      return await DailyQuota.getTodayQuotaByUid(userUid);
    } catch (error) {
      logger.error('Error getting quota by UID:', error);
      throw error;
    }
  }

  async addConsumption(userId, volume, transactionId) {
    try {
      const quota = await this.getTodayQuota(userId);
      return await quota.addConsumption(volume, transactionId);
    } catch (error) {
      logger.error('Error adding consumption:', error);
      throw error;
    }
  }

  async canConsume(userId, volume) {
    try {
      const quota = await this.getTodayQuota(userId);
      return quota.canConsume(volume);
    } catch (error) {
      logger.error('Error checking can consume:', error);
      throw error;
    }
  }

  async getQuotaHistory(userId, days = 30) {
    try {
      return await DailyQuota.getQuotaHistory(userId, days);
    } catch (error) {
      logger.error('Error getting quota history:', error);
      throw error;
    }
  }

  async getUsersExceedingLimit() {
    try {
      return await DailyQuota.getUsersExceedingLimit();
    } catch (error) {
      logger.error('Error getting users exceeding limit:', error);
      throw error;
    }
  }

  async resetQuota(userId) {
    try {
      const quota = await this.getTodayQuota(userId);
      return await quota.reset();
    } catch (error) {
      logger.error('Error resetting quota:', error);
      throw error;
    }
  }
}

module.exports = new QuotaService();