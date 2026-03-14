import Apiservices from "./Apiservices";

// Map form display values → backend enum values
// Add console.log to debug what value is being sent
const mapLivingArrangement = (value) => {
  const map = {
    "family":           "Family",
    "with family":      "Family",
    "Family":           "Family",
    "With Family":      "Family",
    "alone":            "I live alone",
    "i live alone":     "I live alone",
    "I live alone":     "I live alone",
    "roommates":        "House/Room mates",
    "house/room mates": "House/Room mates",
    "House/Room mates": "House/Room mates",
    "Roommates":        "House/Room mates",
  };
  const result = map[value] || map[value?.toLowerCase()] || value;
  console.log("livingArrangement raw:", value, "→ mapped:", result);
  return result;
};

const mapFamilyAgreement = (value) => {
  const map = {
    "yes": "Yes", "Yes": "Yes",
    "no":  "No",  "No":  "No",
    "n/a": "N/A", "N/A": "N/A",
    "":    "N/A",
  };
  return map[value] || map[value?.toLowerCase()] || "N/A";
};

const mapLandlord = (value) => {
  const map = {
    "yes":            "Yes", "Yes":            "Yes",
    "no":             "No",  "No":             "No",
    "i am the owner": "I am the owner",
    "I am the owner": "I am the owner",
    "owner":          "I am the owner",
    "Owner":          "I am the owner",
  };
  return map[value] || map[value?.toLowerCase()] || value;
};

const AdoptionService = {
  // GET /api/adoption/prefill
  getPrefillData: () => {
    return Apiservices.get("/adoption/prefill");
  },

  // POST /api/adoption/apply/:petId
  submitApplication: (petId, formData) => {
    const payload = {
      shelterId:          formData.shelterId,
      currentOccupation:  formData.current_occupation,
      address:            formData.address,
      livingArrangement:  mapLivingArrangement(formData.living_situation),
      familyAgreement:    mapFamilyAgreement(formData.family_agreement),
      landlordAllowsPets: mapLandlord(formData.landlord_permission),
      petCareWhenAway:    formData.vacation_care,
    };
    // Log full payload so we can see exactly what is sent
    console.log("Adoption submit payload:", payload);
    return Apiservices.post(`/adoption/apply/${petId}`, payload);
  },

  // GET /api/adoption/my-applications
  getMyApplications: () => {
    return Apiservices.get("/adoption/my-applications");
  },

  // GET /api/adoption/shelter/:shelterId
  getApplicationsForShelter: (shelterId) => {
    return Apiservices.get(`/adoption/shelter/${shelterId}`);
  },

  // PATCH /api/adoption/:applicationId/status
  updateApplicationStatus: (applicationId, status) => {
    return Apiservices.patch(`/adoption/${applicationId}/status`, { status });
  },
};

export default AdoptionService;