import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import BrowsePetsPage from './pages/BrowsePetsPage';
import Navbar from './components/common/Navbar';
import RegisterPage from './pages/RegisterPage';
import ProfileCompletionPage from './pages/ProfileCompletionPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/browse" element={<BrowsePetsPage />} />
         <Route path="/register" element={<RegisterPage />} />
          <Route path="/complete-profile" element={<ProfileCompletionPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;