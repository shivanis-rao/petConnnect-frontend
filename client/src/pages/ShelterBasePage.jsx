import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const organizationTypes = [
  {
    id: "ngo",
    label: "NGO",
    description: "Registered non-profit organization",
    icon: "🏛️",
  },
  {
    id: "government",
    label: "Government Shelter",
    description: "State-run facility",
    icon: "🏢",
  },
  {
    id: "rescuer",
    label: "Rescuers",
    description: "Individual independent rescuers",
    icon: "🤝",
  },
];

export default function ShelterBasePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState(location.state?.name || "");
  const [selectedType, setSelectedType] = useState(location.state?.type || "");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!name.trim() || !selectedType) {
      setError("Please enter organization name and select a type.");
      setTimeout(() => setError(""), 2000);
      return;
    }

    if (selectedType === "ngo") {
      navigate("/shelter/ngo-register", {
        state: { name, type: selectedType },
      });
    } else if (selectedType === "government") {
      navigate("/shelter/government-register", {
        state: { name, type: selectedType },
      });
    } else if (selectedType === "rescuer") {
      navigate("/shelter/rescuer-register", {
        state: { name, type: selectedType },
      });
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #f0f7f4 0%, #e8f4fd 50%, #f0f0fa 100%)",
      }}
    >
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-lg shadow-sm">
            🐾
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">
            PetConnect
          </span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex justify-center px-4 pt-12 pb-6">
        <div className="text-center max-w-lg">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            🐾 Join Our Network
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-3">
            Complete Shelter
            <span className="text-blue-600"> Registration</span>
          </h1>
          <p className="text-gray-500 text-base">
            Help more animals find loving homes by joining our network of
            trusted shelters.
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="flex justify-center px-4 pb-16">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg border border-gray-100">
          {/* Organization Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Organization Name
            </label>
            <input
              type="text"
              placeholder="Enter your organization's legal name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder-gray-400"
            />
          </div>

          {/* Organization Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Organization Type
            </label>
            <div className="flex flex-col gap-3">
              {organizationTypes.map((org) => (
                <div
                  key={org.id}
                  onClick={() => setSelectedType(org.id)}
                  className={`flex items-center gap-4 border-2 rounded-2xl px-4 py-3.5 cursor-pointer transition-all duration-200 ${
                    selectedType === org.id
                      ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                      selectedType === org.id ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    {org.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {org.label}
                    </p>
                    <p className="text-xs text-gray-500">{org.description}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedType === org.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedType === org.id && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-2.5 rounded-xl mb-4">
              ⚠️ {error}
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
          >
            Continue <span>→</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-8 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-500">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-lg shadow-sm">
                🐾
              </div>
              <span className="font-bold text-lg text-gray-900 tracking-tight">
                PetConnect
              </span>
            </div>
            <p className="text-xs max-w-xs leading-relaxed">
              Connecting loving owners with their perfect companions. Making
              adoption easier since 2026.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-3 uppercase text-xs tracking-wider">
              Support
            </p>
            <div className="flex flex-col gap-1.5">
              <p className="hover:text-blue-600 cursor-pointer transition-colors">
                Contact Support
              </p>
              <p className="hover:text-blue-600 cursor-pointer transition-colors">
                Privacy Policy
              </p>
              <p className="hover:text-blue-600 cursor-pointer transition-colors">
                Terms of Use
              </p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-3 uppercase text-xs tracking-wider">
              Connect
            </p>
            <div className="flex gap-3">
              {["📘", "🐦", "📸"].map((icon, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gray-100 hover:bg-blue-100 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
          PetConnect © 2026. All rights reserved. · Version 1.0.4
        </div>
      </footer>
    </div>
  );
}
