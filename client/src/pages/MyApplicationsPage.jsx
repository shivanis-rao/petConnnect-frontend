import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdoptionService from "../services/Adoptionservice";

const STATUS_CONFIG = {
  pending: {
    label: "Under Review",
    color: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  approved: {
    label: "Approved",
    color: "bg-green-50 text-green-700 border border-green-200",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-50 text-red-700 border border-red-200",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
};

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [selectedApp, setSelectedApp] = useState(null);
=======
>>>>>>> eb97292530623761cd6ccf874fa29a9044d7c4c1

  useEffect(() => {
    fetchApplications();
  }, []);

<<<<<<< HEAD
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F3F4F6",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          width: "100%",
          margin: "0 auto",
          padding: "48px 24px",
          flex: 1,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "32px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            My Application
          </h1>
          <p style={{ margin: 0, fontSize: "15px", color: "#6B7280" }}>
=======
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await AdoptionService.getMyApplications();
      setApplications(response.data.data || response.data ||[]);
    } catch (err) {
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar - keep your existing Navbar component here */}

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="mt-2 text-gray-500">
>>>>>>> eb97292530623761cd6ccf874fa29a9044d7c4c1
            Manage and track your journey to finding a new furry family member.
          </p>
        </div>

        {/* Tab */}
<<<<<<< HEAD
        <div
          style={{ marginBottom: "24px", borderBottom: "1px solid #E5E7EB" }}
        >
          <div
            style={{
              display: "inline-block",
              paddingBottom: "12px",
              borderBottom: "2px solid #3B82F6",
              fontSize: "14px",
              fontWeight: 600,
              color: "#3B82F6",
            }}
          >
=======
        <div className="border-b border-gray-200 mb-8">
          <button className="pb-3 px-1 text-blue-600 font-medium border-b-2 border-blue-600 text-sm">
>>>>>>> eb97292530623761cd6ccf874fa29a9044d7c4c1
            All Applications
          </button>
        </div>

<<<<<<< HEAD
        {/* Content */}
        {loading ? (
          <div
            style={{ textAlign: "center", padding: "80px", color: "#6B7280" }}
          >
            Loading your applications...
          </div>
        ) : error ? (
          <div
            style={{ textAlign: "center", padding: "80px", color: "#EF4444" }}
          >
            {error}
          </div>
        ) : applications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🐾</div>
            <h2 style={{ margin: "0 0 8px", color: "#111827" }}>
              No Applications Yet
            </h2>
            <p style={{ margin: "0 0 24px", color: "#6B7280" }}>
              Browse available pets and find your perfect companion!
            </p>
            <button
              onClick={() => navigate("/browse")}
              style={{
                background: "#3B82F6",
                color: "white",
                border: "none",
                padding: "12px 28px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Browse Pets
            </button>
          </div>
        ) : (
          <div>
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                onViewDetails={setSelectedApp}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #E5E7EB",
          padding: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "white",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>🐾</span>
          <span style={{ fontWeight: 700, color: "#3B82F6", fontSize: "16px" }}>
            PetConnect
          </span>
        </div>
        <p style={{ margin: 0, fontSize: "13px", color: "#9CA3AF" }}>
          © 2026 PetConnect Adoption Services. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          <span
            style={{ fontSize: "13px", color: "#9CA3AF", cursor: "pointer" }}
          >
            Privacy Policy
          </span>
          <span
            style={{ fontSize: "13px", color: "#9CA3AF", cursor: "pointer" }}
          >
            Terms of Service
          </span>
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedApp && (
        <DetailModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
    </div>
  );
};

export default MyApplicationsPage;
=======
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl p-4 text-sm">{error}</div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
            </svg>
            <p className="text-lg font-medium">No applications yet</p>
            <p className="mt-1 text-sm">Browse pets and submit your first adoption application.</p>
            <button
              onClick={() => navigate("/browse-pets")}
              className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Pets
            </button>
          </div>
        )}

        <div className="space-y-4">
          {applications.map((app) => {
            const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-6"
              >
                {/* Pet Icon / Image */}
                <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {app.pet?.images?.[0] ? (
                    <img
                      src={app.pet.images[0]}
                      alt={app.pet?.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10c0-3.314 2.686-6 6-6s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6zm-4 9c0-2.21 3.582-4 8-4s8 1.79 8 4v1H3v-1zm14.5-9.5c.828 0 1.5-.672 1.5-1.5S18.328 6.5 17.5 6.5 16 7.172 16 8s.672 1.5 1.5 1.5zm-11 0C7.328 9.5 8 8.828 8 8s-.672-1.5-1.5-1.5S5 7.172 5 8s.672 1.5 1.5 1.5z" />
                    </svg>
                  )}
                </div>

                {/* Pet Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Pet Name</p>
                  <p className="text-lg font-bold text-gray-900">{app.pet?.name || "Unknown Pet"}</p>
                </div>

                {/* Submitted Date */}
                <div className="flex-1 min-w-0 hidden sm:block">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Submitted</p>
                  <p className="text-sm font-medium text-gray-700">{formatDate(app.createdAt)}</p>
                </div>

                {/* Status */}
                <div className="flex-1 min-w-0 hidden sm:block">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}>
                    {status.icon}
                    {status.label}
                  </span>
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigate(`/my-applications/${app.id}`)}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all flex-shrink-0"
                >
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}
>>>>>>> eb97292530623761cd6ccf874fa29a9044d7c4c1
