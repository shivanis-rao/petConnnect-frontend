import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PetService from "../services/PetService";

const PetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const result = await PetService.getPetById(id);
        setPet(result.data);
      } catch {
        setError("Failed to load pet details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🐾</div>
          <p className="text-gray-500 text-sm">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-4">
            {error || "Pet not found"}
          </p>
          <button
            onClick={() => navigate("/browse")}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/browse")}
          className="text-sm text-gray-500 hover:text-blue-600 mb-6 flex items-center gap-1"
        >
          ← Back to Browse
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* LEFT — Pet Image */}
            <div className="w-full md:w-80 shrink-0">
              <div className="relative">
                <img
                  src={
                    pet.photo_url ||
                    "https://placehold.co/400x400?text=No+Photo"
                  }
                  alt={pet.name}
                  className="w-full h-80 object-cover rounded-2xl"
                />
                {/* Favorite button */}
                <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow text-gray-400 hover:text-red-500 transition-colors">
                  ♥
                </button>
              </div>

              {/* Shelter & Adoption */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Shelter & Adoption
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                    {pet.shelter?.name?.charAt(0) || "S"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {pet.shelter?.name || "Unknown Shelter"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {pet.shelter?.city}, {pet.shelter?.state}
                    </p>
                  </div>
                </div>

                {/* Adoption Fee */}
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Adoption Fee
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pet.adoption_fee ? `₹${pet.adoption_fee}` : "Free"}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT — Pet Info */}
            <div className="flex-1">
              {/* Name + Status */}
              <div className="flex items-center justify-between mb-1">
                <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {pet.gender?.charAt(0).toUpperCase() + pet.gender?.slice(1)}
                </span>
              </div>

              {/* Breed + Age */}
              <p className="text-gray-500 text-sm mb-6">
                {pet.breed} • {pet.age} {pet.age === 1 ? "Year" : "Years"} Old
              </p>

              {/* Quick Facts Grid */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Quick Facts
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                      Temperament
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {pet.temperament || "—"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                      Vaccinated
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {pet.vaccinated ? "Yes, Up-to-date" : "No"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                      Sterilized
                    </p>
                    <p className="text-sm font-medium text-gray-800 capitalize">
                      {pet.sterilized?.replace("_", " ") || "—"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                      Health Record
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {pet.health_status || "—"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                      Good with Kids
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {pet.good_with_kids === true
                        ? "Yes"
                        : pet.good_with_kids === false
                          ? "No"
                          : "—"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                      Special Needs
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {pet.special_needs ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rescue Story */}
              {pet.rescue_story && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Rescue Story
                  </h3>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700 leading-relaxed italic">
                      "{pet.rescue_story}"
                    </p>
                  </div>
                </div>
              )}

              {/* Apply Button */}
              <button
                onClick={() => alert("Application feature coming soon!")}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                Apply for Adoption →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailPage;
