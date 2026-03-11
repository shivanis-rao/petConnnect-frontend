import ApiService from './Apiservices';


const UserService = {
 login: async (payload) => {
   const response = await ApiService.post('/users/login', payload);
   return response.data; // { success, message, data: { accessToken, refreshToken, user } }
 },


 register: async (payload) => {
   const response = await ApiService.post('/users', payload);
   return response.data; // { success, message, data: { id, name, email, role } }
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
   // data = response.data.data = { accessToken, refreshToken, user }
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

