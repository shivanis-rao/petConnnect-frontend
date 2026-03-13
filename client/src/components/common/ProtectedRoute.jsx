import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * <Route element={<ProtectedRoute />}>
 *   any logged-in user
 *
 * <Route element={<ProtectedRoute roles={['shelter','admin']} />}>
 *   shelter or admin only
 */
const ProtectedRoute = ({ roles }) => {
  const { currentUser, isBootstrapping } = useAuth();
  const location = useLocation();

  // Wait for localStorage rehydration before deciding
  if (isBootstrapping) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  // Not logged in → send to login, remember where they came from
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role → send to 403 page
  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;