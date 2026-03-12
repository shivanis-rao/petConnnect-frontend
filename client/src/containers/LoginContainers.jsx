import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import useAuth from "../hooks/useAuth";

const LoginContainer = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, currentUser } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect based on role
      if (currentUser?.role === "shelter") {
        navigate("/shelter/dashboard");
      } else {
        navigate("/browse");
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleLogin = async (email, password) => {
    const result = await login({ email, password });
    if (result.success) {
      // Redirect based on role after login
      if (result.user?.role === "shelter") {
        navigate("/shelter/dashboard");
      } else {
        navigate("/");
      }
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleCreateAccount = () => {
    navigate("/register");
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
