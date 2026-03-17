import ApiService from "./Apiservices";

const UserService = {
  // AUTH
  login: async (payload) => {
    const response = await ApiService.post("/users/login", payload);
    return response.data;
  },

  register: async (payload) => {
    const response = await ApiService.post("/users/register", payload);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  // SESSION
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  saveSession: (data) => {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },

  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },

  // PASSWORD RESET
  forgotPassword: async (email) => {
    const response = await ApiService.post("/users/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await ApiService.post("/users/reset-password", data);
    return response.data;
  },

  sendOtp: async (email) => {
    const response = await ApiService.post("/users/send-otp", { email });
    return response.data;
  },

  verifyOtp: async (email, otp) => {
    const response = await ApiService.post("/users/verify-otp", { email, otp });
    return response.data;
  },

  // PROFILE
  completeProfile: async (userId, profileData) => {
    const response = await ApiService.put(
      `/users/${userId}/profile`,
      profileData,
    );
    return response.data;
  },
};

export default UserService;
