import api from '../utils/api';

export const progressService = {
  // Get progress for course
  getProgress: async (userId, courseId) => {
    const response = await api.get(`/progress/${userId}/${courseId}`);
    return response.data;
  },

  // Update progress
  updateProgress: async (userId, courseId, progressData) => {
    const response = await api.post(`/progress/${userId}/${courseId}/update`, progressData);
    return response.data;
  },

  // Mark video as complete
  markVideoComplete: async (userId, courseId, videoId) => {
    const response = await api.post(`/progress/${userId}/${courseId}/video-complete`, { videoId });
    return response.data;
  },

  // Mark module as complete
  markModuleComplete: async (userId, courseId, moduleName) => {
    const response = await api.post(`/progress/${userId}/${courseId}/module-complete`, { moduleName });
    return response.data;
  },
};




