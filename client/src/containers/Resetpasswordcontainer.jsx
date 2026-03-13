import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ResetPasswordForm from "../components/Resetpasswordform";
import UserService from "../services/UserService.js";

const ResetPasswordContainer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handleSubmit = async (newPassword) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await UserService.resetPassword(token, newPassword);
      if (result.success) {
        // Auto login — save session
        UserService.saveSession(result.data);
        localStorage.setItem('auth_event', JSON.stringify({
        type: 'LOGIN',
        user: result.data.user,
        timestamp: Date.now()
        
      }));
      setSuccess(true);
      setTimeout(() => {
        window.close(); // close the reset tab
      }, 3000);
        // // Redirect based on role
        // if (result.data.user?.role === 'shelter') {
        //   navigate('/shelter/dashboard');
        // } else {
        //   navigate('/');
        // }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Reset failed. Please request a new link.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResetPasswordForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      success={success}   
    />
  );
};

export default ResetPasswordContainer;
