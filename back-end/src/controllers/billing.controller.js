const billingService = require('../services/billing.service');
const quotaService = require('../services/quota.service');
const User = require('../models/User');
const { sendSuccess, sendCreated, sendNotFound, sendBadRequest } = require('../utils/response');
const auditService = require('../services/audit.service');
const logger = require('../utils/logger');

exports.createTransaction = async (req, res) => {
  try {
    const transaction = await billingService.createTransaction(
      req.user.uid,
      req.body
    );
    
    auditService.logTransaction(
      transaction._id,
      transaction.customer,
      transaction.cashier,
      transaction.finalAmount
    );
    
    return sendCreated(res, { transaction });
  } catch (error) {
    logger.error('Create transaction error:', error);
    return sendBadRequest(res, error.message);
  }
};

exports.verifyCustomer = async (req, res) => {
  try {
    const customer = await User.findOne({
      $or: [
        { _id: req.params.customerId },
        { uid: req.params.customerId },
        { phoneNumber: req.params.customerId }
      ]
    });
    
    if (!customer) {
      return sendNotFound(res, 'Customer not found');
    }
    
    return sendSuccess(res, { customer });
  } catch (error) {
    logger.error('Verify customer error:', error);
    return sendBadRequest(res, error.message);
  }
};

exports.checkQuota = async (req, res) => {
  try {
    const customer = await User.findOne({
      $or: [
        { _id: req.params.customerId },
        { uid: req.params.customerId }
      ]
    });
    
    if (!customer) {
      return sendNotFound(res, 'Customer not found');
    }
    
    const quota = await quotaService.getTodayQuotaByUid(customer.uid);
    return sendSuccess(res, { quota });
  } catch (error) {
    logger.error('Check quota error:', error);
    return sendBadRequest(res, error.message);
  }
};

exports.scanProduct = async (req, res) => {
  try {
    const product = await billingService.getProductByBarcode(req.params.barcode);
    return sendSuccess(res, { product });
  } catch (error) {
    logger.error('Scan product error:', error);
    return sendBadRequest(res, error.message);
  }
};