import { useState, useEffect } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import {
  MoreHorizontal, MapPin, Clock, ChevronDown,
  FileText, Heart, Plus, List, MessageSquare,
  BarChart2, LogOut, PawPrint
} from 'lucide-react'
import api from '../services/Apiservices'

// ── SIDEBAR ────────────────────────────────────────────────────────────────
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

// ── STAT CARD ──────────────────────────────────────────────────────────────
function StatCard({ label, value, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between flex-1 min-w-0">
      <div>
        <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">{label}</p>
        <p className="text-3xl font-bold text-[#1B3A4B]">{value ?? 0}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

// ── GENDER BADGE ───────────────────────────────────────────────────────────
function GenderBadge({ gender }) {
  const isMale = gender === 'Male'
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isMale ? 'bg-[#3182CE] text-white' : 'bg-[#E8727A] text-white'}`}>
      {gender?.toUpperCase()}
    </span>
  )
}

// ── PET CARD ───────────────────────────────────────────────────────────────
function PetCard({ pet, onEdit, onDelete, onMarkAdopted }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="relative">
        {pet.image_url ? (
          <img src={pet.image_url} alt={pet.name} className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <PawPrint size={32} className="text-gray-300" />
          </div>
        )}
        <div className="absolute top-2.5 right-2.5">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50"
          >
            <MoreHorizontal size={14} className="text-gray-500" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-lg shadow-lg z-10 min-w-[130px] py-1">
              <button onClick={() => { onEdit(pet); setMenuOpen(false) }} className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">Edit Details</button>
              <button onClick={() => { onMarkAdopted(pet.id); setMenuOpen(false) }} className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">Mark Adopted</button>
              <button onClick={() => { onDelete(pet.id); setMenuOpen(false) }} className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-gray-50">Delete</button>
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-semibold text-[#1B3A4B]">{pet.name}</h3>
          <GenderBadge gender={pet.gender} />
        </div>
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={11} className="text-gray-400" />{pet.breed || pet.species || '—'}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={11} className="text-gray-400" />{pet.age ? `${pet.age} Weeks Old` : '—'}
          </div>
        </div>
        <button
          onClick={() => onEdit(pet)}
          className="w-full border border-gray-200 rounded-md py-1.5 text-xs text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          Edit Details
        </button>
      </div>
    </div>
  )
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function NgoDashboard() {
  const navigate = useNavigate()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [speciesFilter, setSpeciesFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('Available')
  const [page, setPage] = useState(1)
  const [totalPets, setTotalPets] = useState(0)
  const [stats, setStats] = useState({ activeListings: 0, pendingRequests: 0, totalAdoptions: 0 })
  const limit = 9

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true)
      try {
        const res = await api.get('/shelter/pets')
        const allPets = res.data.data || []
        setStats({
          activeListings: allPets.filter(p => p.status === 'Available').length,
          pendingRequests: allPets.filter(p => p.status === 'Reserved' || p.status === 'OnHold').length,
          totalAdoptions: allPets.filter(p => p.status === 'Adopted').length,
        })
        let filtered = allPets
        if (speciesFilter) filtered = filtered.filter(p => p.species === speciesFilter)
        if (statusFilter) filtered = filtered.filter(p => p.status === statusFilter)
        setTotalPets(filtered.length)
        const start = (page - 1) * limit
        setPets(filtered.slice(start, start + limit))
      } catch {
        setPets([])
      } finally {
        setLoading(false)
      }
    }
    fetchPets()
  }, [speciesFilter, statusFilter, page])

  const handleEdit = (pet) => navigate(`/shelter/pets/${pet.id}/edit`)

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return
    try {
      await api.del(`/shelter/pets/${id}`)
      setPets(prev => prev.filter(p => p.id !== id))
      setTotalPets(prev => prev - 1)
    } catch(error) {
        console.error('Failed to delete pet:', error)
        alert('Failed to delete pet. Please try again.')
    }
  }

  const handleMarkAdopted = async (id) => {
    try {
      await api.put(`/shelter/pets/${id}/status`, { status: 'Adopted' })
      setPets(prev => prev.map(p => p.id === id ? { ...p, status: 'Adopted' } : p))
    } catch(error) {
        console.error('Failed to update pet status:', error)
        alert('Failed to update status. Please try again.')
    }
  }

  const totalPages = Math.ceil(totalPets / limit)

  // Get user name from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userName = user?.name || 'there'

  return (
    <div className="flex min-h-screen bg-[#f5f7fa]">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-[#1B3A4B] mb-0.5">Manage your shelter with ease</h1>
            <p className="text-xs text-gray-500">Welcome back, {userName}. Here's what's happening today.</p>
          </div>

          {/* KPI Cards */}
          <div className="flex gap-4 mb-8">
            <StatCard label="Active Listings" value={stats.activeListings}>
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText size={16} className="text-blue-400" />
              </div>
            </StatCard>
            <StatCard label="Pending Requests" value={stats.pendingRequests}>
              <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-orange-400 rounded-sm" />
              </div>
            </StatCard>
            <StatCard label="Total Adoptions" value={stats.totalAdoptions}>
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                <Heart size={16} className="text-green-500 fill-green-500" />
              </div>
            </StatCard>
          </div>

          {/* Listings Header + Filters */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#1B3A4B]">My Pet Listings</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select value={speciesFilter} onChange={e => { setSpeciesFilter(e.target.value); setPage(1) }}
                  className="appearance-none bg-white border border-gray-200 rounded-md pl-3 pr-7 py-1.5 text-xs text-gray-600 focus:outline-none cursor-pointer">
                  <option value="">All Pets</option>
                  <option value="Dog">Dogs</option>
                  <option value="Cat">Cats</option>
                  <option value="Bird">Birds</option>
                  <option value="Rabbit">Rabbits</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
                  className="appearance-none bg-white border border-gray-200 rounded-md pl-3 pr-7 py-1.5 text-xs text-gray-600 focus:outline-none cursor-pointer">
                  <option value="">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Adopted">Adopted</option>
                  <option value="OnHold">On Hold</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl border border-gray-100 h-64 animate-pulse" />)}
            </div>
          )}

          {/* Empty State */}
          {!loading && pets.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-16 text-center mb-6">
              <PawPrint size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-400 mb-1">No pets listed yet</p>
              <p className="text-xs text-gray-300 mb-4">Start by adding your first pet listing</p>
              <button
                onClick={() => navigate('/shelter/pets/add')}
                className="px-4 py-2 bg-[#3182CE] text-white text-xs font-medium rounded-md hover:bg-[#2b6cb0] transition-colors"
              >
                + Add Your First Pet
              </button>
            </div>
          )}

          {/* Pet Grid */}
          {!loading && pets.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {pets.map(pet => (
                <PetCard key={pet.id} pet={pet} onEdit={handleEdit} onDelete={handleDelete} onMarkAdopted={handleMarkAdopted} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPets > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">Showing {pets.length} of {totalPets} listings</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-1.5 text-xs border border-gray-200 rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-4 py-1.5 text-xs border border-gray-200 rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}