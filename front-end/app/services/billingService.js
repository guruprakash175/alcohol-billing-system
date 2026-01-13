import { billingAPI } from './api';

export const billingService = {
  // Verify customer identity and eligibility
  verifyCustomer: async (customerId) => {
    try {
      const response = await billingAPI.verifyCustomer(customerId);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Customer verification failed');
    }
  },

  // Check customer's remaining quota
  checkQuota: async (customerId) => {
    try {
      const response = await billingAPI.checkQuota(customerId);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to check quota');
    }
  },

  // Scan barcode to get product
  scanBarcode: async (barcode) => {
    try {
      const response = await billingAPI.scanBarcode(barcode);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Product not found');
    }
  },

  // Create transaction (final billing)
  createTransaction: async (transactionData) => {
    try {
      const response = await billingAPI.createTransaction(transactionData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Transaction failed');
    }
  },

  // Get transaction details
  getTransactionById: async (transactionId) => {
    try {
      const response = await billingAPI.getTransactionById(transactionId);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch transaction');
    }
  },

  // Validate transaction before processing
  validateTransaction: (items, customer, quota) => {
    if (!customer) {
      return { valid: false, message: 'Customer not verified' };
    }

    if (!items || items.length === 0) {
      return { valid: false, message: 'No items in cart' };
    }

    const totalVolume = items.reduce(
      (sum, item) => sum + item.volume * item.quantity,
      0
    );

    if (quota && totalVolume > quota.remaining) {
      return {
        valid: false,
        message: `Transaction exceeds daily quota limit. Remaining: ${quota.remaining}L`,
      };
    }

    return { valid: true };
  },

  // Format transaction data
  formatTransactionData: (customer, items, paymentMethod = 'cash') => {
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    
    const totalVolume = items.reduce(
      (sum, item) => sum + item.volume * item.quantity,
      0
    );

    return {
      customerId: customer._id || customer.uid,
      customerName: customer.name || customer.phoneNumber,
      items: items.map((item) => ({
        product: item._id,
        name: item.name,
        barcode: item.barcode,
        quantity: item.quantity,
        volume: item.volume,
        price: item.price,
        alcoholContent: item.alcoholContent,
      })),
      totalAmount,
      totalVolume,
      paymentMethod,
      status: 'completed',
    };
  },

  // Generate receipt data
  generateReceipt: (transaction, shop) => {
    return {
      receiptNumber: transaction.receiptNumber || transaction._id,
      date: new Date(transaction.createdAt).toLocaleString(),
      shopName: shop?.name || 'Alcohol Control POS',
      shopAddress: shop?.address || '',
      customerName: transaction.customerName,
      items: transaction.items,
      subtotal: transaction.totalAmount,
      tax: transaction.totalAmount * 0.05, // 5% tax example
      total: transaction.totalAmount * 1.05,
      totalVolume: transaction.totalVolume,
      paymentMethod: transaction.paymentMethod,
    };
  },

  // Calculate quota impact
  calculateQuotaImpact: (items) => {
    return items.reduce(
      (sum, item) => sum + item.volume * item.quantity,
      0
    );
  },
};

export default billingService;