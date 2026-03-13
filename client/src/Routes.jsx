import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import BrowsePetsPage from "./pages/BrowsePetsPage";
import PetDetailPage from "./pages/PetDetailPage";
import Navbar from "./components/common/Navbar";
import ResetPasswordPage from "./pages/Resetpasswordpage";
import ForgotPasswordPage from "./pages/Forgotpasswordpage";
import RegisterPage from "./pages/RegisterPage";
import ProfileCompletionPage from "./pages/ProfileCompletionPage";
import AddPetPage from "./pages/AddPetPage";
import ShelterBasePage from "./pages/ShelterBasePage";
import NgoRegistration from "./pages/NgoRegistration";
import WaitingPage from "./pages/WaitingPage";
import HomePage from "./pages/HomePage";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarOn = [
    "/",
    "/shelter-register",
    "/shelter/ngo-register",
    "/shelter/waiting-area",
  ];
  const showNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* No Navbar*/}
          <Route path="/" element={<HomePage />} />
          <Route path="/shelter-register" element={<ShelterBasePage />} />
          <Route path="/shelter/ngo-register" element={<NgoRegistration />} />
          <Route path="/shelter/waiting-area" element={<WaitingPage />} />
          {/* With Navbar */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/complete-profile" element={<ProfileCompletionPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/browse" element={<BrowsePetsPage />} />
          <Route path="/pets/:id" element={<PetDetailPage />} />
          {/* Enable when Adoption Application is ready */}
          //{" "}
          {/* <Route path="/pets/:id/apply" element={
//           <PrivateRoute>
//             <AdoptionApplicationPage />
//           </PrivateRoute>
//           } /> */}
          <Route path="/shelter/pets/add" element={<AddPetPage />} />
          <Route path="/shelter/pets/add" element={<AddPetPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRoutes;
