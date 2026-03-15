import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint } from "lucide-react";
import ShelterSidebar from "../components/shelter/ShelterSidebar";
import AdoptionService from "../services/Adoptionservice.js";
import useAuth from "../hooks/AuthContext";

// ── STATUS CONFIG — matches backend values exactly ─────────────────────────
const STATUS_CONFIG = {
  // ✅ backend sends lowercase — fixed from before
  pending: { badge: "bg-amber-50 text-amber-500", dot: "bg-amber-500" },
  approved: { badge: "bg-green-50 text-green-700", dot: "bg-green-600" },
  rejected: { badge: "bg-red-50 text-red-600", dot: "bg-red-500" },
  home_visit: { badge: "bg-blue-50 text-blue-600", dot: "bg-blue-500" },
  completed: { badge: "bg-purple-50 text-purple-600", dot: "bg-purple-500" },
};

// ── TAB CONFIG ─────────────────────────────────────────────────────────────
const TABS = ["All", "Pending", "Approved", "Home Visit", "Rejected"];

// ── HELPER — format date nicely ────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// ── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function ShelterAdoptionRequests() {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const navigate = useNavigate();

  // ── Fetch real applications from backend ──────────────────────────────
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);

        // ✅ Get shelterId from logged in user
        const shelterId = currentUser?.shelter?.id;

        if (!shelterId) {
          setError("Shelter ID not found. Please log in again.");
          return;
        }

        const res = await AdoptionService.getApplicationsForShelter(shelterId);
        setApplications(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError("Failed to load applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

  // ── Filter by tab ──────────────────────────────────────────────────────
  const filtered = applications.filter((app) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending") return app.status === "pending";
    if (activeTab === "Approved") return app.status === "approved";
    if (activeTab === "Rejected") return app.status === "rejected";
    if (activeTab === "Home Visit") return app.status === "home_visit";
    return true;
  });

  const pendingCount = applications.filter(
    (app) => app.status === "pending",
  ).length;

  // ── Loading state ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen">
        <ShelterSidebar pendingCount={0} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl animate-spin mb-4">🐾</div>
            <p className="text-sm text-gray-400 font-semibold">
              Loading applications...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex min-h-screen">
        <ShelterSidebar pendingCount={0} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500 text-sm font-semibold bg-red-50 px-4 py-3 rounded-xl">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #f0f7f4 0%, #e8f4fd 50%, #f0f0fa 100%)",
      }}
    >
      <div className="flex">
        <ShelterSidebar pendingCount={pendingCount} />

        {/* ── MAIN CONTENT ────────────────────────────────────────── */}
        <main className="flex-1 p-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Manage your shelter with ease
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back, {currentUser?.name?.split(" ")[0]}! Here's what
              needs your attention today.
            </p>
          </div>

          {/* Requests Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-7">
            {/* Card Header */}
            <div className="flex items-center gap-2.5 mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                Adoption Requests
              </h2>
              {pendingCount > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-all
                    ${
                      activeTab === tab
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-500 border-transparent hover:text-gray-700"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Table Header */}
            <div
              className="grid items-center gap-6 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 rounded-lg"
              style={{ gridTemplateColumns: "2fr 2fr 2fr 2fr auto" }}
            >
              <span>Pet Name</span>
              <span>Applicant</span>
              <span>Submitted</span>
              <span>Status</span>
              <span></span>
            </div>

            {/* Empty State */}
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                <PawPrint size={32} className="mx-auto mb-3 text-gray-200" />
                No adoption requests found.
              </div>
            ) : (
              filtered.map((app) => {
                const s = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;

                return (
                  <div
                    key={app.id}
                    className="grid items-center gap-6 px-6 py-4 border-t border-gray-100 hover:bg-blue-50/40 transition-all"
                    style={{ gridTemplateColumns: "2.5fr 2fr 2fr 2fr auto" }}
                  >
                    {/* Pet */}
                    <div className="flex items-center gap-3">
                      {app.pet?.image_url ? (
                        <img
                          src={app.pet.image_url}
                          alt={app.pet?.name}
                          className="w-11 h-11 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center">
                          <PawPrint size={18} className="text-gray-300" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {app.pet?.name || "—"}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {app.pet?.breed || app.pet?.species || "—"}
                        </div>
                      </div>
                    </div>

                    {/* Applicant */}
                    <div className="text-sm text-gray-700">
                      {app.applicant?.first_name} {app.applicant?.last_name}
                    </div>

                    {/* Date */}
                    <div className="text-sm text-gray-500">
                      {formatDate(app.createdAt)}
                    </div>

                    {/* Status Badge */}
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {/* ✅ Capitalize for display */}
                        {app.status
                          .replace("_", " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => navigate(`/shelter/adoptions/${app.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-12 py-8 mt-10">
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-base text-blue-600 mb-2">
              <PawPrint size={18} /> PetConnect
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Connecting loving owners with their perfect companions. Making
              adoption easier since 2016.
            </p>
          </div>
          <div>
            <div className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-3">
              Support
            </div>
            {["Contact Support", "Privacy Policy", "Terms of Use"].map((l) => (
              <a
                key={l}
                href="#"
                className="block text-gray-500 hover:text-gray-700 text-sm mb-1.5 transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
          <div>
            <div className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-3">
              Connect
            </div>
            <div className="flex gap-2.5">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white">
                f
              </div>
              <div className="w-9 h-9 rounded-full bg-sky-400 flex items-center justify-center text-white">
                𝕏
              </div>
              <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white">
                ▶
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
          PetConnect © 2024. All rights reserved. · Version 1.2.4
        </div>
      </footer>
    </div>
  );
}
