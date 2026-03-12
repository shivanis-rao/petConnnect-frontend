import ApiService from './Apiservices';

const UserService = {
  login: async (payload) => {
    const response = await ApiService.post('/users/login', payload);
    return response.data;
  },

  register: async (payload) => {
    const response = await ApiService.post('/users/register', payload);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await ApiService.post('/users/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await ApiService.post('/users/reset-password', { token, newPassword });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  saveSession: (data) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },
};

export default UserService;