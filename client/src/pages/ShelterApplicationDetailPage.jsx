import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdoptionService from "../services/Adoptionservice.js";
import useAuth from "../hooks/AuthContext";
import ShelterSidebar from "../components/shelter/ShelterSidebar";

// ── Status flow config ─────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    dot: "bg-amber-500",
  },
  approved: {
    label: "Approved",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    dot: "bg-blue-500",
  },
  home_visit: {
    label: "Home Visit",
    color: "bg-purple-50 text-purple-600 border-purple-200",
    dot: "bg-purple-500",
  },
  completed: {
    label: "Completed",
    color: "bg-green-50 text-green-600 border-green-200",
    dot: "bg-green-500",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-500",
  },
};

// ── Progress steps ─────────────────────────────────────────────────────────
const PROGRESS_STEPS = [
  { key: "pending", label: "Application Review" },
  { key: "approved", label: "Approved" },
  { key: "home_visit", label: "Home Visit" },
  { key: "completed", label: "Completed" },
];

const STATUS_ORDER = ["pending", "approved", "home_visit", "completed"];

// ── Action buttons based on current status ─────────────────────────────────
const getActions = (status) => {
  switch (status) {
    case "pending":
      return [
        {
          label: "Approve Application",
          value: "approved",
          style: "bg-blue-600 hover:bg-blue-700 text-white",
        },
        {
          label: "Reject Application",
          value: "rejected",
          style:
            "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200",
        },
      ];
    case "approved":
      return [
        {
          label: "Mark Home Visit",
          value: "home_visit",
          style: "bg-purple-600 hover:bg-purple-700 text-white",
        },
        {
          label: "Reject Application",
          value: "rejected",
          style:
            "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200",
        },
      ];
    case "home_visit":
      return [
        {
          label: "Complete Adoption",
          value: "completed",
          style: "bg-green-600 hover:bg-green-700 text-white",
        },
        {
          label: "Reject Application",
          value: "rejected",
          style:
            "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200",
        },
      ];
    default:
      return []; // completed or rejected — no actions
  }
};

// ── Badge component ────────────────────────────────────────────────────────
const Badge = ({ text, color }) => (
  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color}`}>
    {text}
  </span>
);

// ── Info row ───────────────────────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-800">{value || "—"}</span>
  </div>
);

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ShelterApplicationDetailPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  const shelterId = currentUser?.shelter?.id;

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const res = await AdoptionService.getShelterApplicationById(
        shelterId,
        applicationId,
      );
      setApplication(res.data.data);
    } catch (err) {
      setError("Failed to load application details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);
    try {
      await AdoptionService.updateApplicationStatus(applicationId, newStatus);
      // ✅ Update local state — no need to refetch
      setApplication((prev) => ({ ...prev, status: newStatus }));
      setUpdateSuccess(`Status updated to "${newStatus}" successfully!`);
    } catch (err) {
      setUpdateError("Failed to update status. Please try again.");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen">
        <ShelterSidebar pendingCount={0} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-5xl animate-spin">🐾</div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error || !application) {
    return (
      <div className="flex min-h-screen">
        <ShelterSidebar pendingCount={0} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button
              onClick={() => navigate("/shelter/adoptions")}
              className="text-blue-600 text-sm underline"
            >
              ← Back to Adoption Requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { pet, applicant, status, createdAt } = application;
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const actions = getActions(status);
  const currentStep = STATUS_ORDER.indexOf(status);
  const isTerminal = status === "completed" || status === "rejected";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ShelterSidebar pendingCount={0} />

      <div className="flex-1 overflow-y-auto">
        {/* ── Top Bar ───────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => navigate("/shelter/adoptions")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium"
          >
            ← Back to Adoption Requests
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              Application ID: #{application.id} • {formatDate(createdAt)}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}
              />
              {statusConfig.label}
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-6">
          {/* ── Page Title + Actions ───────────────────────────── */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Adoption Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Review applicant details and take action
              </p>
            </div>

            {/* ── Action Buttons ─────────────────────────────── */}
            {!isTerminal && (
              <div className="flex items-center gap-3">
                {actions.map((action) => (
                  <button
                    key={action.value}
                    onClick={() => handleStatusUpdate(action.value)}
                    disabled={updating}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${action.style}`}
                  >
                    {updating ? "Updating..." : action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Terminal states */}
            {status === "completed" && (
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">
                🎉 Adoption Complete
              </span>
            )}
            {status === "rejected" && (
              <span className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold">
                Application Rejected
              </span>
            )}
          </div>

          {/* ── Feedback messages ──────────────────────────────── */}
          {updateSuccess && (
            <div className="bg-green-50 text-green-700 text-sm font-medium px-4 py-3 rounded-xl mb-4 border border-green-200">
              ✅ {updateSuccess}
            </div>
          )}
          {updateError && (
            <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl mb-4 border border-red-200">
              ❌ {updateError}
            </div>
          )}

          {/* ── Progress Bar ───────────────────────────────────── */}
          {status !== "rejected" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Adoption Process
              </p>
              <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
                <div
                  className="absolute top-4 left-0 h-0.5 bg-blue-600 z-0 transition-all duration-500"
                  style={{
                    width:
                      status === "completed"
                        ? "100%"
                        : `${(currentStep / (PROGRESS_STEPS.length - 1)) * 100}%`,
                  }}
                />

                {PROGRESS_STEPS.map((step, idx) => {
                  const done =
                    STATUS_ORDER.indexOf(status) > idx ||
                    status === "completed";
                  const active = STATUS_ORDER.indexOf(status) === idx;
                  return (
                    <div
                      key={step.key}
                      className="flex flex-col items-center z-10 gap-2"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2
                        ${
                          done
                            ? "bg-blue-600 border-blue-600 text-white"
                            : active
                              ? "bg-white border-blue-600 text-blue-600"
                              : "bg-white border-gray-200 text-gray-400"
                        }`}
                      >
                        {done ? "✓" : idx + 1}
                      </div>
                      <span
                        className={`text-xs font-semibold whitespace-nowrap
                        ${active ? "text-blue-600" : done ? "text-gray-700" : "text-gray-400"}`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Main Content Grid ──────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ── Left: Applicant Details ────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
                  {applicant?.first_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {applicant?.first_name} {applicant?.last_name}
                  </h3>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Verified Adopter
                  </span>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>✉️</span> {applicant?.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📞</span> {applicant?.phone || application.phoneNumber}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📍</span> {application.address}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <InfoRow
                  label="Occupation"
                  value={application.currentOccupation}
                />
                <InfoRow
                  label="Pet Experience"
                  value={`${application.petExperienceYears || 0} year(s)`}
                />
                <InfoRow
                  label="Living Situation"
                  value={application.livingArrangement}
                />
                <InfoRow
                  label="Family Agreement"
                  value={application.familyAgreement}
                />
                <InfoRow
                  label="Landlord Allows"
                  value={application.landlordAllowsPets}
                />
              </div>

              {/* Vacation Care */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                  Pet Care When Away
                </p>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3">
                  {application.petCareWhenAway}
                </p>
              </div>
            </div>

            {/* ── Right: Pet Details ─────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {/* Pet Image */}
              <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-100 mb-5">
                {pet?.image_url ? (
                  <img
                    src={pet.image_url}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">
                    🐾
                  </div>
                )}
              </div>

              {/* Pet Name + Breed */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">{pet?.name}</h3>
                <p className="text-sm text-gray-500">
                  {pet?.breed} • {pet?.age} Year{pet?.age > 1 ? "s" : ""} Old •{" "}
                  {pet?.gender}
                </p>
              </div>

              {/* Pet Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {pet?.vaccinated && (
                  <Badge
                    text="✓ Vaccinated"
                    color="bg-green-50 text-green-700"
                  />
                )}
                {pet?.sterilized && (
                  <Badge text="✓ Sterilized" color="bg-blue-50 text-blue-700" />
                )}
                {pet?.good_with_kids && (
                  <Badge
                    text="✓ Good with Kids"
                    color="bg-purple-50 text-purple-700"
                  />
                )}
                {pet?.special_needs && (
                  <Badge
                    text="Special Needs"
                    color="bg-orange-50 text-orange-700"
                  />
                )}
              </div>

              {/* Temperament */}
              {pet?.temperament && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                    Temperament
                  </p>
                  <p className="text-sm text-gray-700">{pet.temperament}</p>
                </div>
              )}

              {/* Adoption Fee */}
              {pet?.adoption_fee > 0 && (
                <div className="mt-4 flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
                  <span className="text-sm font-semibold text-gray-600">
                    Adoption Fee
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    ₹{pet.adoption_fee}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
