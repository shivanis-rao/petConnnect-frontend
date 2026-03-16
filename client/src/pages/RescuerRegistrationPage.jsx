import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/Apiservices";

const RescuerRegistrationPage = () => {
  const location = useLocation();
  const { name, type } = location.state || {};
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [idType, setIdType] = useState("Driver's License");
  const [idNumber, setIdNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [rescueStory, setRescueStory] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ── Validators ──────────────────────────────────────────
  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePhone = (v) => /^\+?[\d\s\-()]{7,15}$/.test(v);
  const validateZip = (v) => /^\d{4,10}$/.test(v);
  const validateIdNumber = (v) => v.trim().length >= 5;

  const validate = () => {
    const e = {};
    if (!validateEmail(email)) e.email = "Enter a valid email address.";
    if (!validatePhone(phone)) e.phone = "Enter a valid phone number.";
    if (!validateIdNumber(idNumber))
      e.idNumber = "ID number must be at least 5 characters.";
    if (!city.trim()) e.city = "City is required.";
    if (!state.trim()) e.state = "State is required.";
    if (!validateZip(zipCode))
      e.zipCode = "Enter a valid zip code (digits only).";
    if (!country.trim()) e.country = "Country is required.";
    if (rescueStory.trim().length < 30)
      e.rescueStory =
        "Please write at least 30 characters about your rescue story.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    try {
      setLoading(true);
      setErrors({});
      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", type);
      formData.append("contact_email", email);
      formData.append("contact_phone", phone);
      formData.append("id_type", idType.toLowerCase().replace(/\s+/g, "_"));
      formData.append("id_number", idNumber);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("zipcode", zipCode);
      formData.append("country", country);
      formData.append("rescue_story", rescueStory);
      await api.post("/shelters/rescuer_register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/shelter/waiting-area");
    } catch (err) {
      setErrors({ api: "Something went wrong. Please try again." });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Helpers ──────────────────────────────────────────────
  const inputClass = (field) =>
    `w-full border rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors ${
      errors[field]
        ? "border-red-400 bg-red-50 focus:border-red-500"
        : "border-gray-200 focus:border-blue-400"
    }`;

  const ErrMsg = ({ field }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1">⚠ {errors[field]}</p>
    ) : null;

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
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {/* Back */}
        <button
          onClick={() =>
            navigate("/shelter-register", { state: { name, type } })
          }
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 mb-6 hover:scale-105"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            Complete Rescuer Registration
          </h1>
          <p className="text-xs text-gray-400 mb-6">
            Complete your profile to start rescuing and find the forever homes.
          </p>

          {/* Section 1: Personal Details */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-400 text-xs">👤</span>
              <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Personal Details
              </h2>
            </div>

            {/* Email + Phone side by side — same as before, but now this is
                the ONLY row in this section, so it fills cleanly */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  placeholder="johnson@petpals.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: "" }));
                  }}
                  className={inputClass("email")}
                />
                <ErrMsg field="email" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <div
                  className={`flex items-center border rounded-lg px-3 py-2 gap-2 ${
                    errors.phone
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <span className="text-gray-400 text-xs">📱</span>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrors((p) => ({ ...p, phone: "" }));
                    }}
                    className="flex-1 text-xs text-gray-700 focus:outline-none bg-transparent"
                  />
                </div>
                <ErrMsg field="phone" />
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mb-6" />

          {/* Section 2: ID Verification */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-400 text-xs">🪪</span>
              <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                ID Verification
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  ID Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-blue-400 bg-white"
                >
                  <option>Driver's License</option>
                  <option>Passport</option>
                  <option>National ID</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  ID Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="XXXX-XXXX-XXXX"
                  value={idNumber}
                  onChange={(e) => {
                    setIdNumber(e.target.value);
                    setErrors((p) => ({ ...p, idNumber: "" }));
                  }}
                  className={inputClass("idNumber")}
                />
                <ErrMsg field="idNumber" />
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mb-6" />

          {/* Section 3: Address — street address removed, 4 fields in one row */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-400 text-xs">📍</span>
              <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Address
              </h2>
            </div>

            {/* City + State + Zip + Country in a single 4-col row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                {
                  label: "City",
                  value: city,
                  setter: setCity,
                  field: "city",
                  placeholder: "Petville",
                },
                {
                  label: "State",
                  value: state,
                  setter: setState,
                  field: "state",
                  placeholder: "CA",
                },
                {
                  label: "Zip Code",
                  value: zipCode,
                  setter: setZipCode,
                  field: "zipCode",
                  placeholder: "90210",
                },
                {
                  label: "Country",
                  value: country,
                  setter: setCountry,
                  field: "country",
                  placeholder: "US",
                },
              ].map(({ label, value, setter, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-xs text-gray-500 mb-1">
                    {label} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => {
                      setter(e.target.value);
                      setErrors((p) => ({ ...p, [field]: "" }));
                    }}
                    className={inputClass(field)}
                  />
                  <ErrMsg field={field} />
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-100 mb-6" />

          {/* Section 4: Rescue Story */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-400 text-xs">📖</span>
              <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Your Rescue Story
              </h2>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Tell us about your experience and motivation (min. 30 characters)
            </p>
            <textarea
              placeholder="Share your passion for animal rescue, species you specialize in, why you joined PetConnect..."
              value={rescueStory}
              onChange={(e) => {
                setRescueStory(e.target.value);
                setErrors((p) => ({ ...p, rescueStory: "" }));
              }}
              className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none resize-none h-24 transition-colors ${
                errors.rescueStory
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 focus:border-blue-400"
              }`}
            />
            <div className="flex justify-between items-center">
              <ErrMsg field="rescueStory" />
              <p
                className={`text-xs ml-auto ${
                  rescueStory.length < 30 ? "text-gray-400" : "text-green-500"
                }`}
              >
                {rescueStory.length} / 30 min
              </p>
            </div>
          </div>

          {/* API Error */}
          {errors.api && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-2.5 rounded-xl mb-4">
              ⚠️ {errors.api}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-medium py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Submitting...
              </>
            ) : (
              <>🛡️ Submit for Admin Verification</>
            )}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-8 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-500">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">
                🐾
              </div>
              <p className="font-bold text-gray-800">PetConnect</p>
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
};

export default RescuerRegistrationPage;
