import { useNavigate, NavLink } from "react-router-dom";
import {
  Heart,
  List,
  MessageSquare,
  BarChart2,
  LogOut,
  Plus,
} from "lucide-react";
import useAuth from "../../hooks/AuthContext";
const navItems = [
  { label: "Adoption Requests", icon: Heart, to: "/shelter/adoptions" },
  { label: "Your Pet Listings", icon: List, to: "/shelter/pets" },
  { label: "Messages", icon: MessageSquare, to: "/shelter/messages" },
  { label: "Analytics", icon: BarChart2, to: "/shelter/analytics" },
];

export default function ShelterSidebar({ pendingCount = 0 }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col justify-between py-6 shrink-0">
      <div>
        {/* Add Pet Button */}
        <div className="px-4 mb-6">
          <button
            onClick={() => navigate("/shelter/pets/add")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
          >
            <Plus size={16} />
            Add Pet
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col">
          {navItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-sm font-medium border-l-[3px] transition-all
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-700"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Icon */}
                  <span
                    className={`p-1 rounded-md ${
                      isActive ? "bg-blue-100 text-blue-600" : "text-gray-400"
                    }`}
                  >
                    <Icon size={15} />
                  </span>

                  {/* Label */}
                  <span>{label}</span>

                  {/* 🔴 Pending badge — only on Adoption Requests */}
                  {label === "Adoption Requests" && pendingCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-5 py-3 text-red-500 hover:bg-red-50 text-sm font-medium transition-colors"
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  );
}
