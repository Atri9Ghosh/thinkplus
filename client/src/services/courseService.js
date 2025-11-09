import api from '../utils/api';

export const courseService = {
  // Get all courses
  getCourses: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.examType) params.append('examType', filters.examType);
    if (filters.priceRange) params.append('priceRange', filters.priceRange);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/courses?${params.toString()}`);
    return response.data;
  },

  // Get single course
  getCourse: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Enroll in course
  enrollInCourse: async (id) => {
    const response = await api.post(`/courses/${id}/enroll`);
    return response.data;
  },

  // Get course content (for enrolled users)
  getCourseContent: async (id) => {
    const response = await api.get(`/courses/${id}/content`);
    return response.data;
  },

  // Add review
  addReview: async (id, review) => {
    const response = await api.post(`/courses/${id}/review`, review);
    return response.data;
  },

  // Get enrolled courses
  getEnrolledCourses: async (userId) => {
    const response = await api.get(`/courses/enrolled/${userId}`);
    return response.data;
  },

  // Admin: Create course
  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  // Admin: Update course
  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  // Admin: Delete course
  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
};




