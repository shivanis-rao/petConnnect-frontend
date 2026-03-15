import Apiservices from "./Apiservices";

const AdoptionService = {
  // GET /api/adoption/prefill
  getPrefillData: () => {
    return Apiservices.get("/adoption/prefill");
  },

  // POST /api/adoption/apply/:petId
  submitApplication: (petId, formData) => {
    const payload = {
      shelterId: formData.shelterId,
      currentOccupation: formData.currentOccupation,
      address: formData.address,
      livingArrangement: formData.livingArrangement, // ✅ already correct value
      familyAgreement: formData.familyAgreement, // ✅ already correct value
      landlordAllowsPets: formData.landlordAllowsPets, // ✅ already correct value
      petCareWhenAway: formData.petCareWhenAway,
    };

    return Apiservices.post(`/adoption/apply/${petId}`, payload);
  },

  // GET /api/adoption/my-applications
  getMyApplications: () => {
    return Apiservices.get("/adoption/my-applications");
  },

  // GET /api/adoption/:applicationId  — for ApplicationDetailsPage
  getApplicationById: (applicationId) => {
    return Apiservices.get(`/adoption/${applicationId}`);
  },

  // GET /api/adoption/shelter/:shelterId
  getApplicationsForShelter: (shelterId) => {
    return Apiservices.get(`/adoption/shelter/${shelterId}`);
  },

  // PATCH /api/adoption/:applicationId/status
  updateApplicationStatus: (applicationId, status) => {
    return Apiservices.patch(`/adoption/${applicationId}/status`, { status });
  },
  // Add this method
  getShelterApplicationById: (shelterId, applicationId) => {
    return Apiservices.get(
      `/adoption/shelter/${shelterId}/application/${applicationId}`,
    );
  },
};

export default AdoptionService;
