import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Get token from localStorage or Firebase
    const token = localStorage.getItem('firebaseToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('firebaseToken');
        localStorage.removeItem('userRole');
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
      
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      return Promise.reject(error);
    }
  }
);

// Auth API
export const authAPI = {
  syncUser: (userData) => api.post('/auth/sync-user', userData),
  verifyToken: (token) => api.post('/auth/verify-token', { token }),
};

// Product API
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  search: (query) => api.get('/products/search', { params: { q: query } }),
};

// Order API (Customer)
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

// Billing API (Cashier)
export const billingAPI = {
  verifyCustomer: (customerId) => api.get(`/billing/verify-customer/${customerId}`),
  checkQuota: (customerId) => api.get(`/billing/check-quota/${customerId}`),
  createTransaction: (transactionData) => api.post('/billing/transaction', transactionData),
  getTransactionById: (id) => api.get(`/billing/transaction/${id}`),
  scanBarcode: (barcode) => api.get(`/billing/scan/${barcode}`),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getQuota: () => api.get('/users/quota'),
  getHistory: (params) => api.get('/users/history', { params }),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getTransactions: (params) => api.get('/admin/transactions', { params }),
  getReports: (params) => api.get('/admin/reports', { params }),
  updateSettings: (data) => api.put('/admin/settings', data),
  getSettings: () => api.get('/admin/settings'),
};

export default api;