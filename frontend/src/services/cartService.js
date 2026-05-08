import API from './api';

const cartService = {
  getCart: async () => {
    const response = await API.get('cart/');
    return response.data;
  },

  addItem: async (planteId, quantite = 1) => {
    const response = await API.post('cart/add_item/', { plante_id: planteId, quantite });
    return response.data;
  },

  updateQuantity: async (planteId, quantite) => {
    const response = await API.post('cart/update_quantity/', { plante_id: planteId, quantite });
    return response.data;
  },

  removeItem: async (planteId) => {
    const response = await API.post('cart/remove_item/', { plante_id: planteId });
    return response.data;
  },

  checkout: async (methode) => {
    const response = await API.post('cart/checkout/', { methode });
    return response.data;
  }
};

export default cartService;
