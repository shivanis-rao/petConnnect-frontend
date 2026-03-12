import useLocation from '../../hooks/useLocation';
const PetFilters = ({ filters, onChange }) => {

  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value, page: 1 });
  };

  const handleToggle = (field) => {
    onChange({ ...filters, [field]: !filters[field], page: 1 });
  };

  const handleReset = () => {
    onChange({
      species: '',
      breed: '',
      gender: '',
      vaccinated: undefined,
      special_needs: undefined,
      good_with_kids: undefined,
      age_min: '',
      age_max: '',
      city: '',
      zipcode: '',
      page: 1,
      limit: 9,
      sort: 'newest',
    });
  };
  const { getCity, locLoading, locError } = useLocation();

  return (
    <div className="w-64 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-gray-900">Filters</h2>
        <button
          onClick={handleReset}
          className="text-xs text-blue-600 hover:underline"
        >
          Reset all
        </button>
      </div>

      {/* LOCATION */}
      <div className="mb-5">
       
       
<div className="mb-5">
  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
    Location
  </p>
  <input
    type="text"
    placeholder="City"
    value={filters.city || ''}
    onChange={(e) => handleChange('city', e.target.value)}
    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 mb-2"
  />
  <input
    type="text"
    placeholder="Zipcode"
    value={filters.zipcode || ''}
    onChange={(e) => handleChange('zipcode', e.target.value)}
    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 mb-2"
  />

  <button
    onClick={async () => {
  const result = await getCity();
  if (result) {
    onChange({
      ...filters,
      city: result.city,
      zipcode: result.zipcode,
      page: 1
    });
  }
}}
    disabled={locLoading}
    className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 border border-blue-200 rounded-lg py-2 hover:bg-blue-50 transition-colors disabled:opacity-50"
  >
    {locLoading ? (
      <>
        <span className="animate-spin">⏳</span> Detecting...
      </>
    ) : (
      <>
        📍 Use my location
      </>
    )}
  </button>

  {/* ERROR MESSAGE */}
  {locError && (
    <p className="text-xs text-red-500 mt-1">{locError}</p>
  )}
</div>
      </div>

      {/* SPECIES */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Species
        </p>
        <div className="flex gap-2">
          {['', 'dog', 'cat'].map((s) => (
            <button
              key={s}
              onClick={() => handleChange('species', s)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors duration-150
                ${filters.species === s
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                }`}
            >
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* BREED */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Breed
        </p>
        <input
          type="text"
          placeholder="e.g. Golden Retriever"
          value={filters.breed || ''}
          onChange={(e) => handleChange('breed', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
        />
      </div>

      {/* AGE */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Age (years)
        </p>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={filters.age_min || ''}
            onChange={(e) => handleChange('age_min', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
          <span className="text-gray-400 text-sm">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.age_max || ''}
            onChange={(e) => handleChange('age_max', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {/* GENDER */}
<div className="mb-5">
  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
    Gender
  </p>
  <div className="flex gap-2">
    {[
      { label: 'All', value: '' },
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
    ].map((g) => (
      <button
        key={g.value}
        onClick={() => handleChange('gender', g.value)}
        className={`px-3 py-1 rounded-full text-sm border transition-colors duration-150
          ${filters.gender === g.value
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
          }`}
      >
        {g.label}
      </button>
    ))}
  </div>
</div>

      {/* TOGGLE FILTERS */}
      <div className="space-y-3">

        {/* Vaccinated */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Vaccinated</span>
          <button
            onClick={() => handleToggle('vaccinated')}
            className={`w-10 h-5 rounded-full transition-colors duration-200 relative
              ${filters.vaccinated ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200
              ${filters.vaccinated ? 'left-5' : 'left-0.5'}`}
            />
          </button>
        </div>

        {/* Special Needs */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Special Needs</span>
          <button
            onClick={() => handleToggle('special_needs')}
            className={`w-10 h-5 rounded-full transition-colors duration-200 relative
              ${filters.special_needs ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200
              ${filters.special_needs ? 'left-5' : 'left-0.5'}`}
            />
          </button>
        </div>

        {/* Good with Kids */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Good with Kids</span>
          <button
            onClick={() => handleToggle('good_with_kids')}
            className={`w-10 h-5 rounded-full transition-colors duration-200 relative
              ${filters.good_with_kids ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200
              ${filters.good_with_kids ? 'left-5' : 'left-0.5'}`}
            />
          </button>
        </div>

      </div>
    </div>
  );
};

export default PetFilters;