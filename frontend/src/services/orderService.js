import API from './api';

const orderService = {
  // Place a new order with all items from cart
  placeOrder: async (cartItems) => {
    const data = {
      lignes: cartItems.map(item => ({
        plante: item.planteId,
        quantite: item.quantity,
        prix: item.price
      }))
    };
    const response = await API.post('orders/', data);
    return response.data;
  },

  // Fetch order history
  getHistory: async () => {
    const response = await API.get('orders/');
    return response.data;
  }
};

export default orderService;
