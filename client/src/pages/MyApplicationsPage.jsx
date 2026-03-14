import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdoptionService from "../services/Adoptionservice.js";

// ── Status config ─────────────────────────────────────────────────────────
const STATUS = {
  pending: {
    label: "Under Review",
    color: "#B45309",
    bg: "#FFFBEB",
    border: "#FDE68A",
    icon: "🕐",
  },
  approved: {
    label: "Approved",
    color: "#059669",
    bg: "#ECFDF5",
    border: "#6EE7B7",
    icon: "✅",
  },
  rejected: {
    label: "Rejected",
    color: "#DC2626",
    bg: "#FFF1F2",
    border: "#FECDD3",
    icon: "✖",
  },
};

// ── Status Badge ──────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: 600,
      }}
    >
      <span style={{ fontSize: "12px" }}>{s.icon}</span>
      {s.label}
    </span>
  );
};

// ── Application Row Card ──────────────────────────────────────────────────
const ApplicationCard = ({ app, onViewDetails }) => {
  const petImage =
    app.pet?.photos?.[0] || app.pet?.image_url || app.pet?.image || null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
        background: "white",
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        padding: "20px 24px",
        marginBottom: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {/* Pet Image */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "10px",
          flexShrink: 0,
          overflow: "hidden",
          background: "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {petImage ? (
          <img
            src={petImage}
            alt={app.pet?.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: "32px" }}>🐾</span>
        )}
      </div>

      {/* Pet Name */}
      <div style={{ flex: "0 0 180px" }}>
        <p
          style={{
            margin: "0 0 4px",
            fontSize: "11px",
            fontWeight: 600,
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          Pet Name
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: 700,
            color: "#111827",
          }}
        >
          {app.pet?.name || "Unknown"}
        </p>
      </div>

      {/* Submitted Date */}
      <div style={{ flex: "0 0 160px" }}>
        <p
          style={{
            margin: "0 0 4px",
            fontSize: "11px",
            fontWeight: 600,
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          Submitted
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "15px",
            fontWeight: 500,
            color: "#374151",
          }}
        >
          {new Date(app.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Status */}
      <div style={{ flex: "0 0 180px" }}>
        <p
          style={{
            margin: "0 0 6px",
            fontSize: "11px",
            fontWeight: 600,
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          Status
        </p>
        <StatusBadge status={app.status} />
      </div>

      {/* View Details Button */}
      <div style={{ marginLeft: "auto" }}>
        <button
          onClick={() => onViewDetails(app)}
          style={{
            background: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 24px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#2563EB")}
          onMouseLeave={(e) => (e.target.style.background = "#3B82F6")}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// ── Detail Modal ──────────────────────────────────────────────────────────
const DetailModal = ({ app, onClose }) => {
  if (!app) return null;
  const s = STATUS[app.status] || STATUS.pending;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflow: "auto",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 4px",
                fontSize: "20px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Application Details
            </h2>
            <p style={{ margin: 0, fontSize: "13px", color: "#9CA3AF" }}>
              #{app.id} · {app.pet?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#F3F4F6",
              border: "none",
              borderRadius: "8px",
              width: 36,
              height: 36,
              cursor: "pointer",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Status Banner */}
        <div
          style={{
            background: s.bg,
            border: `1px solid ${s.border}`,
            borderRadius: "10px",
            padding: "14px 16px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "20px" }}>{s.icon}</span>
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 700,
                color: s.color,
                fontSize: "15px",
              }}
            >
              {s.label}
            </p>
            <p style={{ margin: 0, fontSize: "13px", color: "#6B7280" }}>
              {app.status === "pending" &&
                "The shelter is reviewing your application."}
              {app.status === "approved" &&
                "Congratulations! Your application has been approved."}
              {app.status === "rejected" &&
                "Unfortunately, this application was not approved."}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <Field
            label="Pet"
            value={`${app.pet?.name} (${app.pet?.species || ""})`}
          />
          <Field
            label="Submitted"
            value={new Date(app.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          />
          <Field label="Occupation" value={app.currentOccupation} />
          <Field
            label="Experience"
            value={`${app.petExperienceYears} year(s)`}
          />
          <Field label="Living With" value={app.livingArrangement} />
          <Field label="Family Agree" value={app.familyAgreement} />
          <Field label="Landlord" value={app.landlordAllowsPets} />
          <Field label="Shelter" value={app.shelter?.name} />
        </div>

        <div
          style={{
            background: "#F9FAFB",
            borderRadius: "10px",
            padding: "14px 16px",
            marginBottom: "8px",
          }}
        >
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "11px",
              color: "#9CA3AF",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Address
          </p>
          <p style={{ margin: 0, color: "#374151", fontSize: "14px" }}>
            {app.address}
          </p>
        </div>
        <div
          style={{
            background: "#F9FAFB",
            borderRadius: "10px",
            padding: "14px 16px",
          }}
        >
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "11px",
              color: "#9CA3AF",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Pet Care When Away
          </p>
          <p style={{ margin: 0, color: "#374151", fontSize: "14px" }}>
            {app.petCareWhenAway}
          </p>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value }) => (
  <div
    style={{ background: "#F9FAFB", borderRadius: "8px", padding: "10px 14px" }}
  >
    <p
      style={{
        margin: "0 0 2px",
        fontSize: "11px",
        color: "#9CA3AF",
        fontWeight: 600,
        textTransform: "uppercase",
      }}
    >
      {label}
    </p>
    <p
      style={{ margin: 0, fontSize: "14px", color: "#111827", fontWeight: 500 }}
    >
      {value || "—"}
    </p>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────
const MyApplicationsPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const loadApps = async () => {
      try {
        const res = await AdoptionService.getMyApplications();
        setApplications(res.data.data);
      } catch (err) {
        setError("Failed to load applications.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadApps();
  }, []);

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
            Manage and track your journey to finding a new furry family member.
          </p>
        </div>

        {/* Tab */}
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
            All Applications
          </div>
        </div>

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
