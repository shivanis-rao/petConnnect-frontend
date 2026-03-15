import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdoptionService from "../services/Adoptionservice";

// ─── Progress Steps Config ────────────────────────────────────────────────────
// 4-stage flow: Submitted (25%) → Shelter Approved (50%) → Home Visit (75%) → Final Adoption (100%)
const STEPS = [
  {
    id: 1,
    title: "Application Submitted",
    description: "Your application is under review by the shelter",
    icon: "shield",
  },
  {
    id: 2,
    title: "Shelter Approved",
    description: "Shelter has reviewed and approved your application",
    icon: "home",
  },
  {
    id: 3,
    title: "Home Visit",
    description: "Shelter schedules and completes a home visit",
    icon: "home",
  },
  {
    id: 4,
    title: "Final Adoption",
    description: "Sign contract and pay fee to complete adoption",
    icon: "document",
  },
];

// status values sent from backend → UI config
const STATUS_PROGRESS = {
  // Stage 1 — submitted, waiting for shelter review
  pending: {
    step: 1,
    progress: 25,
    label: "Under Review",
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  under_review: {
    step: 1,
    progress: 25,
    label: "Under Review",
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },

  // Stage 2 — shelter approved, background/primary check done
  approved: {
    step: 2,
    progress: 50,
    label: "Approved",
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },

  // Stage 3 — home visit scheduled / completed
  home_visit: {
    step: 3,
    progress: 75,
    label: "Home Visit",
    color: "text-purple-600 bg-purple-50 border-purple-200",
  },

  // Stage 4 — final adoption complete
  completed: {
    step: 4,
    progress: 100,
    label: "Adopted! 🎉",
    color: "text-green-600 bg-green-50 border-green-200",
  },

  // Rejected
  rejected: {
    step: 0,
    progress: 0,
    label: "Rejected",
    color: "text-red-600 bg-red-50 border-red-200",
  },
};

const STATUS_MESSAGE = {
  pending:
    "Your application has been submitted! The shelter is reviewing your details. This typically takes 3–5 business days.",
  under_review:
    "Your application has been submitted! The shelter is reviewing your details. This typically takes 3–5 business days.",
  approved:
    "Great news! The shelter has approved your application. They will contact you to schedule a home visit.",
  home_visit:
    "Your home visit has been scheduled. Once the visit is complete, you'll move on to finalizing the adoption.",
  completed:
    "Congratulations! 🎉 The adoption is complete. Welcome to your new furry family member!",
  rejected:
    "Unfortunately, your application was not approved at this time. Please contact the shelter for more information.",
};

// ─── Icon Components ──────────────────────────────────────────────────────────
const icons = {
  shield: (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  home: (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  document: (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  paw: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="7" cy="6" rx="1.2" ry="1.6" />
      <ellipse cx="4.5" cy="7.5" rx="1" ry="1.4" />
      <ellipse cx="9.5" cy="7.5" rx="1" ry="1.4" />
      <path d="M7 10 C4 10 3 13 4.5 15.5 C5.5 17.5 8.5 18.5 9.5 14.5 C10 13 11 13 11 14.5 C12 18.5 15 17.5 16 15.5 C17.5 13 17 10 14 10 C12 10 11 11 9.5 11 C8 11 9 10 7 10Z" />
    </svg>
  ),
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
  );
}

function StepItem({ step, activeStep, isCompleted }) {
  const done = isCompleted || step.id < activeStep;
  const active = step.id === activeStep && !isCompleted;
  const upcoming = step.id > activeStep && !isCompleted;

  return (
    <div className="flex items-start gap-3">
      {/* Circle */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5
          ${done ? "bg-blue-600 text-white" : active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"}`}
      >
        {done ? (
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          step.id
        )}
      </div>
      {/* Text */}
      <div className="flex-1">
        <p
          className={`text-sm font-semibold ${upcoming ? "text-gray-400" : "text-gray-800"}`}
        >
          {step.title}
        </p>
        <p
          className={`text-xs mt-0.5 ${upcoming ? "text-gray-300" : "text-gray-500"}`}
        >
          {step.description}
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ApplicationDetailsPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await AdoptionService.getApplicationById(applicationId);
      setApplication(response.data.data || response.data);
    } catch (err) {
      setError("Failed to load application details.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error || "Application not found."}
          </p>
          <button
            onClick={() => navigate("/my-applications")}
            className="text-blue-600 underline text-sm"
          >
            ← Back to My Applications
          </button>
        </div>
      </div>
    );
  }

  const { pet, shelter, status, createdAt, id } = application;
  const statusKey = status?.toLowerCase().replace(" ", "_") || "pending";
  const statusConfig = STATUS_PROGRESS[statusKey] || STATUS_PROGRESS.pending;
  // Shelter info revealed once shelter approves (stages 2, 3, 4)
  const shelterRevealed = ["approved", "home_visit", "completed"].includes(
    statusKey,
  );
  const isCompleted = statusKey === "completed";
  const isRejected = statusKey === "rejected";

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => navigate("/my-applications")}
            className="hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            My Applications
          </button>
          <span>/</span>
          <span className="text-gray-800 font-medium">
            {pet?.name}'s Application
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pet Hero Image */}
          <div className="relative rounded-2xl overflow-hidden h-72 sm:h-80 bg-gray-200">
            {pet?.images?.[0] ? (
              <img
                src={pet.images[0]}
                alt={pet?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-blue-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 10c0-3.314 2.686-6 6-6s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6zm-4 9c0-2.21 3.582-4 8-4s8 1.79 8 4v1H3v-1z" />
                </svg>
              </div>
            )}
            {/* Pet name overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
              <div className="flex items-end gap-3">
                <h2 className="text-3xl font-extrabold text-white">
                  {pet?.name}
                </h2>
                {pet?.breed && (
                  <span className="mb-1 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {pet.breed}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Application Status Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Application Status
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Application ID: {id} • Submitted {formatDate(createdAt)}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.color}`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  {shelterRevealed ? (
                    <polyline points="20 6 9 17 4 12" />
                  ) : isRejected ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </>
                  )}
                </svg>
                {statusConfig.label}
              </span>
            </div>

            {/* Progress Bar */}
            {!isRejected && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Processing Progress
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {statusConfig.progress}% Complete
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${statusConfig.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Status Message */}
            <div
              className={`flex gap-3 p-4 rounded-xl ${isRejected ? "bg-red-50" : "bg-blue-50"}`}
            >
              <svg
                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isRejected ? "text-red-500" : "text-blue-500"}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm text-gray-700">
                {STATUS_MESSAGE[statusKey] || STATUS_MESSAGE.pending}
              </p>
            </div>
          </div>

          {/* Pet Details + About */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Pet Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-500">{icons.paw}</span>
                Pet Details
              </h3>
              <InfoRow label="Breed" value={pet?.breed || "—"} />
              <InfoRow
                label="Age"
                value={
                  pet?.age
                    ? `${pet.age} Year${pet.age > 1 ? "s" : ""} Old`
                    : "—"
                }
              />
              <InfoRow label="Gender" value={pet?.gender || "—"} />
              {pet?.color && <InfoRow label="Color" value={pet.color} />}
            </div>

            {/* About Pet */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                About {pet?.name}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {pet?.description ||
                  `${pet?.name} is looking for a loving forever home. Contact the shelter for more information.`}
              </p>
            </div>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-6">
          {/* Shelter Information — revealed once shelter approves (stage 2+) */}
          {shelterRevealed && shelter ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">
                Shelter Information
              </h3>
              <div className="space-y-3">
                {/* Name & Location */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {shelter.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {shelter.city}
                      {shelter.state ? `, ${shelter.state}` : ""}
                    </p>
                  </div>
                </div>
                {/* Phone */}
                {shelter.pcontact_phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700">
                      {shelter.contact_phone}
                    </p>
                  </div>
                )}
                {/* Email */}
                {shelter.contact_email && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700 break-all">
                      {shelter.contact_email}
                    </p>
                  </div>
                )}
                {/* Address */}
                {shelter.address && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700">{shelter.address}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                {isCompleted ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-700 font-medium text-center">
                    🎉 Adoption complete! Welcome to your new family member.
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700 font-medium text-center">
                    ✅ Approved! Contact the shelter to continue the process.
                  </div>
                )}
              </div>
            </div>
          ) : !isRejected ? (
            /* Shelter hidden until stage 2 */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">
                Shelter Information
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <svg
                  className="w-10 h-10 text-gray-300 mx-auto mb-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <p className="text-xs text-gray-500 font-medium">
                  Shelter details will be revealed once your application is
                  approved.
                </p>
              </div>
            </div>
          ) : null}

          {/* Next Steps */}
          {!isRejected && (
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-5">
                Next Steps
              </h3>
              <div className="space-y-5">
                {STEPS.map((step, idx) => (
                  <div key={step.id}>
                    <StepItem
                      step={step}
                      activeStep={statusConfig.step}
                      isCompleted={isCompleted}
                    />
                    {idx < STEPS.length - 1 && (
                      <div className="ml-4 mt-1 mb-1 w-px h-4 bg-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rejected Card */}
          {isRejected && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <svg
                className="w-12 h-12 text-red-400 mx-auto mb-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <p className="text-sm font-semibold text-red-700 mb-1">
                Application Not Approved
              </p>
              <p className="text-xs text-red-500 mb-4">
                Please contact the shelter for more information.
              </p>
              <button
                onClick={() => navigate("/browse")}
                className="text-xs bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                Browse Other Pets
              </button>
            </div>
          )}
        </div>
      </div>
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
          PetConnect © 2026. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
