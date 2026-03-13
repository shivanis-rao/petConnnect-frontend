import { useState, useEffect, useCallback } from "react";
import PetCard from "../components/pets/PetCard";
import PetFilters from "../components/pets/PetFilters";
import PetService from "../services/PetService";

const BrowsePetsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    species: "",
    breed: "",
    gender: "",
    vaccinated: undefined,
    special_needs: undefined,
    good_with_kids: undefined,
    age_min: "",
    age_max: "",
    city: "",
    zipcode: "",
    page: 1,
    limit: 9,
    sort: "newest",
  });

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await PetService.browsePets(filters);
      setPets(result.pets);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch {
      setError("Failed to load pets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sort: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Discover Pets</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading
              ? "Loading..."
              : `Found ${total} pet${total !== 1 ? "s" : ""} available for adoption`}
          </p>
        </div>

        <div className="flex gap-6">
          {/* Left — Filters Sidebar */}
          <PetFilters filters={filters} onChange={handleFilterChange} />

          {/* Right — Results */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {!loading && `Showing page ${filters.page} of ${totalPages}`}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={filters.sort}
                  onChange={handleSortChange}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400"
                >
                  <option value="newest">Newest Arrival</option>
                  <option value="oldest">Oldest Arrival</option>
                </select>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-4 text-sm">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse"
                  >
                    <div className="h-52 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-8 bg-gray-200 rounded w-full mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && pets.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-5xl mb-4">🐾</span>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  No pets found
                </h3>
                <p className="text-sm text-gray-400">
                  Try adjusting your filters
                </p>
              </div>
            )}

            {/* Pet Grid */}
            {!loading && pets.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {pets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:border-blue-400 hover:text-blue-600"
                >
                  ← Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors
                      ${
                        filters.page === i + 1
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-200 hover:border-blue-400 hover:text-blue-600"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:border-blue-400 hover:text-blue-600"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePetsPage;
