const User = require('../models/User');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const DailyQuota = require('../models/DailyQuota');
const { sendSuccess, sendBadRequest, sendNotFound } = require('../utils/response');
const logger = require('../utils/logger');

exports.getDashboardStats = async (req, res) => {
  try {
    const todaySales = await Transaction.getTodaySalesTotal();
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalProducts = await Product.countDocuments({ isActive: true });
    const quotaViolations = await DailyQuota.countDocuments({
      $expr: { $gt: ['$consumed', '$limit'] },
      date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    
    return sendSuccess(res, {
      stats: {
        todaySales: todaySales.totalSales,
        todayTransactions: todaySales.count,
        totalUsers,
        totalProducts,
        quotaViolations,
        avgTransaction: todaySales.count > 0 ? todaySales.totalSales / todaySales.count : 0,
      }
    });
  } catch (error) {
    logger.error('Dashboard stats error:', error);
    return sendBadRequest(res, error.message);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = { isActive: true };
    
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query).select('-__v');
    return sendSuccess(res, { users, count: users.length });
  } catch (error) {
    logger.error('Get users error:', error);
    return sendBadRequest(res, error.message);
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const transactions = await Transaction.find(query)
      .populate('customer', 'name phoneNumber')
      .populate('cashier', 'name email')
      .sort({ createdAt: -1 });
      
    return sendSuccess(res, { transactions, count: transactions.length });
  } catch (error) {
    logger.error('Get transactions error:', error);
    return sendBadRequest(res, error.message);
  }
};