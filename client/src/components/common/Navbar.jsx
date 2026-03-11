import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      
      {/* Logo */}
      <Link to="/" className="text-blue-600 font-bold text-xl">
        PetConnect
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="text-gray-600 hover:text-blue-600 text-sm font-medium"
        >
          Home
        </Link>
        <Link
          to="/browse"
          className="text-gray-600 hover:text-blue-600 text-sm font-medium"
        >
          Browse Pets
        </Link>

        {isAuthenticated && (
          <Link
            to="/my-applications"
            className="text-gray-600 hover:text-blue-600 text-sm font-medium"
          >
            My Applications
          </Link>
        )}

        {isAuthenticated && currentUser?.role === 'shelter' && (
          <Link
            to="/shelter/dashboard"
            className="text-gray-600 hover:text-blue-600 text-sm font-medium"
          >
            Dashboard
          </Link>
        )}
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        {!isAuthenticated ? (
          <>
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-blue-600 font-medium"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Register
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Hi, {currentUser?.name?.split(' ')[0]}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>

    </nav>
  );
};

export default Navbar;