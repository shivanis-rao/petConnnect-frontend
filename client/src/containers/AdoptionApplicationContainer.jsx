import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PetService from "../services/PetService";
import AdoptionService from "../services/Adoptionservice.js";
import AdoptionApplicationForm from "../components/pets/ApplicationAdoptionForm";

const AdoptionApplicationContainer = () => {
  const { id } = useParams(); // petId from URL e.g. /pets/1/apply
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [loadingPet, setLoadingPet] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    // Pre-filled from backend (read-only fields)
    name: "",
    phone: "",
    email: "",
    past_pet_experience: 0,

    // User-filled fields
    current_occupation: "",
    address: "",
    living_situation: "", // "Family" | "I live alone" | "House/Room mates"
    family_agreement: "", // "Yes" | "No" | "N/A"
    landlord_permission: "", // "Yes" | "No" | "I am the owner"
    vacation_care: "",
  });

  // ── Fetch pet details + prefill user data from backend ──────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch pet
        const petRes = await PetService.getPetById(id);
        setPet(petRes.data);

        // 2. Fetch pre-fill data from backend
        const prefillRes = await AdoptionService.getPrefillData();
        const user = prefillRes.data.data;

        if (user) {
          setForm((prev) => ({
            ...prev,
            name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
            phone: user.phone || "",
            email: user.email || "",
            past_pet_experience: user.pet_experience_years ?? 0,
          }));
        }
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error("Fetch error:", err);
      } finally {
        setLoadingPet(false);
      }
    };

    fetchData();
  }, [id]);

  // ── Field change handler ─────────────────────────────────────────────
  const handleFieldChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // ── Submit handler ───────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // shelterId comes from the pet object — adjust field name if needed
      const shelterId = pet?.shelterId || pet?.shelter_id || pet?.shelter?.id;

      await AdoptionService.submitApplication(id, {
        shelterId,
        currentOccupation: form.current_occupation,
        address: form.address,
        livingArrangement: form.living_situation,
        familyAgreement: form.family_agreement || "N/A",
        landlordAllowsPets: form.landlord_permission,
        petCareWhenAway: form.vacation_care,
      });

      setSubmitted(true);
    } catch (err) {
      // Show backend error message if available
      const message =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <AdoptionApplicationForm
      pet={pet}
      loading={loadingPet}
      submitting={submitting}
      submitted={submitted}
      error={error}
      step={step}
      form={form}
      onFieldChange={handleFieldChange}
      onStepChange={setStep}
      onSubmit={handleSubmit}
      onBack={() => navigate(`/pets/${id}`)}
      onViewApplications={() => navigate("/my-applications")}
      onBackToBrowse={() => navigate("/browse")}
    />
  );
};

export default AdoptionApplicationContainer;
