import api from './api';

export const userService = {
  // Register new user (customer)
  registerUser: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  // Get user profile
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/profile/${userId}`);
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (userId, userData) => {
    const response = await api.put(`/users/profile/${userId}`, userData);
    return response.data;
  },

  // Get user by phone number
  getUserByPhone: async (phoneNumber) => {
    const response = await api.get(`/users/phone/${phoneNumber}`);
    return response.data;
  },

  // Upload ID document
  uploadIDDocument: async (userId, idImage) => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('idDocument', idImage);
    
    const response = await api.post('/users/upload-id', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get transaction history
  getTransactionHistory: async (userId, params = {}) => {
    const response = await api.get(`/users/transactions/${userId}`, { params });
    return response.data;
  },
};

export default userService;