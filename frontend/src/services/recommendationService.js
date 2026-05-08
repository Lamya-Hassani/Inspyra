import api from './api';

const recommendationService = {
  getPreferences: async () => {
    const response = await api.get('/recommendations/preferences/');
    return response.data;
  },

  updatePreferences: async (data) => {
    const response = await api.put('/recommendations/preferences/', data);
    return response.data;
  },

  getRecommendations: async () => {
    const response = await api.get('/recommendations/recommendations/');
    return response.data;
  }
};

export default recommendationService;
