import { useState, useEffect } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import {
  Save,
  Heart,
  List,
  MessageSquare,
  BarChart2,
  LogOut,
  Plus,
  PawPrint,
} from "lucide-react";
import api from "../services/Apiservices";

// ── SIDEBAR ────────────────────────────────────────────────────────────────
const navItems = [
  { label: "Adoption Requests", icon: Heart, to: "/shelter/adoptions" },
  { label: "Your Pet Listings", icon: List, to: "/shelter/pets" },
  { label: "Messages", icon: MessageSquare, to: "/shelter/messages" },
  { label: "Analytics", icon: BarChart2, to: "/shelter/analytics" },
];

function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="w-52 min-h-screen bg-white flex flex-col border-r border-gray-100 shrink-0">
      <div className="px-5 pt-6 pb-5">
        <button
          onClick={() => navigate("/shelter/pets/add")}
          className="w-full flex items-center justify-center gap-2 bg-[#3182CE] hover:bg-[#2b6cb0] transition-colors text-white text-sm font-medium py-2 px-4 rounded-md"
        >
          <Plus size={15} />
          Add Pet
        </button>
      </div>
      <nav className="flex-1 px-3">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md mb-0.5 text-sm transition-colors ${
                isActive
                  ? "bg-blue-50 text-[#3182CE] font-medium"
                  : "text-gray-500 hover:text-[#3182CE] hover:bg-blue-50"
              }`
            }
          >
            <Icon size={15} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pb-6">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

// ── FORM FIELDS ────────────────────────────────────────────────────────────
function SectionHeader({ title }) {
  return (
    <h2 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-4">
      {title}
    </h2>
  );
}

function InputField({
  label,
  required,
  placeholder,
  type = "text",
  value,
  onChange,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-gray-700">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-[#3182CE] focus:ring-1 focus:ring-[#3182CE]/20 transition-colors bg-white outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  required,
  options,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-gray-700">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <select
        value={value || ""}
        onChange={onChange}
        className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 focus:border-[#3182CE] focus:ring-1 focus:ring-[#3182CE]/20 transition-colors bg-white outline-none cursor-pointer"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function RadioGroup({ label, required, name, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-gray-700">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <div className="flex items-center gap-4">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={String(value) === String(opt.value)}
              onChange={onChange}
              className="w-3.5 h-3.5 accent-[#3182CE]"
            />
            <span className="text-sm text-gray-600">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function BooleanRadio({ label, name, value, onChange }) {
  return (
    <RadioGroup
      label={label}
      name={name}
      options={[
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ]}
      value={value}
      onChange={onChange}
    />
  );
}

function TextareaField({ placeholder, value, onChange, rows = 4 }) {
  return (
    <textarea
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      rows={rows}
      className="border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:border-[#3182CE] focus:ring-1 focus:ring-[#3182CE]/20 transition-colors resize-none bg-white outline-none w-full"
    />
  );
}

// ── OPTIONS ────────────────────────────────────────────────────────────────
const SPECIES_OPTIONS = [
  { value: "Dog", label: "Dog" },
  { value: "Cat", label: "Cat" },
  { value: "Bird", label: "Bird" },
  { value: "Rabbit", label: "Rabbit" },
  { value: "Other", label: "Other" },
];
const STATUS_OPTIONS = [
  { value: "Available", label: "Available" },
  { value: "Reserved", label: "Reserved" },
  { value: "OnHold", label: "On Hold" },
  { value: "Adopted", label: "Adopted" },
];
const STERILIZED_OPTIONS = [
  { value: "not_sterilized", label: "Not sterilized" },
  { value: "neutered", label: "Neutered" },
  { value: "spayed", label: "Spayed" },
];

// ── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function EditPetPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    status: "Available",
    vaccinated: "",
    special_needs: "",
    good_with_kids: "",
    sterilized: "not_sterilized",
    temperament: "",
    adoption_fee: "",
    rescue_story: "",
  });

  // Load existing pet data
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await api.get(`/shelter/pets/${id}`);
        const pet = res.data.data;
        setForm({
          name: pet.name || "",
          species: pet.species || "",
          breed: pet.breed || "",
          age: pet.age || "",
          gender: pet.gender || "",
          status: pet.status || "Available",
          vaccinated: pet.vaccinated !== null ? String(pet.vaccinated) : "",
          special_needs:
            pet.special_needs !== null ? String(pet.special_needs) : "",
          good_with_kids:
            pet.good_with_kids !== null ? String(pet.good_with_kids) : "",
          sterilized: pet.sterilized || "not_sterilized",
          temperament: pet.temperament || "",
          adoption_fee: pet.adoption_fee || "",
          rescue_story: pet.rescue_story || "",
        });
      } catch (error) {
        console.error("Failed to load pet:", error);
        setError("Failed to load pet details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.put(`/shelter/pets/${id}`, form);
      setSuccess("Pet updated successfully!");
      setTimeout(() => navigate("/shelter/pets"), 1500);
    } catch (error) {
      console.error("Failed to update pet:", error);
      setError(error.response?.data?.error || "Failed to update pet");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f5f7fa]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-sm text-gray-400">Loading pet details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f5f7fa]">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-[#1B3A4B] mb-1">
              Edit Pet
            </h1>
            <p className="text-xs text-gray-600">
              Update the details for this pet listing.
            </p>
          </div>

          {/* Success / Error banners */}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* BASIC INFORMATION */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <SectionHeader title="Basic Information" />
              <div className="grid grid-cols-3 gap-4">
                <InputField
                  label="Pet Name"
                  required
                  placeholder="Enter pet name"
                  value={form.name}
                  onChange={set("name")}
                />
                <SelectField
                  label="Species"
                  required
                  placeholder="Select pet species"
                  options={SPECIES_OPTIONS}
                  value={form.species}
                  onChange={set("species")}
                />
                <InputField
                  label="Breed"
                  placeholder="Enter: Breed"
                  value={form.breed}
                  onChange={set("breed")}
                />
                <InputField
                  label="Age"
                  required
                  placeholder="e.g. 3 years"
                  value={form.age}
                  onChange={set("age")}
                />
                <RadioGroup
                  label="Gender"
                  required
                  name="gender"
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                  ]}
                  value={form.gender}
                  onChange={set("gender")}
                />
                <SelectField
                  label="Status"
                  options={STATUS_OPTIONS}
                  value={form.status}
                  onChange={set("status")}
                />
              </div>
            </section>

            {/* HEALTH & TEMPERAMENT */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <SectionHeader title="Health & Temperament" />
              <div className="grid grid-cols-3 gap-4 mb-4">
                <BooleanRadio
                  label="Vaccinated"
                  name="vaccinated"
                  value={form.vaccinated}
                  onChange={set("vaccinated")}
                />
                <BooleanRadio
                  label="Special Needs"
                  name="special_needs"
                  value={form.special_needs}
                  onChange={set("special_needs")}
                />
                <BooleanRadio
                  label="Good with Kids"
                  name="good_with_kids"
                  value={form.good_with_kids}
                  onChange={set("good_with_kids")}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <SelectField
                  label="Sterilized"
                  options={STERILIZED_OPTIONS}
                  value={form.sterilized}
                  onChange={set("sterilized")}
                />
                <InputField
                  label="Temperament"
                  placeholder="e.g. Calm, Playful"
                  value={form.temperament}
                  onChange={set("temperament")}
                />
                <InputField
                  label="Adoption Fee ($)"
                  type="number"
                  placeholder="0.00"
                  value={form.adoption_fee}
                  onChange={set("adoption_fee")}
                />
              </div>
            </section>

            {/* RESCUE STORY */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <SectionHeader title="Rescue Story" />
              <TextareaField
                placeholder="Tell us about their journey..."
                value={form.rescue_story}
                onChange={set("rescue_story")}
                rows={5}
              />
            </section>

            {/* ACTIONS */}
            <div className="flex items-center justify-end gap-3 pb-6">
              <button
                type="button"
                onClick={() => navigate("/shelter/pets")}
                className="px-5 py-2 text-sm text-gray-500 font-medium rounded-md border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-sm font-medium text-white bg-[#3182CE] hover:bg-[#2b6cb0] rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
                <Save size={15} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
