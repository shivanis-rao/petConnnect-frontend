import { useState } from 'react'
import api from '../services/Apiservices'
import { useNavigate, NavLink } from 'react-router-dom'
import { PlusCircle, Heart, List, MessageSquare, BarChart2, LogOut, Plus, Image, FileText, X } from 'lucide-react'

// ── SIDEBAR ────────────────────────────────────────────────────────
const navItems = [
  { label: 'Adoption Requests', icon: Heart, to: '/shelter/adoptions' },
  { label: 'Your Pet Listings', icon: List, to: '/shelter/pets' },
  { label: 'Messages', icon: MessageSquare, to: '/shelter/messages' },
  { label: 'Analytics', icon: BarChart2, to: '/shelter/analytics' },
]

function Sidebar() {
  const navigate = useNavigate()
  return (
    <aside className="w-52 min-h-screen bg-white flex flex-col border-r border-gray-100 shrink-0">
      <div className="px-5 pt-6 pb-5">
        <button
          onClick={() => navigate('/shelter/pets/add')}
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
                  ? 'bg-blue-50 text-[#3182CE] font-medium'
                  : 'text-gray-500 hover:text-[#3182CE] hover:bg-blue-50'
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
  )
}

// ── FORM FIELDS ────────────────────────────────────────────────────
function SectionHeader({ title }) {
  return <h2 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-4">{title}</h2>
}

function InputField({ label, required, placeholder, type = 'text', value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-700">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-[#3B6B8A] focus:ring-1 focus:ring-[#3B6B8A]/20 transition-colors bg-white outline-none" />
    </div>
  )
}

function SelectField({ label, required, options, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-700">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>}
      <select value={value} onChange={onChange}
        className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 focus:border-[#3B6B8A] focus:ring-1 focus:ring-[#3B6B8A]/20 transition-colors bg-white outline-none cursor-pointer">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  )
}

function RadioGroup({ label, required, name, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-gray-700">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>}
      <div className="flex items-center gap-4">
        {options.map(opt => (
          <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={onChange} className="w-3.5 h-3.5 accent-[#3B6B8A]" />
            <span className="text-sm text-gray-600">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function BooleanRadio({ label, name, value, onChange }) {
  return (
    <RadioGroup label={label} name={name}
      options={[{ value: 'true', label: 'True' }, { value: 'false', label: 'False' }]}
      value={value} onChange={onChange} />
  )
}

function TextareaField({ placeholder, value, onChange, rows = 4 }) {
  return (
    <textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows}
      className="border border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:border-[#3B6B8A] focus:ring-1 focus:ring-[#3B6B8A]/20 transition-colors resize-none bg-white outline-none w-full" />
  )
}

// ── PHOTO UPLOAD ───────────────────────────────────────────────────
function PhotoSlot({ label, file, onUpload, onRemove }) {

  return (
    <div onClick={() => document.getElementById(`photo-${label}`).click()}
      className="relative border-2 border-dashed border-gray-200 rounded-lg h-28 flex flex-col items-center justify-center cursor-pointer hover:border-[#3B6B8A]/40 transition-all bg-gray-50">
      {file ? (
        <>
          <img src={URL.createObjectURL(file)} alt={label} className="w-full h-full object-cover rounded-lg" />
          <button type="button" onClick={(e) => { e.stopPropagation(); onRemove() }}
            className="absolute top-1.5 right-1.5 bg-white rounded-full p-0.5 shadow-sm">
            <X size={12} className="text-red-400" />
          </button>
        </>
      ) : (
        <>
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center mb-2">
            <Image size={16} className="text-gray-300" />
          </div>
          <span className="text-xs text-gray-300 font-medium">{label}</span>
        </>
      )}
      <input id={`photo-${label}`} type="file" accept="image/*" className="hidden"
        onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])} />
    </div>
  )
}

// ── DOCUMENT UPLOAD ────────────────────────────────────────────────
function DocumentUpload({ id, file, onUpload, onRemove }) {
  return (
    <div onClick={() => document.getElementById(id).click()}
      className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#3B6B8A]/40 transition-all bg-gray-50 min-h-[100px] relative">
      {file ? (
        <>
          <FileText size={22} className="text-[#3B6B8A]" />
          <span className="text-xs text-gray-500 text-center break-all max-w-full px-2 mt-1">{file.name}</span>
          <button type="button" onClick={(e) => { e.stopPropagation(); onRemove() }}
            className="absolute top-2 right-2 bg-white rounded-full p-0.5 shadow-sm">
            <X size={11} className="text-red-400" />
          </button>
        </>
      ) : (
        <>
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-1.5">
            <FileText size={15} className="text-gray-300" />
          </div>
          <span className="text-xs text-gray-400 font-medium">UPLOAD PDF/PNG</span>
          <span className="text-xs text-gray-300 mt-0.5">Max file size 5MB</span>
        </>
      )}
      <input id={id} type="file" accept=".pdf,image/png" className="hidden"
        onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])} />
    </div>
  )
}

// ── OPTIONS ────────────────────────────────────────────────────────
const SPECIES_OPTIONS = [
  { value: 'Dog', label: 'Dog' }, { value: 'Cat', label: 'Cat' },
  { value: 'Bird', label: 'Bird' }, { value: 'Rabbit', label: 'Rabbit' },
  { value: 'Other', label: 'Other' },
]
const STATUS_OPTIONS = [
  { value: 'Available', label: 'Available' }, { value: 'Reserved', label: 'Reserved' },
  { value: 'OnHold', label: 'On Hold' }, { value: 'Adopted', label: 'Adopted' },
]
const STERILIZED_OPTIONS = [
  { value: 'not_sterilized', label: 'Not sterilized' },
  { value: 'neutered', label: 'Neutered' }, { value: 'spayed', label: 'Spayed' },
]

// ── MAIN PAGE ──────────────────────────────────────────────────────
export default function AddPetPage() {
  const navigate = useNavigate()
  const [photos, setPhotos] = useState({ main: null, side: null, activity: null })
  const [docs, setDocs] = useState({ health: null, vaccination: null })
  const [form, setForm] = useState({
    name: '', species: '', breed: '', age: '', gender: '', status: 'Available',
    vaccinated: '', special_needs: '', good_with_kids: '',
    sterilized: 'not_sterilized', temperament: '', adoption_fee: '', rescue_story: '',
  })

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/shelter/pets', form)
      navigate('/shelter/pets')
    } catch (error) {
      console.error('Failed to create pet:', error)
      alert(error.response?.data?.error || 'Failed to create pet')
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f5f7fa]">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-[#1B3A4B] mb-1">Add New Pet</h1>
            <p className="text-xs text-gray-600">Fill in the details to list a new pet for adoption.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* PET PHOTOS */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <SectionHeader title="Pet Photos" />
              <p className="text-xs text-gray-400 mb-3">Upload up to 3 images. Accepted formats: JPG, PNG, max size 5MB</p>
              <div className="grid grid-cols-3 gap-3">
                {[['main', 'MAIN PHOTO'], ['side', 'SIDE VIEW'], ['activity', 'ACTIVITY PHOTO']].map(([key, label]) => (
                  <PhotoSlot key={key} label={label} file={photos[key]}
                    onUpload={(f) => setPhotos(p => ({ ...p, [key]: f }))}
                    onRemove={() => setPhotos(p => ({ ...p, [key]: null }))} />
                ))}
              </div>
            </section>

            {/* BASIC INFORMATION */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <SectionHeader title="Basic Information" />
              <div className="grid grid-cols-3 gap-4">
                <InputField label="Pet Name" required placeholder="Enter pet name" value={form.name} onChange={set('name')} />
                <SelectField label="Species" required placeholder="Select pet species" options={SPECIES_OPTIONS} value={form.species} onChange={set('species')} />
                <InputField label="Breed" placeholder="Enter: Breed" value={form.breed} onChange={set('breed')} />
                <InputField label="Age" required placeholder="e.g. 3" type="number" value={form.age} onChange={set('age')} />
                <RadioGroup label="Gender" required name="gender"
                  options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]}
                  value={form.gender} onChange={set('gender')} />
                <SelectField label="Status" options={STATUS_OPTIONS} value={form.status} onChange={set('status')} />
              </div>
            </section>

            {/* HEALTH & TEMPERAMENT */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <SectionHeader title="Health & Temperament" />
              <div className="grid grid-cols-3 gap-4 mb-4">
                <BooleanRadio label="Vaccinated" name="vaccinated" value={form.vaccinated} onChange={set('vaccinated')} />
                <BooleanRadio label="Special Needs" name="special_needs" value={form.special_needs} onChange={set('special_needs')} />
                <BooleanRadio label="Good with Kids" name="good_with_kids" value={form.good_with_kids} onChange={set('good_with_kids')} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <SelectField label="Sterilized" options={STERILIZED_OPTIONS} value={form.sterilized} onChange={set('sterilized')} />
                <InputField label="Temperament" placeholder="e.g. Calm, Playful" value={form.temperament} onChange={set('temperament')} />
                <InputField label="Adoption Fee (₹)" type="number" placeholder="0" value={form.adoption_fee} onChange={set('adoption_fee')} />
              </div>
            </section>

            {/* STORY & DOCUMENTS */}
            <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="grid grid-cols-3 gap-5">
                <div>
                  <SectionHeader title="Rescue Story" />
                  <TextareaField placeholder="Tell us about their journey..." value={form.rescue_story} onChange={set('rescue_story')} rows={5} />
                </div>
                <div>
                  <SectionHeader title="Health Records" />
                  <DocumentUpload id="doc-health" file={docs.health}
                    onUpload={(f) => setDocs(p => ({ ...p, health: f }))}
                    onRemove={() => setDocs(p => ({ ...p, health: null }))} />
                </div>
                <div>
                  <SectionHeader title="Vaccination Proof" />
                  <DocumentUpload id="doc-vaccination" file={docs.vaccination}
                    onUpload={(f) => setDocs(p => ({ ...p, vaccination: f }))}
                    onRemove={() => setDocs(p => ({ ...p, vaccination: null }))} />
                </div>
              </div>
            </section>

            {/* ACTIONS */}
            <div className="flex items-center justify-end gap-3 pb-6">
              <button type="button" onClick={() => navigate(-1)}
                className="px-5 py-2 text-sm text-gray-500 font-medium rounded-md border border-gray-200 bg-white hover:border-gray-300 transition-colors">
                CANCEL
              </button>
              <button type="submit"
                className="px-5 py-2 text-sm font-medium text-white bg-[#3182CE] hover:bg-[#2D5470] rounded-md flex items-center gap-2 transition-colors">
                Add New Pet
                <PlusCircle size={15} />
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}