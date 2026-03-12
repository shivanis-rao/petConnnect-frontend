import axios from "axios";


const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';


const api = axios.create({
 baseURL: BASE_URL,
 headers: {
   'Content-Type': 'application/json',
 },
});


// REQUEST interceptor — attach accessToken to every request
api.interceptors.request.use((config) => {
 const token = localStorage.getItem('accessToken');
 if (token) {
   config.headers.Authorization = `Bearer ${token}`;
 }
 return config;
});


// RESPONSE interceptor — handle 401 (token expired)
let isRefreshing = false;
let failedQueue = [];


const processQueue = (error, token = null) => {
 failedQueue.forEach((prom) => {
   if (error) {
     prom.reject(error);
   } else {
     prom.resolve(token);
   }
 });
 failedQueue = [];
};


api.interceptors.response.use(
 (response) => response, // if response is fine just return it


 async (error) => {
   const originalRequest = error.config;


   // If 401 and we haven't already retried this request
   if (error.response?.status === 401 && !originalRequest._retry) {


     if (isRefreshing) {
       // If already refreshing, queue this request
       return new Promise((resolve, reject) => {
         failedQueue.push({ resolve, reject });
       })
         .then((token) => {
           originalRequest.headers.Authorization = `Bearer ${token}`;
           return api(originalRequest);
         })
         .catch((err) => Promise.reject(err));
     }


     originalRequest._retry = true;
     isRefreshing = true;


     const refreshToken = localStorage.getItem('refreshToken');


     if (!refreshToken) {
       // No refresh token — force logout
       localStorage.removeItem('accessToken');
       localStorage.removeItem('refreshToken');
       localStorage.removeItem('user');
       window.location.href = '/login';
       return Promise.reject(error);
     }


     try {
       // Call your refresh token endpoint
       const response = await axios.post(`${BASE_URL}/users/refresh-token`, {
         refreshToken,
       });


     const newAccessToken = response.data.data.accessToken;
       localStorage.setItem('accessToken', newAccessToken);


       // Retry all queued requests with new token
       processQueue(null, newAccessToken);


       // Retry the original failed request
       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
       return api(originalRequest);


     } catch (refreshError) {
       // Refresh token also expired — force logout
       processQueue(refreshError, null);
       localStorage.removeItem('accessToken');
       localStorage.removeItem('refreshToken');
       localStorage.removeItem('user');
       window.location.href = '/login';
       return Promise.reject(refreshError);
     } finally {
       isRefreshing = false;
     }
   }


   return Promise.reject(error);
 }
);


const get = (url) => api.get(url);
const post = (url, data) => api.post(url, data);
const put = (url, data,config={}) => api.put(url, data,config);
const del = (url) => api.delete(url);


export default { get, post, put, del };