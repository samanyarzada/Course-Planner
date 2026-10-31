import { useState } from "react";
import Icon from "./Icons";

const API_URL = `${(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")}/api`;
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

  // Bar color: green = safe, gold = almost full, red = over budget
  let barColor = "bg-linear-to-r from-emerald-soft to-emerald-deep";
  if (percent > 80) barColor = "bg-linear-to-r from-gold-light to-gold";
  if (hasLimit && balance < 0) barColor = "bg-linear-to-r from-red-400 to-red-600";

  const handleChange = (e) => {
    setEnquiry({ ...enquiry, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!enquiry.name.trim()) newErrors.name = "Name is required.";
    if (!enquiry.email.includes("@")) newErrors.email = "Enter a valid email.";
    if (!enquiry.message.trim()) newErrors.message = "Enquiry text is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...enquiry, topic: "Learner enquiry" }),
      });

      if (!response.ok) {
        setErrors({ message: "Could not send the enquiry. Try again." });
        return;
      }

      setSentName(enquiry.name);
      setEnquiry({ name: "", email: "", message: "" });
    } catch {
      setErrors({ message: "Cannot reach the server." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Budget card */}
      <div className="card-lux p-6">
        <div className="flex items-center gap-3">
          <span className="icon-badge h-10 w-10">
            <Icon name="wallet" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Budget</h2>
            <p className="text-xs text-muted">Set your spending limit.</p>
          </div>
        </div>

        <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.15em] text-muted">
          Spending limit (AFN)
        </label>
        <input
          type="number"
          min="0"
          placeholder="Example: 3000"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="input-lux mt-2"
        />

        {/* Quick buttons */}
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setBudget(String(value))}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 active:scale-95 ${
                Number(budget) === value && budget !== ""
                  ? "border-ink bg-ink text-cream"
                  : "border-line bg-white text-muted hover:border-gold hover:text-ink"
              }`}
            >
              {value} AFN
            </button>
          ))}
        </div>

        {budget === "" && (
          <p className="mt-4 rounded-xl bg-cream px-3 py-2.5 text-sm text-muted">
            Enter a limit to see your balance.
          </p>
        )}

        {budget !== "" && limit < 0 && (
          <p className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">
            Spending limit cannot be negative.
          </p>
        )}

        {hasLimit && (
          <div className="mt-6 animate-drop">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted">Planned fee</span>
              <span className="font-semibold text-ink">
                {totalFee} / {limit} AFN
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2.5 overflow-hidden rounded-full bg-sand">
              <div
                className={`h-full origin-left rounded-full transition-all duration-700 ease-out ${barColor}`}
                style={{ width: `${percent}%` }}
              />
            </div>

            <div
              className={`mt-5 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-center text-sm font-semibold ${
                balance < 0 ? "bg-red-50 text-red-700" : "bg-emerald-deep/10 text-emerald-deep"
              }`}
            >
              <Icon name={balance < 0 ? "alert" : "checkCircle"} className="h-4 w-4" />
              {balance < 0
                ? `Short by ${Math.abs(balance)} AFN`
                : `Remaining balance: ${balance} AFN`}
            </div>
          </div>
        )}
      </div>

      {/* Enquiry card */}
      <form onSubmit={handleSubmit} className="card-lux space-y-3 p-6">
        <div className="mb-2 flex items-center gap-3">
          <span className="icon-badge h-10 w-10">
            <Icon name="mail" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Learner enquiry</h2>
            <p className="text-xs text-muted">Have a question? Send us a message.</p>
          </div>
        </div>

        <div>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={enquiry.name}
            onChange={handleChange}
            className="input-lux"
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
            className="input-lux"
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
            className="input-lux resize-none"
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
        </div>

        <button type="submit" className="btn-gold w-full py-3">
          <Icon name="send" className="h-4 w-4" />
          Send enquiry
        </button>

        {sentName && (
          <p className="animate-drop flex items-center gap-2 rounded-xl bg-emerald-deep/10 px-3 py-2.5 text-sm text-emerald-deep">
            <Icon name="checkCircle" className="h-4 w-4 shrink-0" />
            Thank you, {sentName}. Your enquiry was saved (sample only).
          </p>
        )}
      </form>
    </div>
  );
}

export default BudgetControl;