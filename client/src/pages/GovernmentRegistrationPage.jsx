import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/Apiservices";

const GovernmentRegistrationPage = () => {
    const location = useLocation();
    const { name, type } = location.state || {};
    const navigate = useNavigate();

    const [departmentName, setDepartmentName] = useState("");
    const [stateMunicipality, setStateMunicipality] = useState("");
    const [office, setOffice] = useState("");
    const [governmentShelterId, setGovernmentShelterId] = useState("");
    const [verificationDoc, setVerificationDoc] = useState(null);
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [country, setCountry] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // ── Validators ──────────────────────────────────────────
    const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const validatePhone = (v) => /^\+?[\d\s\-()]{7,15}$/.test(v);
    const validatePincode = (v) => /^\d{4,10}$/.test(v);
    const validateFile = (file) => {
        if (!file) return "Document is required.";
        const allowed = ["application/pdf", "image/jpeg", "image/png"];
        if (!allowed.includes(file.type))
            return "Only PDF, JPG, or PNG files are allowed.";
        if (file.size > 5 * 1024 * 1024) return "File size must be under 5MB.";
        return null;
    };

    const validate = () => {
        const e = {};
        if (!departmentName.trim()) e.departmentName = "Department name is required.";
        if (!stateMunicipality.trim()) e.stateMunicipality = "State / Municipality is required.";
        if (!office.trim()) e.office = "Office is required.";
        if (!governmentShelterId.trim()) e.governmentShelterId = "Government Shelter ID is required.";
        const docErr = validateFile(verificationDoc);
        if (docErr) e.verificationDoc = docErr;
        if (!city.trim()) e.city = "City is required.";
        if (!state.trim()) e.state = "State is required.";
        if (!validatePincode(pincode)) e.pincode = "Enter a valid pincode (digits only).";
        if (!country.trim()) e.country = "Country is required.";
        if (!validateEmail(email)) e.email = "Enter a valid email address.";
        if (!validatePhone(phone)) e.phone = "Enter a valid phone number.";
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length > 0) {
            setErrors(e);
            return;
        }
        try {
            setLoading(true);
            setErrors({});
            const formData = new FormData();
            formData.append("name", name);
            formData.append("type", type);
            formData.append("department_name", departmentName);
            formData.append("municipality", stateMunicipality);
            formData.append("office", office);
            formData.append("government_id_number", governmentShelterId);
            formData.append("city", city);
            formData.append("state", state);
            formData.append("zipcode", pincode);
            formData.append("country", country);
            formData.append("contact_email", email);
            formData.append("contact_phone", phone);
            formData.append("government_authorization", verificationDoc);
            await api.post("/shelters/government_register", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate("/shelter/waiting-area");
        } catch (err) {
            setErrors({ api: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    // ── Helpers ──────────────────────────────────────────────
    const inputClass = (field) =>
        `w-full border rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors ${errors[field]
            ? "border-red-400 bg-red-50 focus:border-red-500"
            : "border-gray-200 focus:border-blue-400"
        }`;

    const ErrMsg = ({ field }) =>
        errors[field] ? (
            <p className="text-red-500 text-xs mt-1">⚠ {errors[field]}</p>
        ) : null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">


            <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
                {/* Back */}
                <button
                    onClick={() => navigate("/shelter-register", { state: { name, type } })}
                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 mb-6 hover:scale-105"
                >
                    ← Back
                </button>

                <h1 className="text-2xl font-bold text-gray-800 mb-1">Complete Shelter Registration</h1>
                <p className="text-sm text-gray-500 mb-6">
                    Help more animals find loving homes by verifying your government-shelter facility.
                </p>

                {/* Section 1 */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-blue-500 text-xs">🏛</span>
                        </div>
                        <h2 className="text-sm font-semibold text-gray-700">Section 1: Government Details</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Department Name <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. Department of Animal Welfare"
                                value={departmentName}
                                onChange={(e) => { setDepartmentName(e.target.value); setErrors((p) => ({ ...p, departmentName: "" })); }}
                                className={inputClass("departmentName")}
                            />
                            <ErrMsg field="departmentName" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">State / Municipality <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. State of New York"
                                value={stateMunicipality}
                                onChange={(e) => { setStateMunicipality(e.target.value); setErrors((p) => ({ ...p, stateMunicipality: "" })); }}
                                className={inputClass("stateMunicipality")}
                            />
                            <ErrMsg field="stateMunicipality" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Office <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                placeholder="Official Local Office"
                                value={office}
                                onChange={(e) => { setOffice(e.target.value); setErrors((p) => ({ ...p, office: "" })); }}
                                className={inputClass("office")}
                            />
                            <ErrMsg field="office" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Government Shelter ID <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                placeholder="Official Registered ID"
                                value={governmentShelterId}
                                onChange={(e) => { setGovernmentShelterId(e.target.value); setErrors((p) => ({ ...p, governmentShelterId: "" })); }}
                                className={inputClass("governmentShelterId")}
                            />
                            <ErrMsg field="governmentShelterId" />
                        </div>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-xs text-gray-500 mb-2">
                            Verification Document <span className="text-red-400">*</span>
                            <span className="text-gray-400 ml-1">(PDF, JPG, PNG — max 5MB)</span>
                        </label>
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 transition-colors ${errors.verificationDoc ? "border-red-400 bg-red-50" : "border-gray-200"
                                }`}
                        >
                            <input
                                type="file"
                                id="fileInput"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                    setVerificationDoc(e.target.files[0]);
                                    setErrors((p) => ({ ...p, verificationDoc: "" }));
                                }}
                            />
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <p className="text-xs text-gray-400 mb-1">
                                {verificationDoc ? (
                                    <span className="text-green-600 font-medium">✓ {verificationDoc.name}</span>
                                ) : (
                                    "Upload authorization letter or ID card"
                                )}
                            </p>
                            <button
                                onClick={() => document.getElementById("fileInput").click()}
                                className="mt-2 border border-gray-300 rounded-lg px-4 py-1.5 text-xs text-gray-500 bg-white hover:bg-gray-50"
                            >
                                {verificationDoc ? "Change File" : "Choose File"}
                            </button>
                        </div>
                        <ErrMsg field="verificationDoc" />
                    </div>
                </div>

                {/* Section 2 */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-blue-500 text-xs">📍</span>
                        </div>
                        <h2 className="text-sm font-semibold text-gray-700">Section 2: Address</h2>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">City <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => { setCity(e.target.value); setErrors((p) => ({ ...p, city: "" })); }}
                                className={inputClass("city")}
                            />
                            <ErrMsg field="city" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">State <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                placeholder="State"
                                value={state}
                                onChange={(e) => { setState(e.target.value); setErrors((p) => ({ ...p, state: "" })); }}
                                className={inputClass("state")}
                            />
                            <ErrMsg field="state" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Pincode <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                placeholder="000000"
                                value={pincode}
                                onChange={(e) => { setPincode(e.target.value); setErrors((p) => ({ ...p, pincode: "" })); }}
                                className={inputClass("pincode")}
                            />
                            <ErrMsg field="pincode" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Country <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                placeholder="Country"
                                value={country}
                                onChange={(e) => { setCountry(e.target.value); setErrors((p) => ({ ...p, country: "" })); }}
                                className={inputClass("country")}
                            />
                            <ErrMsg field="country" />
                        </div>
                    </div>
                </div>

                {/* Section 3 */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-blue-500 text-xs">📞</span>
                        </div>
                        <h2 className="text-sm font-semibold text-gray-700">Section 3: Official Contact</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Official Contact Email <span className="text-red-400">*</span></label>
                            <div className={`flex items-center border rounded-lg px-3 py-2 gap-2 ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200"}`}>
                                <span className="text-gray-400 text-xs">✉</span>
                                <input
                                    type="email"
                                    placeholder="office@example.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                                    className="flex-1 text-xs text-gray-700 focus:outline-none bg-transparent"
                                />
                            </div>
                            <ErrMsg field="email" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Official Phone Number <span className="text-red-400">*</span></label>
                            <div className={`flex items-center border rounded-lg px-3 py-2 gap-2 ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200"}`}>
                                <span className="text-gray-400 text-xs">📱</span>
                                <input
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    value={phone}
                                    onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: "" })); }}
                                    className="flex-1 text-xs text-gray-700 focus:outline-none bg-transparent"
                                />
                            </div>
                            <ErrMsg field="phone" />
                        </div>
                    </div>
                </div>

                {/* API Error */}
                {errors.api && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-2.5 rounded-xl mb-4">
                        ⚠️ {errors.api}
                    </div>
                )}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-medium py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 mb-3 disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Submitting...
                        </>
                    ) : (
                        <>🛡️ Submit for Admin Verification</>
                    )}
                </button>
                <p className="text-center text-xs text-gray-400">Verification usually takes 2-3 business days</p>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 px-8 py-8">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-500">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">🐾</div>
                            <p className="font-bold text-gray-800">PetConnect</p>
                        </div>
                        <p className="text-xs max-w-xs leading-relaxed">Connecting loving owners with their perfect companions. Making adoption easier since 2026.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-700 mb-3 uppercase text-xs tracking-wider">Support</p>
                        <div className="flex flex-col gap-1.5">
                            <p className="hover:text-blue-600 cursor-pointer transition-colors">Contact Support</p>
                            <p className="hover:text-blue-600 cursor-pointer transition-colors">Privacy Policy</p>
                            <p className="hover:text-blue-600 cursor-pointer transition-colors">Terms of Use</p>
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-700 mb-3 uppercase text-xs tracking-wider">Connect</p>
                        <div className="flex gap-3">
                            {["📘", "🐦", "📸"].map((icon, i) => (
                                <div key={i} className="w-8 h-8 bg-gray-100 hover:bg-blue-100 rounded-lg flex items-center justify-center cursor-pointer transition-colors">{icon}</div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="max-w-5xl mx-auto mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                    PetConnect © 2026. All rights reserved. · Version 1.0.4
                </div>
            </footer>
        </div>
    );
};

export default GovernmentRegistrationPage;  