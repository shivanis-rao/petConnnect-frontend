import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import useAuth from '../hooks/useAuth';

const LoginContainer = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, currentUser, clearError } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (currentUser?.role === 'shelter') {
        navigate('/shelter/dashboard');
      } else if (currentUser?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/browse');              // ← adopter
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleLogin = async (email, password) => {
    const result = await login({ email, password });
    if (result.success) {
      if (result.user?.role === 'shelter') {
        navigate('/shelter/dashboard');
      } else if (result.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/browse');              // ← adopter
      }
    }
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      isLoading={isLoading}
      error={error}
      onForgotPassword={() => navigate('/forgot-password')}
      onCreateAccount={() => navigate('/register')}
    />
  );
};

export default LoginContainer;