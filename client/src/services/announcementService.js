import api from '../utils/api';

export const announcementService = {
  // Get announcements
  getAnnouncements: async (targetAudience) => {
    const params = targetAudience ? `?targetAudience=${targetAudience}` : '';
    const response = await api.get(`/announcements${params}`);
    return response.data;
  },

  // Get single announcement
  getAnnouncement: async (id) => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },
};




