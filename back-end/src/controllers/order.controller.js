const orderService = require('../services/order.service');
const { sendSuccess, sendCreated, sendNotFound, sendBadRequest } = require('../utils/response');
const logger = require('../utils/logger');

exports.createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(
      req.user._id,
      req.user.uid,
      req.body
    );
    return sendCreated(res, { order });
  } catch (error) {
    logger.error('Create order error:', error);
    return sendBadRequest(res, error.message);
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await orderService.getCustomerOrders(req.user._id);
    return sendSuccess(res, { orders, count: orders.length });
  } catch (error) {
    logger.error('Get orders error:', error);
    return sendBadRequest(res, error.message);
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return sendNotFound(res, 'Order not found');
    }
    return sendSuccess(res, { order });
  } catch (error) {
    logger.error('Get order error:', error);
    return sendBadRequest(res, error.message);
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await orderService.cancelOrder(req.params.id, reason);
    return sendSuccess(res, { order }, 'Order cancelled');
  } catch (error) {
    logger.error('Cancel order error:', error);
    return sendBadRequest(res, error.message);
  }
};