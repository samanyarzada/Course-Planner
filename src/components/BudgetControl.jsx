import { useState } from "react";

// Quick buttons for the spending limit
const PRESETS = [2000, 3000, 5000];

// Spending limit + balance + sample learner enquiry form
function BudgetControl({ budget, setBudget, totalFee }) {
  const [enquiry, setEnquiry] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sentName, setSentName] = useState("");

  const limit = Number(budget);
  const hasLimit = budget !== "" && limit >= 0;
  const balance = limit - totalFee;

  // Width of the progress bar (0 to 100)
  let percent = 0;
  if (limit > 0) {
    percent = Math.min((totalFee / limit) * 100, 100);
  } else if (totalFee > 0) {
    percent = 100;
  }

  // Bar color: green = safe, amber = almost full, red = over budget
  let barColor = "bg-green-500";
  if (percent > 80) barColor = "bg-amber-500";
  if (hasLimit && balance < 0) barColor = "bg-red-500";

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

  const handleChange = (e) => {
    setEnquiry({ ...enquiry, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {};
    if (!enquiry.name.trim()) newErrors.name = "Name is required.";
    if (!enquiry.email.includes("@")) newErrors.email = "Enter a valid email.";
    if (!enquiry.message.trim()) newErrors.message = "Enquiry text is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Sample only: we do not send the data anywhere
    setSentName(enquiry.name);
    setEnquiry({ name: "", email: "", message: "" });
  };

  return (
    <div className="space-y-6">
      {/* Budget card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">💰 Budget</h2>
        <p className="text-sm text-gray-500">Set your spending limit.</p>

        <label className="mt-4 block text-sm font-medium text-gray-700">Spending limit (AFN)</label>
        <input
          type="number"
          min="0"
          placeholder="Example: 3000"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className={`${inputClass} mt-1`}
        />

        {/* Quick buttons */}
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setBudget(String(value))}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                Number(budget) === value && budget !== ""
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {value} AFN
            </button>
          ))}
        </div>

        {budget === "" && (
          <p className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500">
            Enter a limit to see your balance.
          </p>
        )}

        {budget !== "" && limit < 0 && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            Spending limit cannot be negative.
          </p>
        )}

        {hasLimit && (
          <div className="mt-5">
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-gray-500">Planned fee</span>
              <span className="font-semibold text-gray-900">
                {totalFee} / {limit} AFN
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
            </div>

            <div
              className={`mt-4 rounded-xl px-4 py-3 text-center text-sm font-bold ${
                balance < 0 ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
              }`}
            >
              {balance < 0
                ? `Short by ${Math.abs(balance)} AFN`
                : `Remaining balance: ${balance} AFN`}
            </div>
          </div>
        )}
      </div>

      {/* Enquiry card */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-lg font-bold text-gray-900">✉️ Learner enquiry</h2>
          <p className="text-sm text-gray-500">Have a question? Send us a message.</p>
        </div>

        <div>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={enquiry.name}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={enquiry.email}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <textarea
            name="message"
            rows="3"
            placeholder="Write your enquiry"
            value={enquiry.message}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Send enquiry
        </button>

        {sentName && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Thank you, {sentName}. Your enquiry was saved (sample only).
          </p>
        )}
      </form>
    </div>
  );
}

export default BudgetControl;