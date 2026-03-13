import { AuthContext, useAuthState } from './useAuth.js';

export const AuthProvider = ({ children }) => {
  const value = useAuthState();

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};