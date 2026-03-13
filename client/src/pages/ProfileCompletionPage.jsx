import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserService from "../services/UserService";

export default function ProfileCompletionPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    location: "",
    living_situation: "",
    preferred_species: "dog",
    pet_experience_years: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSpecies = (species) => {
    setFormData({ ...formData, preferred_species: species });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = UserService.getAccessToken();
      const userId = localStorage.getItem("userId");

      console.log("Token in profile:", token);
      console.log("UserId in profile:", userId);

      if (!token || token === "null") {
        setError("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/users/${userId}/profile`,
        { ...formData, profile_completed: true },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      navigate("/browse");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/browse");
  };

  return (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <div className="flex-1 max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-start w-full">

      {/* Left Panel — hidden on mobile */}
      <div className="hidden md:block w-[420px] flex-shrink-0 rounded-2xl overflow-hidden relative h-[520px]">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-700/60 to-gray-900/80 z-10" />
        <img
          src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&auto=format&fit=crop"
          alt="Pets" className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-white text-xs font-semibold uppercase tracking-wide">Step 2: Profile Completion</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-3 leading-tight">Help us find your perfect match.</h2>
            <p className="text-white/75 text-sm leading-relaxed mb-8">
              Refining your profile helps us connect you with your future companion faster.
            </p>
            <div className="space-y-3">
              {[
                { num: 1, label: "Account Created", done: true },
                { num: 2, label: "Complete Profile", active: true },
                { num: 3, label: "Start Adopting", done: false },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                    ${s.done || s.active ? "bg-cyan-500 text-white" : "bg-white/20 text-white/50"}`}>
                    {s.num}
                  </div>
                  <span className={`text-sm font-medium
                    ${s.active ? "text-white" : s.done ? "text-white/80" : "text-white/40"}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — full width on mobile */}
      <div className="flex-1 w-full bg-white rounded-2xl shadow-sm p-6 md:p-10">

        {/* Mobile step indicator */}
        <div className="flex items-center gap-2 mb-4 md:hidden">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wide">Step 2: Profile Completion</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Complete Your Profile</h1>
        <p className="text-gray-500 text-sm mb-7">Provide specific details to improve your matching results.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange}
                placeholder="Bengaluru-560058"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Living Situation</label>
              <input type="text" name="living_situation" value={formData.living_situation} onChange={handleChange}
                placeholder="e.g. Apartment with balcony"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Preference</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "dog", icon: "🐾", label: "Dog" },
                { value: "cat", icon: "🐱", label: "Cat" },
              ].map((opt) => (
                <button key={opt.value} type="button" onClick={() => handleSpecies(opt.value)}
                  className={`border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition
                    ${formData.preferred_species === opt.value ? "border-cyan-500 bg-cyan-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className="relative">
                    <span className="text-3xl">{opt.icon}</span>
                    {formData.preferred_species === opt.value && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    )}
                  </div>
                  <span className={`text-sm font-semibold ${formData.preferred_species === opt.value ? "text-cyan-600" : "text-gray-600"}`}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
              Experience With Pets (Years)
            </label>
            <input type="number" name="pet_experience_years" value={formData.pet_experience_years}
              onChange={handleChange} placeholder="0" min="0" max="50"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleSkip}
              className="px-6 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition text-sm"
            >
              Skip for now
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Saving..." : "Complete Profile ✓"}
            </button>
          </div>
        </form>
      </div>
    </div>

    {/* Footer */}
    <footer className="bg-white border-t border-gray-100 px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-cyan-500">🐾</span>
        <span className="text-cyan-500 font-semibold text-sm">PetConnect</span>
      </div>
      <span className="text-gray-400 text-xs text-center">© 2026 PetConnect Adoption Services. All rights reserved.</span>
      <div className="flex gap-4">
        <a href="#" className="text-gray-400 text-xs hover:text-gray-600">Privacy Policy</a>
        <a href="#" className="text-gray-400 text-xs hover:text-gray-600">Terms of Service</a>
      </div>
    </footer>
  </div>
);
}
