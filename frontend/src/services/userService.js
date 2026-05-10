import API from './api';

const userService = {
  getProfile: async () => {
    const response = await API.get('users/me/');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await API.put('users/me/', data);
    return response.data;
  },
  getAllUsers: async () => {
    const response = await API.get('users/');
    return response.data;
  }
};

export default userService;
