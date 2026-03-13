import { useState, useEffect, createContext, useContext } from 'react';
import UserService from '../services/UserService';

export const AuthContext = createContext(null);

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading,   setIsLoading]   = useState(false);
  const [error,       setError]       = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const savedUser = UserService.getCurrentUser();
    if (savedUser) setCurrentUser(savedUser);
    setIsBootstrapping(false);
  }, []);

  const login = async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await UserService.login(payload);
      if (result.success) {
        UserService.saveSession(result.data);
        setCurrentUser(result.data.user);
        setIsLoading(false);
        return { success: true, user: result.data.user };
      } else {
        setError(result.message || 'Login failed');
        setIsLoading(false);
        return { success: false };
      }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Login failed.';
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

  const isAdmin   = currentUser?.role === 'admin';
  const isShelter = currentUser?.role === 'shelter';
  const isAdopter = currentUser?.role === 'adopter';
  const hasRole   = (...roles) =>
    Boolean(currentUser) && roles.includes(currentUser.role);

  return {
    currentUser,
    isLoading,
    isBootstrapping,
    error,
    isAuthenticated: Boolean(currentUser),
    isAdmin,
    isShelter,
    isAdopter,
    hasRole,
    login,
    logout,
    clearError,
  };
};

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default useAuth;