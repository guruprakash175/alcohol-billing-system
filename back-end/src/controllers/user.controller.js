const User = require('../models/User');
const quotaService = require('../services/quota.service');
const Transaction = require('../models/Transaction');
const { sendSuccess, sendBadRequest } = require('../utils/response');
const logger = require('../utils/logger');

exports.getProfile = async (req, res) => {
  try {
    return sendSuccess(res, { user: req.user });
  } catch (error) {
    logger.error('Get profile error:', error);
    return sendBadRequest(res, error.message);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'dateOfBirth', 'address'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return sendBadRequest(res, 'Invalid updates');
    }
    
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    
    return sendSuccess(res, { user: req.user }, 'Profile updated');
  } catch (error) {
    logger.error('Update profile error:', error);
    return sendBadRequest(res, error.message);
  }
};

exports.getQuota = async (req, res) => {
  try {
    const quota = await quotaService.getTodayQuotaByUid(req.user.uid);
    return sendSuccess(res, { quota });
  } catch (error) {
    logger.error('Get quota error:', error);
    return sendBadRequest(res, error.message);
  }
};

exports.getHistory = async (req, res) => {
  try {
    const transactions = await Transaction.findByCustomer(req.user._id);
    return sendSuccess(res, { transactions, count: transactions.length });
  } catch (error) {
    logger.error('Get history error:', error);
    return sendBadRequest(res, error.message);
  }
};