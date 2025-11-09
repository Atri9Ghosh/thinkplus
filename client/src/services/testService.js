import api from '../utils/api';

export const testService = {
  // Get tests for course
  getCourseTests: async (courseId) => {
    const response = await api.get(`/tests/course/${courseId}`);
    return response.data;
  },

  // Get single test
  getTest: async (id) => {
    const response = await api.get(`/tests/${id}`);
    return response.data;
  },

  // Submit test
  submitTest: async (id, answers, timeTaken) => {
    const response = await api.post(`/tests/${id}/submit`, { answers, timeTaken });
    return response.data;
  },

  // Get test results
  getTestResults: async (userId, testId) => {
    const response = await api.get(`/tests/results/${userId}/${testId}`);
    return response.data;
  },
};




