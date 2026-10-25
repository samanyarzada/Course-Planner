import { useState } from "react";
const API_URL = `${(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")}/api`;
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", topic: "General question", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

  const contactInfo = [
    { icon: "📧", label: "Email", value: "info@skillhub.example" },
    { icon: "📞", label: "Phone", value: "+93 700 000 000" },
    { icon: "📍", label: "Address", value: "Kabul, Afghanistan" },
    { icon: "🕘", label: "Office hours", value: "Saturday to Thursday, 8:00 to 16:00" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSent(false);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};
  if (!form.name.trim()) newErrors.name = "Name is required.";
  if (!form.email.includes("@")) newErrors.email = "Enter a valid email.";
  if (!form.message.trim()) newErrors.message = "Message is required.";

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  try {
    const response = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setErrors({ message: "Could not send the message. Try again." });
      return;
    }

    setSent(true);
    setForm({ name: "", email: "", topic: "General question", message: "" });
  } catch {
    setErrors({ message: "Cannot reach the server." });
  }
};
  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Contact us</h1>
        <p className="mt-2 text-gray-600">Have a question about a course? We are happy to help.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Contact info */}
        <div className="space-y-4 lg:col-span-2">
          {contactInfo.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                {item.icon}
              </span>
              <div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="font-semibold text-gray-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-3"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Topic</label>
            <select name="topic" value={form.topic} onChange={handleChange} className={inputClass}>
              <option>General question</option>
              <option>Course information</option>
              <option>Fees and payment</option>
              <option>Schedule problem</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              rows="5"
              placeholder="Write your message here"
              value={form.message}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
          </div>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Send message
          </button>

          {sent && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              ✅ Thank you! Your message was received (sample only).
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Contact;