import { useState } from "react";
import { AuthContext } from "./AuthContext";
import UserService from "../services/UserService";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    () => UserService.getCurrentUser(), // lazy init — reads localStorage once
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await UserService.login(payload); // ✅ calls API
      if (result.success) {
        UserService.saveSession(result.data); // ✅ saves to localStorage
        setCurrentUser(result.data.user); // ✅ updates shared state
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
    setCurrentUser(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser, // ✅ full user object with role
        isAuthenticated: !!currentUser,
        isBootstrapping: false,
        isLoading,
        error,
        clearError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
