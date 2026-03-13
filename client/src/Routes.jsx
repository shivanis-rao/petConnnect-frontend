import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import BrowsePetsPage from './pages/BrowsePetsPage';
import PetDetailPage from './pages/PetDetailPage';
import Navbar from './components/common/Navbar';
import ResetPasswordPage from './pages/Resetpasswordpage';
import ForgotPasswordPage from './pages/Forgotpasswordpage';
import RegisterPage from './pages/RegisterPage';
import ProfileCompletionPage from './pages/ProfileCompletionPage';
import AddPetPage from './pages/AddPetPage'
import HomePage from './pages/HomePage';
import { useLocation } from 'react-router-dom';


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  if (!token) return <Navigate to="/login" />;
  return children;
};

const RoleRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) return <Navigate to="/login" />;
  if (user?.role !== allowedRole) return <Navigate to="/" />;
  return children;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarOn = ["/"];
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
          {/* No Navbar */}
          <Route path="/" element={<HomePage />} />
          

          {/* With Navbar */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/complete-profile" element={<ProfileCompletionPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/browse" element={<BrowsePetsPage />} />
          <Route path="/pets/:id" element={<PetDetailPage />} />
           {/* Enable when Adoption Application is ready */}
//         {/* <Route path="/pets/:id/apply" element={
//           <PrivateRoute>
//             <AdoptionApplicationPage />
//           </PrivateRoute>
//           } /> */}
          <Route path="/shelter/pets/add" element={<AddPetPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

// const AppRoutes = () => {
//   return (
//     <BrowserRouter>
//     <Routes>
//     <Route path="/" element={<HomePage />} />
//     </Routes>
//       <Navbar />
//       <Routes>
        
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//         <Route path="/reset-password" element={<ResetPasswordPage />} />
//         <Route path="/complete-profile" element={<ProfileCompletionPage />} />
//         <Route path="/browse" element={<BrowsePetsPage />} />
//         <Route path="/pets/:id" element={<PetDetailPage />} />
//         {/* Enable when Adoption Application is ready */}
//         {/* <Route path="/pets/:id/apply" element={
//           <PrivateRoute>
//             <AdoptionApplicationPage />
//           </PrivateRoute>
//           } /> */}

//         <Route path="/shelter/pets/add" element={<AddPetPage />} />
       
//       </Routes>
//     </BrowserRouter>
//   );
// };

export default AppRoutes;