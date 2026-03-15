import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/Apiservices";

const registrationTypes = ["Society", "Trust", "Section 8 Company"];

export default function NgoRegistration() {
  const location = useLocation();
  const { name, type } = location.state || {};
  const navigate = useNavigate();

  const [regType, setRegType] = useState("Society");
  const [regCertificate, setRegCertificate] = useState(null);
  const [additionalDocs, setAdditionalDocs] = useState([]);
  const [regNumber, setRegNumber] = useState("");
  const [yearOfReg, setYearOfReg] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddDoc = () => {
    setAdditionalDocs([...additionalDocs, null]);
  };

  const handleAdditionalDocChange = (index, file) => {
    const updated = [...additionalDocs];
    updated[index] = file;
    setAdditionalDocs(updated);
  };

  const handleSubmit = async () => {
    if (
      !regType ||
      !regCertificate ||
      !regNumber ||
      !yearOfReg ||
      !state ||
      !city ||
      !pincode ||
      !country ||
      !email ||
      !phone
    ) {
      setError("All fields are required.");
      setTimeout(() => setError(""), 2000);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("name", name);
      formData.append("type", type);
      formData.append(
        "registration_type",
        regType.toLocaleLowerCase().replace(/\s+/g, ""),
      );
      formData.append("registration_number", regNumber);
      formData.append("year_of_registration", yearOfReg);
      formData.append("state", state);
      formData.append("city", city);
      formData.append("zipcode", pincode);
      formData.append("country", country);
      formData.append("contact_email", email);
      formData.append("contact_phone", phone);
      formData.append("registration_certificate", regCertificate);
      additionalDocs.forEach((doc) => {
        if (doc) formData.append("additional_document", doc);
      });

      await api.post("/shelters/ngo_register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/shelter/waiting-area");
    } catch (err) {
  if (err.response?.status === 409) {
    setError("You already have a shelter registered.");
  } else {
    setError("Something went wrong. Please try again.");
  }
  setTimeout(() => setError(""), 3000);
} finally {
  setLoading(false);
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
      
       
      {/* Content */}
      <div className="flex justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          {/* Back */}
          <button
            onClick={() =>
              navigate("/shelter-register", { state: { name, type } })
            }
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 mb-6 hover:scale-105"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
            NGO Registration Form
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Help more animals find loving homes by providing your official
            details.
          </p>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            {/* Registration Type */}
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Registration Type
            </p>
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1 mb-6">
              {registrationTypes.map((regTypeName) => (
                <button
                  key={regTypeName}
                  onClick={() => setRegType(regTypeName)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    regType === regTypeName
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {regTypeName}
                </button>
              ))}
            </div>

            {/* Registration Certificate */}
            <div className="flex items-center justify-between border-2 border-dashed border-gray-200 rounded-2xl px-5 py-4 mb-5 hover:border-blue-300 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                  📄
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Registration certificate
                  </p>
                  <p className="text-xs text-gray-400">
                    Official PDF or Scanned Copy (Max 5MB)
                  </p>
                </div>
              </div>
              <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer transition-all">
                {regCertificate ? "✓ Chosen" : "Choose file"}
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setRegCertificate(e.target.files[0])}
                />
              </label>
            </div>

            {/* Registration Number + Year */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Registration Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. NGO/12345/2023"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Year of Registration
                </label>
                <input
                  type="number"
                  placeholder="YYYY"
                  value={yearOfReg}
                  onChange={(e) => setYearOfReg(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {/* Additional Documents */}
            {additionalDocs.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-2 border-dashed border-gray-200 rounded-2xl px-5 py-4 mb-3 hover:border-blue-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    📎
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Additional Document {index + 1}
                    </p>
                    <p className="text-xs text-gray-400">PDF, JPG or PNG</p>
                  </div>
                </div>
                <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer transition-all">
                  {doc ? "✓ Chosen" : "Choose file"}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleAdditionalDocChange(index, e.target.files[0])
                    }
                  />
                </label>
              </div>
            ))}

            <button
              onClick={handleAddDoc}
              className="flex items-center gap-1.5 text-blue-600 text-sm font-semibold mb-6 hover:underline"
            >
              + Add another Document
            </button>

            {/* Divider */}
            <div className="border-t border-gray-100 my-6" />

            {/* Address */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-500">📍</span>
              <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                Address
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  placeholder="Select State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Pincode
                </label>
                <input
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-6" />

            {/* Contact Details */}
            <p className="text-sm font-bold text-gray-800 mb-4">
              Contact Details
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Official Email
                </label>
                <input
                  type="email"
                  placeholder="contact@ngo.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Official Phone
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-400 text-center mb-5">
              By submitting, you agree to our Terms of Service for NGO partners.
            </p>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-2.5 rounded-xl mb-4">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-60"
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
        </div>
      </div>

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
}
