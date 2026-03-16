import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BrowsePetsPage from "./pages/BrowsePetsPage";
import PetDetailPage from "./pages/PetDetailPage";
import ResetPasswordPage from "./pages/Resetpasswordpage";
import ForgotPasswordPage from "./pages/Forgotpasswordpage";
import ProfileCompletionPage from "./pages/ProfileCompletionPage";
import AddPetPage from "./pages/AddPetPage";
import HomePage from "./pages/HomePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ShelterBasePage from "./pages/ShelterBasePage";
import NgoRegistration from "./pages/NgoRegistration";
import WaitingPage from "./pages/WaitingPage";
import NgoDashboard from "./pages/NGODashboard";
import EditPetPage from "./pages/EditPetPage";
import AdoptionApplicationPage from "./pages/AdoptionApplicationPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import ApplicationDetailsPage from "./pages/ApplicationDetailsPage";
import AdoptionRequests from "./pages/ShelterAdoptionRequests.jsx";
import ShelterApplicationDetailPage from "./pages/ShelterApplicationDetailPage";
import GovernmentRegistrationPage from "./pages/GovernmentRegistrationPage";
import RescuerRegistrationPage from "./pages/RescuerRegistrationPage";
import MessagesPage from "./pages/MessagesPage";
import Footer from "./components/common/Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarOn = [
    "/",
    "/shelter-register",
    "/shelter/ngo-register",
    "/shelter/waiting-area",
    "/shelter/government-register",
    "/shelter/rescuer-register",
  ];

  const showNavbar = !hideNavbarOn.includes(location.pathname);

  const hideFooterOn = [
    "/",
    "/shelter-register",
    "/shelter/ngo-register",
    "/shelter/waiting-area",
    "/shelter/government-register",
    "/shelter/rescuer-register",
    "/shelter/adoptions/:applicationId",
    "/shelter/adoptions",
  ];
  const showFooter = !hideFooterOn.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
      {showFooter && <Footer />}
    </>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pets/:id" element={<PetDetailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* ANY LOGGED IN USER */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/complete-profile"
              element={<ProfileCompletionPage />}
            />
          </Route>

          {/* ADOPTER ONLY */}
          <Route element={<ProtectedRoute roles={["adopter"]} />}>
            <Route path="/browse" element={<BrowsePetsPage />} />
            <Route path="/my-applications" element={<MyApplicationsPage />} />
            <Route
              path="/pets/:id/apply"
              element={<AdoptionApplicationPage />}
            />
            <Route
              path="/my-applications/:applicationId"
              element={<ApplicationDetailsPage />}
            />
          </Route>

          {/* SHELTER + ADMIN */}
          <Route element={<ProtectedRoute roles={["shelter", "admin"]} />}>
            <Route path="/shelter/pets" element={<NgoDashboard />} />
            <Route path="/shelter/adoptions" element={<AdoptionRequests />} />
            <Route
              path="/shelter/adoptions/:applicationId"
              element={<ShelterApplicationDetailPage />}
            />
            <Route path="/shelter/pets/add" element={<AddPetPage />} />
            <Route path="/shelter/pets/:id/add" element={<AddPetPage />} />
            <Route path="/shelter/pets/:id/edit" element={<EditPetPage />} />
            <Route path="/shelter-register" element={<ShelterBasePage />} />
            <Route path="/shelter/ngo-register" element={<NgoRegistration />} />
            <Route
              path="/shelter/government-register"
              element={<GovernmentRegistrationPage />}
            />
            <Route
              path="/shelter/rescuer-register"
              element={<RescuerRegistrationPage />}
            />
            <Route path="/shelter/waiting-area" element={<WaitingPage />} />
            <Route path="/shelter/messages" element={<MessagesPage />} />
          </Route>

          {/* ADMIN ONLY */}
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route
              path="/admin/dashboard"
              element={<div>Admin Dashboard</div>}
            />
            <Route path="/admin/users" element={<div>Manage Users</div>} />
            <Route
              path="/admin/shelters"
              element={<div>Manage Shelters</div>}
            />
          </Route>

          {/* CATCH ALL */}
          <Route path="*" element={<Navigate to="/unauthorized" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRoutes;
