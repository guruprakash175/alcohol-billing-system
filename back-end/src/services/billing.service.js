const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const User = require('../models/User');
const DailyQuota = require('../models/DailyQuota');
const quotaService = require('./quota.service');
const logger = require('../utils/logger');

class BillingService {
  async createTransaction(cashierUid, transactionData) {
    try {
      // Verify customer
      const customer = await User.findOne({ 
        $or: [
          { _id: transactionData.customerId },
          { uid: transactionData.customerUid }
        ]
      });

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Get cashier
      const cashier = await User.findByUid(cashierUid);
      if (!cashier) {
        throw new Error('Cashier not found');
      }

      // Verify stock and update
      for (const item of transactionData.items) {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }
        await product.decreaseStock(item.quantity);
      }

      // Get quota
      const quota = await quotaService.getTodayQuotaByUid(customer.uid);

      // Create transaction
      const transaction = await Transaction.create({
        customer: customer._id,
        customerUid: customer.uid,
        customerName: customer.name || customer.phoneNumber,
        cashier: cashier._id,
        cashierUid: cashier.uid,
        quotaUsed: quota.consumed + transactionData.totalVolume,
        quotaRemaining: quota.remaining - transactionData.totalVolume,
        ...transactionData,
      });

      // Update quota
      await quotaService.addConsumption(customer._id, transactionData.totalVolume, transaction._id);

      return transaction;
    } catch (error) {
      logger.error('Error creating transaction:', error);
      throw error;
    }
  }

  async getTransactionById(transactionId) {
    try {
      return await Transaction.findById(transactionId)
        .populate('customer', 'name phoneNumber')
        .populate('cashier', 'name email');
    } catch (error) {
      logger.error('Error getting transaction:', error);
      throw error;
    }
  }

  async getProductByBarcode(barcode) {
    try {
      const product = await Product.findByBarcode(barcode);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      logger.error('Error getting product by barcode:', error);
      throw error;
    }
  }
}

module.exports = new BillingService();