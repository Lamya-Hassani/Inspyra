import API from './api';

const productService = {
  getPlants: async (params = {}) => {
    const response = await API.get('products/plantes/', { params });
    return response.data;
  },

  getPlant: async (id) => {
    const response = await API.get(`products/plantes/${id}/`);
    return response.data;
  },

  getCategories: async () => {
    const response = await API.get('products/categories/');
    return response.data;
  },
};

export default productService;
