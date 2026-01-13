import { loginWithEmail, sendOTP, verifyOTP, signOut } from '@/app/firebase/auth';
import { authAPI } from './api';

export const authService = {
  // Customer Login with Phone OTP
  customerLogin: async (phoneNumber, confirmationResult, otp) => {
    try {
      let result;
      
      if (confirmationResult && otp) {
        // Verify OTP
        result = await verifyOTP(confirmationResult, otp);
      } else if (phoneNumber) {
        // Send OTP
        return await sendOTP(phoneNumber);
      }

      if (result) {
        // Sync user with backend
        const { user, idToken } = result;
        localStorage.setItem('firebaseToken', idToken);
        
        const response = await authAPI.syncUser({
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          role: 'customer',
        });

        return {
          user,
          role: 'customer',
          backendUser: response.data?.data?.user,
        };
      }
    } catch (error) {
      throw error;
    }
  },

  // Staff Login (Cashier/Admin) with Email/Password
  staffLogin: async (email, password) => {
    try {
      const { user, idToken } = await loginWithEmail(email, password);
      localStorage.setItem('firebaseToken', idToken);

      // Sync with backend and get role
      const response = await authAPI.syncUser({
        uid: user.uid,
        email: user.email,
      });

      const role = response.data?.data?.user?.role;

      // Validate role
      // if (role !== 'cashier' && role !== 'admin') {
      //   await signOut();
      //   throw new Error('Unauthorized access. Invalid role.');
      // }

      return {
        user,
        role,
        backendUser: response.data?.data?.user,
      };
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut();
      localStorage.removeItem('firebaseToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('cart');
    } catch (error) {
      throw error;
    }
  },

  // Verify current session
  verifySession: async () => {
    try {
      const token = localStorage.getItem('firebaseToken');
      if (!token) return null;

      const response = await authAPI.verifyToken(token);
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

export default authService;