import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BrowsePetsPage from './pages/BrowsePetsPage';
import PetDetailPage from './pages/PetDetailPage';
import ResetPasswordPage from './pages/Resetpasswordpage';
import ForgotPasswordPage from './pages/Forgotpasswordpage';
import ProfileCompletionPage from './pages/ProfileCompletionPage';
import AddPetPage from './pages/AddPetPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

const AppRoutes = () => {  
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        {/*Public (no login needed) */}
        <Route path="/" element={<Navigate to="/browse" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pets/:id" element={<PetDetailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Any logged-in user*/}
        <Route element={<ProtectedRoute />}>
          <Route path="/complete-profile" element={<ProfileCompletionPage />} />
        </Route>

        {/* Adopter only */}
        <Route element={<ProtectedRoute roles={['adopter']} />}>
          <Route path="/browse" element={<BrowsePetsPage />} />
          <Route path="/my-applications" element={<div>My Adoptions</div>} />
        </Route>

        {/*  Shelter + Admin only */}
        <Route element={<ProtectedRoute roles={['shelter', 'admin']} />}>
          <Route path="/shelter/pets/add"      element={<AddPetPage />} />
          <Route path="/shelter/pets/:id/edit" element={<AddPetPage />} />
          <Route path="/shelter/dashboard"     element={<div>Shelter Dashboard</div>} />
        </Route>

        {/* Admin only */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
          <Route path="/admin/users"     element={<div>Manage Users</div>} />
          <Route path="/admin/shelters"  element={<div>Manage Shelters</div>} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/unauthorized" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;