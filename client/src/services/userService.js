import api from '../utils/api';

export const userService = {
  // Get user profile
  getUserProfile: async (clerkId) => {
    const response = await api.get(`/users/profile/${clerkId}`);
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (clerkId, profileData) => {
    const response = await api.put(`/users/profile/${clerkId}`, profileData);
    return response.data;
  },

  // Get user progress
  getUserProgress: async (userId) => {
    const response = await api.get(`/users/${userId}/progress`);
    return response.data;
  },

  // Get dashboard data
  getDashboardData: async (userId) => {
    const response = await api.get(`/users/${userId}/dashboard`);
    return response.data;
  },

  // Sync user with Clerk
  syncUser: async (userData) => {
    const response = await api.post('/auth/sync', userData);
    return response.data;
  },
};




