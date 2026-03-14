const TOTAL_STEPS = 3;

const LIVING_OPTIONS = [
  { val: "alone", label: "I Live Alone", icon: "🧍" },
  { val: "family", label: "With Family", icon: "👨‍👩‍👧" },
  { val: "roommates", label: "House / Roommates", icon: "🏠" },
];

const AGREEMENT_OPTIONS = [
  { val: "yes", label: "Yes, everyone agrees", icon: "✅" },
  { val: "no", label: "No / Not sure", icon: "❌" },
];

const LANDLORD_OPTIONS = [
  { val: "yes", label: "Yes, allowed", icon: "✅" },
  { val: "no", label: "No, not allowed", icon: "🚫" },
  { val: "owner", label: "I Own My Home", icon: "🏡" },
];

const LIVING_LABELS = {
  alone: "Living Alone",
  family: "With Family",
  roommates: "House / Roommates",
};

const LANDLORD_LABELS = {
  yes: "Yes",
  no: "No",
  owner: "I own my home",
};

// ── Sub-components ────────────────────────────────────────────────────────────

const ChoiceButton = ({ value, selected, icon, label, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(value)}
    className={`flex-1 min-w-[110px] flex flex-col items-center gap-1.5 py-4 px-3 rounded-2xl border-2 text-sm font-semibold transition-all duration-150 cursor-pointer
      ${
        selected
          ? "border-sky-500 bg-sky-50 text-sky-600"
          : "border-slate-200 bg-white text-slate-500 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-500"
      }`}
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </button>
);

const ReviewRow = ({ label, val, full }) => (
  <div className={full ? "col-span-2" : ""}>
    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-0.5">
      {label}
    </p>
    <p className="text-sm font-semibold text-slate-700">{val || "—"}</p>
  </div>
);

const StepPills = ({ step, onStepChange }) => (
  <div className="flex gap-2 flex-wrap mb-3">
    {["Your Details", "Living & Lifestyle", "Review & Submit"].map(
      (label, i) => {
        const num = i + 1;
        const isActive = step === num;
        const isDone = step > num;
        return (
          <button
            key={i}
            type="button"
            onClick={() => isDone && onStepChange(num)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border-2 text-sm font-bold transition-all duration-200
            ${
              isActive
                ? "bg-sky-500 border-sky-500 text-white cursor-default"
                : isDone
                  ? "bg-emerald-50 border-emerald-400 text-emerald-600 cursor-pointer hover:brightness-95"
                  : "bg-white border-slate-200 text-slate-400 cursor-default"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-extrabold
            ${
              isActive
                ? "bg-white/25 text-white"
                : isDone
                  ? "bg-emerald-400 text-white"
                  : "bg-slate-100 text-slate-400"
            }`}
            >
              {isDone ? "✓" : num}
            </span>
            <span>{label}</span>
          </button>
        );
      },
    )}
  </div>
);

const PetBanner = ({ pet }) => (
  <div className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm mb-6">
    <img
      src={pet?.photo_url || "https://placehold.co/64x64?text=🐾"}
      alt={pet?.name}
      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
    />
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold tracking-widest text-sky-500 uppercase mb-0.5">
        Applying For
      </p>
      <h2 className="text-lg font-extrabold text-slate-800 mb-0.5">
        {pet?.name}
      </h2>
      <p className="text-sm text-slate-400">
        {pet?.breed} • {pet?.age} {pet?.age === 1 ? "Year" : "Years"} Old
      </p>
    </div>
    {pet?.adoption_fee && (
      <div className="ml-auto text-right flex-shrink-0">
        <span className="block text-xl font-extrabold text-sky-500">
          ₹{pet.adoption_fee}
        </span>
        <span className="text-xs text-slate-400">Adoption Fee</span>
      </div>
    )}
  </div>
);

const InputWrap = ({ locked, children }) => (
  <div
    className={`rounded-xl border-2 overflow-hidden transition-all duration-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100
    ${locked ? "bg-slate-50 border-dashed border-slate-200" : "bg-white border-slate-200"}`}
  >
    {children}
  </div>
);

const inputClass =
  "w-full bg-transparent border-none outline-none px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-300 resize-none";

// ── Step 1 ────────────────────────────────────────────────────────────────────

const Step1PersonalDetails = ({ form, set, onNext }) => {
  const isValid =
    form.name &&
    form.phone &&
    form.email &&
    form.current_occupation &&
    form.address;

  return (
    <div className="p-7 animate-fadeUp">
      <h3 className="text-lg font-extrabold text-slate-800 mb-1">
        Your Details
      </h3>
      <p className="text-sm text-slate-400 mb-5">
        Pre-filled from your profile — verify before continuing.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600">Full Name</label>
          <InputWrap locked>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Your full name"
            />
          </InputWrap>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600">
            Phone Number
          </label>
          <InputWrap>
            <input
              className={inputClass}
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+91 XXXXX XXXXX"
            />
          </InputWrap>
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600">
            Email Address
          </label>
          <InputWrap locked>
            <input
              className={inputClass}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@example.com"
            />
          </InputWrap>
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600">
            Past Pet Experience (years)
          </label>
          <InputWrap>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.past_pet_experience}
              onChange={(e) => set("past_pet_experience", e.target.value)}
              placeholder="0"
            />
          </InputWrap>
          <span className="text-[11px] text-slate-400 font-semibold">
            Total years you've owned or cared for pets
          </span>
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600">
            Current Occupation
          </label>
          <InputWrap>
            <input
              className={inputClass}
              value={form.current_occupation}
              onChange={(e) => set("current_occupation", e.target.value)}
              placeholder="e.g. Software Engineer, Student, Freelancer…"
            />
          </InputWrap>
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600">
            Home Address
          </label>
          <InputWrap>
            <textarea
              rows={2}
              className={inputClass}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Street, City, State, PIN"
            />
          </InputWrap>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="bg-sky-500 hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-7 py-3 rounded-full text-sm shadow-md shadow-sky-200 transition-all duration-200 hover:-translate-y-0.5"
        >
          Continue →
        </button>
      </div>
    </div>
  );
};

// ── Step 2 ────────────────────────────────────────────────────────────────────

const Step2Lifestyle = ({ form, set, onBack, onNext }) => {
  const showFamilyAgreement =
    form.living_situation === "family" || form.living_situation === "roommates";
  const isValid =
    form.living_situation && form.landlord_permission && form.vacation_care;

  return (
    <div className="p-7 animate-fadeUp">
      <h3 className="text-lg font-extrabold text-slate-800 mb-1">
        Living & Lifestyle
      </h3>
      <p className="text-sm text-slate-400 mb-6">
        Help the shelter understand your home environment.
      </p>

      <div className="flex flex-col gap-1.5 mb-5">
        <label className="text-xs font-bold text-slate-600">
          Are you living alone or with others?
        </label>
        <div className="flex gap-2 flex-wrap mt-1">
          {LIVING_OPTIONS.map(({ val, label, icon }) => (
            <ChoiceButton
              key={val}
              value={val}
              label={label}
              icon={icon}
              selected={form.living_situation === val}
              onClick={(v) => set("living_situation", v)}
            />
          ))}
        </div>
      </div>

      {showFamilyAgreement && (
        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-xs font-bold text-slate-600">
            Are all your family / housemates in agreement to adopt a pet?
          </label>
          <div className="flex gap-2 flex-wrap mt-1">
            {AGREEMENT_OPTIONS.map(({ val, label, icon }) => (
              <ChoiceButton
                key={val}
                value={val}
                label={label}
                icon={icon}
                selected={form.family_agreement === val}
                onClick={(v) => set("family_agreement", v)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5 mb-5">
        <label className="text-xs font-bold text-slate-600">
          If you're in a rented place, does your landlord allow pets?
        </label>
        <div className="flex gap-2 flex-wrap mt-1">
          {LANDLORD_OPTIONS.map(({ val, label, icon }) => (
            <ChoiceButton
              key={val}
              value={val}
              label={label}
              icon={icon}
              selected={form.landlord_permission === val}
              onClick={(v) => set("landlord_permission", v)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-600">
          Who will take care of your pet when you travel or go on vacation?
        </label>
        <InputWrap>
          <textarea
            rows={3}
            className={inputClass}
            value={form.vacation_care}
            onChange={(e) => set("vacation_care", e.target.value)}
            placeholder="e.g. My parents will look after the pet, or I'll use a pet boarding service…"
          />
        </InputWrap>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={onBack}
          className="border-2 border-slate-200 text-slate-500 hover:border-sky-400 hover:text-sky-500 font-semibold px-6 py-2.5 rounded-full text-sm transition-all duration-200"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="bg-sky-500 hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-7 py-3 rounded-full text-sm shadow-md shadow-sky-200 transition-all duration-200 hover:-translate-y-0.5"
        >
          Review Application →
        </button>
      </div>
    </div>
  );
};

// ── Step 3 ────────────────────────────────────────────────────────────────────

const Step3Review = ({ form, error, submitting, onBack, onSubmit }) => (
  <div className="p-7 animate-fadeUp">
    <h3 className="text-lg font-extrabold text-slate-800 mb-1">
      Review & Submit
    </h3>
    <p className="text-sm text-slate-400 mb-5">
      Double-check your answers before submitting.
    </p>

    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-4">
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-4">
        Your Details
      </p>
      <div className="grid grid-cols-2 gap-3">
        <ReviewRow label="Name" val={form.name} />
        <ReviewRow label="Phone" val={form.phone} />
        <ReviewRow label="Email" val={form.email} full />
        <ReviewRow
          label="Pet Experience"
          val={`${form.past_pet_experience || 0} year(s)`}
        />
        <ReviewRow label="Occupation" val={form.current_occupation} />
        <ReviewRow label="Address" val={form.address} full />
      </div>
    </div>

    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-4">
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-4">
        Lifestyle
      </p>
      <div className="grid grid-cols-2 gap-3">
        <ReviewRow
          label="Living Situation"
          val={LIVING_LABELS[form.living_situation] || "—"}
        />
        {form.family_agreement && (
          <ReviewRow
            label="Family Agreement"
            val={form.family_agreement === "yes" ? "Yes" : "No"}
          />
        )}
        <ReviewRow
          label="Landlord Allows Pets"
          val={LANDLORD_LABELS[form.landlord_permission] || "—"}
        />
        <ReviewRow label="Vacation Pet Care" val={form.vacation_care} full />
      </div>
    </div>

    <div className="flex items-start gap-3 border-2 border-slate-200 rounded-xl p-4 mb-5">
      <span className="text-lg flex-shrink-0 mt-0.5">📋</span>
      <p className="text-sm text-slate-500 leading-relaxed">
        I certify that the information provided is true and I understand that a
        home visit might be required as part of the adoption process.
      </p>
    </div>

    {error && (
      <div className="bg-red-50 text-red-500 text-sm font-bold rounded-xl px-4 py-3 mb-4">
        {error}
      </div>
    )}

    <div className="flex justify-between items-center mt-2">
      <button
        type="button"
        onClick={onBack}
        className="border-2 border-slate-200 text-slate-500 hover:border-sky-400 hover:text-sky-500 font-semibold px-6 py-2.5 rounded-full text-sm transition-all duration-200"
      >
        ← Edit
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full text-sm shadow-md shadow-sky-200 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
      >
        {submitting ? (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
        ) : (
          <>Submit Application ▷</>
        )}
      </button>
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

const AdoptionApplicationForm = ({
  pet,
  loading,
  submitting,
  submitted,
  error,
  step,
  form,
  onFieldChange,
  onStepChange,
  onSubmit,
  onBack,
  onViewApplications,
  onBackToBrowse,
}) => {
  const set = (field, value) => onFieldChange(field, value);
  const progress = (step / TOTAL_STEPS) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-3">
        <div className="text-5xl animate-spin">🐾</div>
        <p className="text-sm text-slate-400 font-semibold">
          Loading application…
        </p>
      </div>
    );
  }

  if (error && !pet) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-500 font-bold bg-red-50 px-4 py-2 rounded-xl">
          {error}
        </p>
        <button
          onClick={onBackToBrowse}
          className="text-sm text-slate-500 hover:text-sky-500 font-semibold transition-colors"
        >
          ← Back to Browse
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-12 text-center max-w-md shadow-xl shadow-slate-200">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
            Application Submitted!
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Your application to adopt{" "}
            <strong className="text-slate-700">{pet?.name}</strong> has been
            received. The shelter will reach out to you soon.
          </p>
          <button
            onClick={onViewApplications}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-3 rounded-full text-sm shadow-md shadow-sky-200 transition-all duration-200"
          >
            View My Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-2xl mx-auto px-5 py-8 pb-20">
        <div className="mb-5">
          <button
            onClick={onBack}
            className="text-sm text-slate-400 hover:text-sky-500 font-semibold transition-colors mb-2 flex items-center gap-1"
          >
            ← Back to {pet?.name}'s Profile
          </button>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Adoption Form
          </h1>
        </div>

        <PetBanner pet={pet} />

        <StepPills step={step} onStepChange={onStepChange} />

        {/* Progress bar */}
        <div className="h-1 bg-slate-200 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-sky-500 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200 overflow-hidden">
          {step === 1 && (
            <Step1PersonalDetails
              form={form}
              set={set}
              onNext={() => onStepChange(2)}
            />
          )}
          {step === 2 && (
            <Step2Lifestyle
              form={form}
              set={set}
              onBack={() => onStepChange(1)}
              onNext={() => onStepChange(3)}
            />
          )}
          {step === 3 && (
            <Step3Review
              form={form}
              error={error}
              submitting={submitting}
              onBack={() => onStepChange(2)}
              onSubmit={onSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdoptionApplicationForm;
