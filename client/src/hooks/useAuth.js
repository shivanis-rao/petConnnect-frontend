import { useState } from "react";
import UserService from "../services/UserService";

const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await UserService.login(payload);
      // result = { success, message, data: { accessToken, refreshToken, user } }
      if (result.success) {
        UserService.saveSession(result.data);
        setIsLoading(false);
        return { success: true, user: result.data.user };
      } else {
        setError(result.message || "Login failed");
        setIsLoading(false);
        return { success: false };
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      setError(message);
      setIsLoading(false);
      return { success: false };
    }
  };

  const logout = () => {
    UserService.logout();
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    login,
    logout,
    clearError,
    isAuthenticated: UserService.isAuthenticated(),
    currentUser: UserService.getCurrentUser(),
  };
};

export default useAuth;
