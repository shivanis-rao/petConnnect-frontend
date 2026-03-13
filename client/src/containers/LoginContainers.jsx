import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import useAuth from '../hooks/useAuth';

const LoginContainer = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, currentUser } = useAuth();


  const handleLogin = async (email, password) => {
    const result = await login({ email, password });
    if (result.success) {
      if (result.user?.role === 'shelter') {
        navigate('/shelter/pets');
      } else if (result.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/browse');
      }
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      isLoading={isLoading}
      error={error}
      onForgotPassword={handleForgotPassword}
      onCreateAccount={handleCreateAccount}
    />
  );
};

export default LoginContainer;