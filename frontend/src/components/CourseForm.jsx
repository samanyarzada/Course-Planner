import { useState } from "react";

const emptyForm = {
  title: "",
  subject: "coding",
  trainer: "",
  feeAFN: "",
  weeklyHours: "",
  seats: "",
  slotIds: "",
  description: "",
};

// Valid slot example: MON-09
const SLOT_PATTERN = /^(MON|TUE|WED|THU|FRI|SAT)-\d{2}$/;

// Shared style for all inputs
const inputClass =
  "w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2";

// Small helper component: label + input + hint + error message
function Field({ label, hint, error, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : (
        hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>
      )}
    </div>
  );
}

// Used for both creating (initialData = null) and editing a course
function CourseForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(
    initialData ? { ...initialData, slotIds: initialData.slotIds.join(", ") } : emptyForm
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Red border if the field has an error, normal border if not
  const fieldClass = (name) =>
    `${inputClass} ${
      errors[name]
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
    }`;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.trainer.trim()) newErrors.trainer = "Trainer is required.";

    // Fee must be a positive number
    const fee = Number(form.feeAFN);
    if (String(form.feeAFN).trim() === "" || isNaN(fee) || fee <= 0) {
      newErrors.feeAFN = "Fee must be a positive number.";
    }

    // Weekly hours must be a positive number
    const hours = Number(form.weeklyHours);
    if (String(form.weeklyHours).trim() === "" || isNaN(hours) || hours <= 0) {
      newErrors.weeklyHours = "Weekly hours must be a positive number.";
    }

    // Seats must be a whole number (0 or more)
    const seats = Number(form.seats);
    if (String(form.seats).trim() === "" || !Number.isInteger(seats) || seats < 0) {
      newErrors.seats = "Seats must be a whole number (0 or more).";
    }

    // Slots: "MON-09, WED-09" -> ["MON-09", "WED-09"]
    const slots = form.slotIds
      .split(",")
      .map((slot) => slot.trim().toUpperCase())
      .filter((slot) => slot !== "");
    if (slots.length === 0) {
      newErrors.slotIds = "Add at least one slot.";
    } else if (slots.some((slot) => !SLOT_PATTERN.test(slot))) {
      newErrors.slotIds = "Use the format MON-09, separated by commas.";
    }

    if (!form.description.trim()) newErrors.description = "Description is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({
      id: initialData ? initialData.id : undefined,
      title: form.title.trim(),
      subject: form.subject,
      trainer: form.trainer.trim(),
      feeAFN: fee,
      weeklyHours: hours,
      seats: seats,
      slotIds: [...new Set(slots)],
      description: form.description.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Form header */}
      <div
        className={`px-6 py-4 text-white ${
          initialData
            ? "bg-linear-to-r from-amber-500 to-orange-500"
            : "bg-linear-to-r from-blue-600 to-indigo-600"
        }`}
      >
        <h2 className="text-lg font-bold">
          {initialData ? `✏️ Edit course: ${initialData.title}` : "➕ Add new course"}
        </h2>
        <p className="text-sm text-white/80">
          {initialData ? "Change the fields and save." : "Fill in the details of the new course."}
        </p>
      </div>

      <div className="space-y-5 p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title" error={errors.title}>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Example: CSS Basics"
              className={fieldClass("title")}
            />
          </Field>

          <Field label="Subject">
            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className={fieldClass("subject")}
            >
              <option value="coding">💻 Coding</option>
              <option value="office skills">📊 Office skills</option>
              <option value="design">🎨 Design</option>
            </select>
          </Field>

          <Field label="Trainer" error={errors.trainer}>
            <input
              name="trainer"
              value={form.trainer}
              onChange={handleChange}
              placeholder="Trainer name"
              className={fieldClass("trainer")}
            />
          </Field>

          <Field label="Fee (AFN)" hint="Must be more than 0." error={errors.feeAFN}>
            <input
              type="number"
              name="feeAFN"
              value={form.feeAFN}
              onChange={handleChange}
              placeholder="Example: 2000"
              className={fieldClass("feeAFN")}
            />
          </Field>

          <Field label="Weekly hours" hint="Must be more than 0." error={errors.weeklyHours}>
            <input
              type="number"
              name="weeklyHours"
              value={form.weeklyHours}
              onChange={handleChange}
              placeholder="Example: 6"
              className={fieldClass("weeklyHours")}
            />
          </Field>

          <Field label="Seats" hint="Whole number. Use 0 for a full course." error={errors.seats}>
            <input
              type="number"
              name="seats"
              value={form.seats}
              onChange={handleChange}
              placeholder="Example: 10"
              className={fieldClass("seats")}
            />
          </Field>
        </div>

        <Field
          label="Meeting slots"
          hint="Day and hour, separated by commas. Days: MON TUE WED THU FRI SAT."
          error={errors.slotIds}
        >
          <input
            name="slotIds"
            value={form.slotIds}
            onChange={handleChange}
            placeholder="MON-09, WED-09"
            className={fieldClass("slotIds")}
          />
        </Field>

        <Field label="Description" error={errors.description}>
          <textarea
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
            placeholder="What will learners study in this course?"
            className={fieldClass("description")}
          />
        </Field>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            {initialData ? "Save changes" : "Create course"}
          </button>
          {initialData && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default CourseForm;