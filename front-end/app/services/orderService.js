import { orderAPI } from './api';

export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await orderAPI.create(orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to create order');
    }
  },

  // Get customer's orders
  getMyOrders: async (filters = {}) => {
    try {
      const response = await orderAPI.getMyOrders(filters);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch orders');
    }
  },

  // Get order details
  getOrderById: async (orderId) => {
    try {
      const response = await orderAPI.getById(orderId);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch order details');
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await orderAPI.cancel(orderId);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to cancel order');
    }
  },

  // Validate order before submission
  validateOrder: (cartItems, quota) => {
    if (!cartItems || cartItems.length === 0) {
      return { valid: false, message: 'Cart is empty' };
    }

    const totalVolume = cartItems.reduce(
      (sum, item) => sum + item.volume * item.quantity,
      0
    );

    if (quota && totalVolume > quota.remaining) {
      return {
        valid: false,
        message: `Order exceeds daily quota. Remaining: ${quota.remaining}L`,
      };
    }

    return { valid: true };
  },

  // Format order for submission
  formatOrderData: (cartItems, deliveryInfo = null) => {
    return {
      items: cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        volume: item.volume,
        price: item.price,
        alcoholContent: item.alcoholContent,
      })),
      totalAmount: cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      totalVolume: cartItems.reduce(
        (sum, item) => sum + item.volume * item.quantity,
        0
      ),
      deliveryInfo,
      status: 'pending',
    };
  },
};

export default orderService;