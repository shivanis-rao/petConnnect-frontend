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
import ShelterBasePage from './pages/ShelterBasePage';
import NgoRegistration from './pages/NgoRegistration';
import WaitingPage from './pages/WaitingPage';
import NgoDashboard from './pages/NGODashboard';
import EditPetPage from './pages/EditPetPage'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Navigate to="/browse" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/browse" element={<BrowsePetsPage />} />
        <Route path="/pets/:id" element={<PetDetailPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* ANY LOGGED IN USER */}
        <Route element={<ProtectedRoute />}>
          <Route path="/complete-profile" element={<ProfileCompletionPage />} />
        </Route>

        {/* ADOPTER ONLY */}
        <Route element={<ProtectedRoute roles={['adopter']} />}>
          <Route path="/my-adoptions" element={<div>My Adoptions</div>} />
        </Route>

        {/* SHELTER + ADMIN */}
        <Route element={<ProtectedRoute roles={['shelter', 'admin']} />}>
          <Route path="/shelter/pets" element={<NgoDashboard />} />
          <Route path="/shelter/pets/add" element={<AddPetPage />} />
          <Route path="/shelter/pets/:id/edit" element={<AddPetPage />} />
          <Route path="/shelter-register" element={<ShelterBasePage />} />
          <Route path="/shelter/ngo-register" element={<NgoRegistration />} />
          <Route path="/shelter/waiting-area" element={<WaitingPage />} />
        </Route>

        {/* ADMIN ONLY */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
          <Route path="/admin/users" element={<div>Manage Users</div>} />
          <Route path="/admin/shelters" element={<div>Manage Shelters</div>} />
        </Route>

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/browse" replace />} />


      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
