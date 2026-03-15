import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-100 rounded-xl p-1.5 flex items-center gap-0.5">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 text-blue-500"
          >
            <ellipse cx="7" cy="6" rx="1.2" ry="1.6" />
            <ellipse cx="4.5" cy="7.5" rx="1" ry="1.4" />
            <ellipse cx="9.5" cy="7.5" rx="1" ry="1.4" />
            <path d="M7 10 C4 10 3 13 4.5 14.5 C5.5 15.5 8.5 15.5 9.5 14.5 C11 13 10 10 7 10Z" />
            <ellipse cx="17" cy="4" rx="1.2" ry="1.6" />
            <ellipse cx="14.5" cy="5.5" rx="1" ry="1.4" />
            <ellipse cx="19.5" cy="5.5" rx="1" ry="1.4" />
            <path d="M17 8 C14 8 13 11 14.5 12.5 C15.5 13.5 18.5 13.5 19.5 12.5 C21 11 20 8 17 8Z" />
          </svg>
        </div>
        <Link to="/" className="text-blue-600 font-bold text-xl">
          PetConnect
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="text-gray-600 hover:text-blue-600 text-sm font-medium"
        >
          Home
        </Link>

        {/*Adopter Links*/}
        {currentUser?.role === "adopter" && (
          <>
            <Link
              to="/browse"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium"
            >
              Browse Pets
            </Link>
            <Link
              to="/my-applications"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium"
            >
              My Applications
            </Link>
          </>
        )}

        {/*Shelter Links */}
        {isAuthenticated && currentUser?.role === "shelter" && (
          <Link
            to="/shelter/pets"
            className="text-gray-600 hover:text-blue-600 text-sm font-medium"
          >
            Dashboard
          </Link>
        )}

        {/* ── ADMIN LINKS ────────────────────────────────────────── */}
        {currentUser?.role === "admin" && (
          <Link
            to="/admin/dashboard"
            className="text-gray-600 hover:text-blue-600 text-sm font-medium"
          >
            Admin Panel
          </Link>
        )}
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        {!isAuthenticated ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-gray-600 hover:text-blue-600 font-medium"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Register
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Hi, {currentUser?.name?.split(" ")[0]}
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
