import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import BrowsePetsPage from './pages/BrowsePetsPage';
import PetDetailPage from './pages/PetDetailPage';
import Navbar from './components/common/Navbar';
import ResetPasswordPage from './pages/Resetpasswordpage';
import ForgotPasswordPage from './pages/Forgotpasswordpage';
import RegisterPage from './pages/RegisterPage';
import ProfileCompletionPage from './pages/ProfileCompletionPage';


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
         <Route path="/register" element={<RegisterPage />} />
        <Route path="/complete-profile" element={<ProfileCompletionPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/browse" element={<BrowsePetsPage />} />
        <Route path="/pets/:id" element={<PetDetailPage />} />
       
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;