import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'
import PhotoUpload from '../components/shelter/PhotoUpload'
import DocumentUpload from '../components/shelter/DocumentUpload'
import {
  InputField,
  SelectField,
  RadioGroup,
  BooleanRadio,
  TextareaField,
  SectionHeader,
} from '../components/ui/FormFields'
import api from '../services/Apiservices'

const SPECIES_OPTIONS = [
  { value: 'Dog', label: 'Dog' },
  { value: 'Cat', label: 'Cat' },
  { value: 'Bird', label: 'Bird' },
  { value: 'Rabbit', label: 'Rabbit' },
  { value: 'Other', label: 'Other' },
]

const STATUS_OPTIONS = [
  { value: 'Available', label: 'Available' },
  { value: 'Reserved', label: 'Reserved' },
  { value: 'OnHold', label: 'On Hold' },
  { value: 'Adopted', label: 'Adopted' },
]

const STERILIZED_OPTIONS = [
  { value: 'not_sterilized', label: 'Not sterilized' },
  { value: 'neutered', label: 'Neutered' },
  { value: 'spayed', label: 'Spayed' },
]

export default function AddPetPage() {
  const navigate = useNavigate()
  const [photos, setPhotos] = useState({ main: null, side: null, activity: null })
  const [docs, setDocs] = useState({ health: null, vaccination: null })
  const [form, setForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    status: 'Available',
    vaccinated: '',
    special_needs: '',
    good_with_kids: '',
    sterilized: 'not_sterilized',
    temperament: '',
    adoption_fee: '',
    rescue_story: '',
  })

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/shelter/pets', form)
      navigate('/shelter/pets')
    } catch (error) {
      console.error('Failed to create pet:', error)
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#1B3A4B] mb-1">Add New Pet</h1>
        <p className="text-xs text-gray-400">Fill in the details to list a new pet for adoption.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* PET PHOTOS */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <SectionHeader title="Pet Photos" />
          <PhotoUpload photos={photos} onUpdate={setPhotos} />
        </section>

        {/* BASIC INFORMATION */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <SectionHeader title="Basic Information" />
          <div className="grid grid-cols-3 gap-4">
            <InputField label="Pet Name" required placeholder="Enter pet name" value={form.name} onChange={set('name')} />
            <SelectField label="Species" required placeholder="Select pet species" options={SPECIES_OPTIONS} value={form.species} onChange={set('species')} />
            <InputField label="Breed" placeholder="Enter: Breed" value={form.breed} onChange={set('breed')} />
            <InputField label="Age" required placeholder="e.g. 3 years" value={form.age} onChange={set('age')} />
            <RadioGroup
              label="Gender"
              required
              name="gender"
              options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }]}
              value={form.gender}
              onChange={set('gender')}
            />
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
            <InputField label="Adoption Fee ($)" type="number" placeholder="0.00" value={form.adoption_fee} onChange={set('adoption_fee')} />
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
              <DocumentUpload
                file={docs.health}
                onUpload={(file) => setDocs(prev => ({ ...prev, health: file }))}
                onRemove={() => setDocs(prev => ({ ...prev, health: null }))}
              />
            </div>
            <div>
              <SectionHeader title="Vaccination Proof" />
              <DocumentUpload
                file={docs.vaccination}
                onUpload={(file) => setDocs(prev => ({ ...prev, vaccination: file }))}
                onRemove={() => setDocs(prev => ({ ...prev, vaccination: null }))}
              />
            </div>
          </div>
        </section>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 text-sm text-gray-500 font-medium rounded-md border border-gray-200 bg-white hover:border-gray-300 transition-colors"
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-medium text-white bg-[#3B6B8A] hover:bg-[#2D5470] rounded-md flex items-center gap-2 transition-colors"
          >
            Add New Pet
            <PlusCircle size={15} />
          </button>
        </div>
      </form>
    </div>
  )
}