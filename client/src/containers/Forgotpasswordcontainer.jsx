import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPasswordForm from "../components/Forgotpasswordform";
import UserService from "../services/UserService";

const ForgotPasswordContainer = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      await UserService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ForgotPasswordForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      success={success}
      onBackToLogin={() => navigate("/login")}
    />
  );
};

export default ForgotPasswordContainer;
