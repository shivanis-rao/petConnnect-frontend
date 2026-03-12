import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import BrowsePetsPage from './pages/BrowsePetsPage';
import Navbar from './components/common/Navbar';
import ResetPasswordPage from './pages/Resetpasswordpage';
import ForgotPasswordPage from './pages/Forgotpasswordpage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/browse" element={<BrowsePetsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;