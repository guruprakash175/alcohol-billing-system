const Order = require('../models/Order');
const Product = require('../models/Product');
const logger = require('../utils/logger');

class OrderService {
  async createOrder(customerId, customerUid, orderData) {
    try {
      // Validate products and stock
      for (const item of orderData.items) {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product ${item.product} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
      }

      const order = await Order.create({
        customer: customerId,
        customerUid,
        ...orderData,
      });

      return order;
    } catch (error) {
      logger.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrderById(orderId) {
    try {
      return await Order.findById(orderId).populate('items.product');
    } catch (error) {
      logger.error('Error getting order:', error);
      throw error;
    }
  }

  async getCustomerOrders(customerId, filters = {}) {
    try {
      return await Order.findByCustomer(customerId);
    } catch (error) {
      logger.error('Error getting customer orders:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      return await order.updateStatus(status);
    } catch (error) {
      logger.error('Error updating order status:', error);
      throw error;
    }
  }

  async cancelOrder(orderId, reason) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      return await order.cancel(reason);
    } catch (error) {
      logger.error('Error cancelling order:', error);
      throw error;
    }
  }
}

module.exports = new OrderService();