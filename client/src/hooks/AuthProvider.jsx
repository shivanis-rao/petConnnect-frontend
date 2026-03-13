import { useState } from 'react';
import { AuthContext } from './AuthContext';
import UserService from '../services/UserService';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(UserService.getCurrentUser());

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    UserService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};